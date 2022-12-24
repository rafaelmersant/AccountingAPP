import React, { useEffect, useState } from "react";
// import Input from "./input";
import { getConceptsByName } from "../../services/conceptService";
import _ from "lodash";
// import { debounce } from "throttle-debounce";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const SearchConcept = (props) => {
  const [concepts, setConcepts] = useState([]);
  const [conceptName, setConceptName] = useState(props.value);

  useEffect(() => {
    if (props.value) setConceptName(props.value);

    if (props.clearSearchConcept) {
      setConceptName("");
      // handleSearchConcept("");
      props.onClearSearchConcept(false);
    }
  }, [concepts, conceptName, props]);

  const handleSearchConcept = async (value) => {
    console.log('this will be searched:', value)
    if (value.length >= 0) {
      const conceptNameQuery = value.toUpperCase().split(" ").join("%20");

      let { data: _concepts } = await getConceptsByName(conceptNameQuery);
      console.log('FIRST concepts:', _concepts);
      _concepts = _concepts.results;
      setConcepts(_concepts.results);

      if (value === "" || value.length < 1) _concepts = [];

      if (value.length > 0 && _concepts.length === 0) {
        _concepts = [
          {
            id: 0,
            description: "No existe el concepto, desea crearlo?",
            type: "E",
            created_date: new Date().toJSON(),
            created_by: 1
          },
        ];
      }

      // _concepts = _concepts.length
      //   ? _.orderBy(_concepts, ["ocurrences"], ["desc"])
      //   : _concepts;

        console.log('_concepts:', _concepts)
      setConcepts(_concepts);
      console.log('concepts:', concepts)

    } else {
      setConcepts([]);
    }
  };

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    // setConceptName(string);

    console.log('searching:', string)
    console.log('searching results:', results)
    handleSearchConcept(string);
    // debounced(string);
  };

  const handleOnSelect = (concept) => {
    props.onSelect(concept);
    // console.log(concept);
  };

  const handleOnFocus = () => {
    if (props.clearSearchConcept) {
      setConceptName("");
      props.onClearSearchConcept(false);
    }
  }

  const formatResult = (concept) => {
    console.log('Format Result WAS CALLED.')
    return (
      <div>
        <span className="d-block">{concept.description}</span>
        <span className="text-info mb-0" style={{ fontSize: ".9em" }}>
          <em>
            {"Tipo: " +
              concept.type.replace("S", "Salida").replace("E", "Entrada")}
          </em>
        </span>
      </div>
    );
  };

  const { onFocus, onBlur, hide, label = "" } = props;

  return (
    <div>
      <label htmlFor="">Concepto</label>
      <ReactSearchAutocomplete
        items={concepts}
        onSearch={handleOnSearch}
        onSelect={handleOnSelect}
        onFocus={handleOnFocus}
        // onClear={() => setConceptName("")}
        inputSearchString={conceptName}
        inputDebounce={400}
        formatResult={formatResult}
        fuseOptions={{ keys: ["type", "description"] }} // Search on both fields
        resultStringKeyName="description" // String to display in the results
        showIcon={false}
        showNoResultsText="No existe el concepto."
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
