import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const SearchConcept = (props) => {
  const [searching, setSearching] = useState(true);
  const [conceptName, setConceptName] = useState(props.value);
  const search = useRef("");

  useEffect(() => {
    console.log('SEARCHING useEffect state:', searching)
    console.log('SEARCHING prop useEffect state:', props.searching)

    if (searching && props.searching)  {
      setConceptName(props.value);
        console.log('EFFECT called:', props.value, conceptName)
        setSearching(true);
    } else {
      setSearching(false);
      console.log('CLEAN concept')
      setConceptName('');
      props.onClearSearchConcept();
    }
  }, [props.value, props.searching]);
  
  const handleOnSearch = async (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    // props.onClearSearchConcept(true);
    if (string === "") results = [];

    console.log('searching:', string)
    // console.log('searching results:', results)
    console.log('SEARCHING state:', searching)
  };

  const handleOnSelect = (concept) => {
    setSearching(false);
    props.onSelect(concept);
    props.onClearSearchConcept();

    console.log('SEARCHING select state:', searching)

    // console.log(concept);
  };

  const formatResult = (concept) => {
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

  return (
    <div>
      <label htmlFor="">Concepto</label>
      <ReactSearchAutocomplete
        autoFocus
        items={props.allConcepts}
        onSearch={handleOnSearch}
        onSelect={handleOnSelect}
        inputSearchString={conceptName}
        formatResult={formatResult}
        fuseOptions={{ keys: ["description"] }} // Search on both fields
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
  );
};

export default SearchConcept;
