import React, { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const SearchConcept = ({
  clearSearchConcept,
  onSelect,
  onClearSearchConcept,
  data,
  value
}) => {
  const [conceptName, setConceptName] = useState(value);
  
  const handleOnSelect = (concept) => {
    onSelect(concept);
  };

  useEffect(() => {
    if (clearSearchConcept) {
      setConceptName(" ");
      onClearSearchConcept(false);
    }
  }, [onClearSearchConcept, clearSearchConcept]);

  useEffect(() => {
    if (conceptName !== value) {
      setConceptName(value);
    }
  }, [value, conceptName, data]);

  const formatResult = (concept) => {
    return (
      <div style={{ cursor: "pointer" }}>
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
        items={data}
        onSelect={handleOnSelect}
        formatResult={formatResult}
        inputSearchString={conceptName}
        fuseOptions={{ keys: ["description"] }} // Search on both fields
        resultStringKeyName="description" // String to display in the results
        showIcon={false}
        showNoResultsText="No existe el concepto."
        styling={{
          height: "30px",
          borderRadius: "4px",
          backgroundColor: "white",
          boxShadow: "none",
          hoverBackgroundColor: "#f6f6f6",
          color: "#495057",
          cursor: "Pointer",
          fontFamily: "Inherit",
          clearIconMargin: "-2px 3px 0 0",
          // zIndex: 2,
        }}
      />
    </div>
  );
};

export default SearchConcept;
