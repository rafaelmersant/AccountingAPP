import React, { useCallback, useEffect, useState } from "react";
import Input from "./input";
import { getConceptsByName } from "../../services/conceptService";
import _ from "lodash";
import { debounce } from "throttle-debounce";

const SearchConcept = (props) => {
  const [concepts, setConcepts] = useState([]);
  const [conceptName, setConceptName] = useState(props.value);

  useEffect(() => {
    if (props.value) setConceptName(props.value);

    if (props.hide && props.clearSearchConcept) {
      setConceptName("");
      handleSearchConcept("");
    }
  }, [conceptName, props]);

  const debounced = useCallback(
    debounce(400, (nextValue) => {
      handleSearchConcept(nextValue);
    }),
    []
  );

  const handleSelectConcept = (concept) => {
    setConceptName(concept.description);
    props.onSelect(concept);
  };

  const handleSearchConcept = async (value) => {
    if (value.length >= 0) {
      const conceptNameQuery = value.toUpperCase().split(" ").join("%20");

      let { data: _concepts } = await getConceptsByName(
        conceptNameQuery
      );

      _concepts = _concepts.results;

      if (value === "" || value.length < 1) _concepts = [];

      if (value.length > 0 && _concepts.length === 0) {
        _concepts = [
          {
            id: 0,
            description: "No existe el concepto, desea crearlo?",
          },
        ];
      }

      _concepts = _concepts.length
        ? _.orderBy(_concepts, ["ocurrences"], ["desc"])
        : _concepts;

      setConcepts(_concepts);
    } else {
      setConcepts([]);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setConceptName(value);

    debounced(value);
  };

  const { onFocus, onBlur, hide, label = "" } = props;

  return (
    <div>
       <Input
          type="text"
          id="searchConceptId"
          name="query"
          className="form-control form-control-sm"
          placeholder="Buscar concepto..."
          autoComplete="Off"
          onChange={(e) => handleChange(e)}
          onFocus={onFocus}
          onBlur={onBlur}
          value={conceptName}
          label={label}
        />

      {concepts.length > 0 && !hide && (
        <div
          className="list-group col-12 shadow bg-white position-absolute p-0"
          style={{ marginTop: "-15px", zIndex: "999", maxWidth: "600px" }}
        >
          {concepts.map((concept) => (
            <button
              key={concept.id}
              onClick={() => handleSelectConcept(concept)}
              className="list-group-item list-group-item-action w-100 py-2"
            >
             <span className="d-block">{concept.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchConcept;
