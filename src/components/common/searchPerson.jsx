import React, { useCallback, useEffect, useState } from "react";
import Input from "./input";
import { getPeopleByName } from "../../services/personService";
import { debounce } from "throttle-debounce";

const SearchPerson = (props) => {
  const [people, setPeople] = useState([]);
  const [personName, setPersonName] = useState(props.value);

  useEffect(() => {
    if (props.value) setPersonName(props.value);

    if (props.hide && props.clearSearchPerson) {
      setPersonName("");
      handleSearchPerson("");
    }
  }, [personName, props]);

  const debounced = useCallback(
    debounce(400, (nextValue) => {
      handleSearchPerson(nextValue);
    }),
    []
  );

  const handleSelectPerson = (person) => {
    setPersonName(person.first_name + " " + person.last_name);
    props.onSelect(person);
  };

  const handleSearchPerson = async (value) => {
    if (value.length >= 0) {
      const personNameQuery = value.toUpperCase().split(" ").join("%20");

      let { data: _people } = await getPeopleByName(personNameQuery);

      _people = _people.results;

      if (value === "" || value.length < 1) _people = [];

      if (value.length > 0 && _people.length === 0) {
        _people = [
          {
            id: 0,
            first_name: "No hay registros con este nombre, desea crearlo?",
          },
        ];
      }

      setPeople(_people);
    } else {
      setPeople([]);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setPersonName(value);

    debounced(value);
  };

  const { onFocus, onBlur, hide, label = "" } = props;

  return (
    <div>
      <Input
        type="text"
        id="searchPersonId"
        name="query"
        className="form-control form-control-sm"
        placeholder="Buscar miembro..."
        autoComplete="Off"
        onChange={(e) => handleChange(e)}
        onFocus={onFocus}
        onBlur={onBlur}
        value={personName}
        label={label}
      />

      {people.length > 0 && !hide && (
        <div
          className="list-group col-12 shadow bg-white position-absolute p-0"
          style={{ marginTop: "-15px", zIndex: "999", maxWidth: "600px" }}
        >
          {people.map((person) => (
            <button
              key={person.id}
              onClick={() => handleSelectPerson(person)}
              className="list-group-item list-group-item-action w-100 py-2"
            >
              <span className="d-block">
                {person.first_name} {person.last_name}
              </span>
              <span className="text-info mb-0" style={{ fontSize: ".9em" }}>
                {person.church && (
                  <em>{"Iglesia: " + person.church.global_title}</em>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPerson;
