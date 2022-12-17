import React, { useCallback, useEffect, useState } from "react";
// import Input from "./input";
import { getConceptsByName } from "../../services/conceptService";
import _ from "lodash";
import { debounce } from "throttle-debounce";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

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

  // const handleSelectConcept = (concept) => {
  //   setConceptName(concept.description);
  //   props.onSelect(concept);
  // };

  const handleSearchConcept = async (value) => {
    if (value.length >= 0) {
      const conceptNameQuery = value.toUpperCase().split(" ").join("%20");

      let { data: _concepts } = await getConceptsByName(conceptNameQuery);

      _concepts = _concepts.results;

      if (value === "" || value.length < 1) _concepts = [];

      if (value.length > 0 && _concepts.length === 0) {
        _concepts = [
          {
            id: 0,
            description: "No existe el concepto, desea crearlo?",
            type: "E",
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

  // const handleChange = (event) => {
  //   const value = event.target.value;
  //   setConceptName(value);
  //   debounced(value);
  // };

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    setConceptName(string);
    debounced(string);
  }

  const handleOnHover = (result) => {
    // the item hovered
    // console.log(result)
  }

  const handleOnSelect = (concept) => {
    props.onSelect(concept);
    console.log(concept)
  }

  const handleOnFocus = () => {
    // console.log('Focused')
  }

  const formatResult = (concept) => {
    return (
      <>
        <span className="d-block">{concept.description}</span>
        <span className="text-info mb-0" style={{ fontSize: ".9em" }}>
          <em>
            {"Tipo: " +
              concept.type.replace("S", "Salida").replace("E", "Entrada")}
          </em>
        </span>
      </>
    );
  };

  const { onFocus, onBlur, hide, label = "" } = props;

  return (
    <div>
      <label htmlFor="">Concepto</label>
      <ReactSearchAutocomplete
        items={concepts}
        onSearch={handleOnSearch}
        onHover={handleOnHover}
        onSelect={handleOnSelect}
        onFocus={handleOnFocus}
        autoFocus
        formatResult={formatResult}
        fuseOptions={{ keys: ["type", "description"] }} // Search on both fields
        resultStringKeyName="description" // String to display in the results
        showIcon={false}
        styling={{
          height: "30px",
          // border: "1px solid darkgreen",
          borderRadius: "4px",
          backgroundColor: "white",
          boxShadow: "none",
          hoverBackgroundColor: "#f6f6f6",
          color: "#495057",
          cursor: "Pointer",
          // fontSize: "12px",
          fontFamily: "Inherit",
          // iconColor: "green",
          // lineColor: "lightgreen",
          // placeholderColor: "darkgreen",
          clearIconMargin: "-2px 3px 0 0",
          zIndex: 2,
        }}
      />
    </div>

    // <div>
    //   <Input
    //     type="text"
    //     id="searchConceptId"
    //     name="query"
    //     className="form-control form-control-sm"
    //     placeholder="Buscar concepto..."
    //     autoComplete="Off"
    //     onChange={(e) => handleChange(e)}
    //     onFocus={onFocus}
    //     onBlur={onBlur}
    //     value={conceptName}
    //     label={label}
    //   />

    //   {concepts.length > 0 && !hide && (
    //     <div
    //       className="list-group col-12 shadow bg-white position-absolute p-0"
    //       style={{ marginTop: "-15px", zIndex: "999", maxWidth: "600px" }}
    //     >
    //       {concepts.map((concept) => (
    //         <div
    //           key={concept.id}
    //           onClick={() => handleSelectConcept(concept)}
    //           className="list-group-item list-group-item-action w-100 py-2 bg-info"
    //         >
    //           <span className="d-block">{concept.description}</span>
    //           <span className="text-info mb-0" style={{ fontSize: ".9em" }}>
    //             <em>
    //               {"Tipo: " +
    //                 concept.type.replace("S", "Salida").replace("E", "Entrada")}
    //             </em>
    //           </span>
    //         </div>
    //       ))}
    //     </div>
    //   )}
    // </div>
  );
};

export default SearchConcept;
