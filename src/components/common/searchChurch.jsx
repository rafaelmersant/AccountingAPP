import React, { useCallback, useEffect, useState } from "react";
import Input from "./input";
import { getChurchesByName } from "../../services/churchService";
import { debounce } from "throttle-debounce";

const SearchChurch = (props) => {
  const [churches, setChurches] = useState([]);
  const [churchName, setChurchName] = useState(props.value);

  useEffect(() => {
    if (props.value) setChurchName(props.value);

    if (props.hide && props.clearSearchChurch) {
      setChurchName("");
      handleSearchChurch("");
    }
  }, [churchName, props]);

  const debounced = useCallback(
    debounce(400, (nextValue) => {
      handleSearchChurch(nextValue);
    }),
    []
  );

  const handleSelectChurch = (church) => {
    setChurchName(church.globa_title);
    props.onSelect(church);
  };

  const handleSearchChurch = async (value) => {
    if (value.length >= 0) {
      const churchNameQuery = value.toUpperCase().split(" ").join("%20");

      let { data: _churches } = await getChurchesByName(churchNameQuery);

      _churches = _churches.results;

      if (value === "" || value.length < 1) _churches = [];

      if (value.length > 0 && _churches.length === 0) {
        _churches = [
          {
            id: 0,
            global_title: "No existe esta iglesia, desea crearla?",
          },
        ];
      }

      setChurches(_churches);
    } else {
      setChurches([]);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setChurchName(value);

    debounced(value);
  };

  const { onFocus, onBlur, hide, label = "" } = props;

  return (
    <div>
      <Input
        type="text"
        id="searchChurchId"
        name="query"
        className="form-control form-control-sm"
        placeholder="Buscar iglesia..."
        autoComplete="Off"
        onChange={(e) => handleChange(e)}
        onFocus={onFocus}
        onBlur={onBlur}
        value={churchName}
        label={label}
        disabled={true}
      />

      {churches.length > 0 && !hide && (
        <div
          className="list-group col-12 shadow bg-white position-absolute p-0"
          style={{ marginTop: "-15px", zIndex: "999", maxWidth: "600px" }}
        >
          {churches.map((church) => (
            <button
              key={church.id}
              onClick={() => handleSelectChurch(church)}
              className="list-group-item list-group-item-action w-100 py-2"
            >
              <span className="d-block">{church.global_title}</span>
              <span className="text-info mb-0" style={{ fontSize: ".9em" }}>
                {church.shepherd && (
                  <em>
                    {"Pastor(a): " +
                      church.shepherd.first_name +
                      " " +
                      church.shepherd.last_name}
                  </em>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchChurch;
