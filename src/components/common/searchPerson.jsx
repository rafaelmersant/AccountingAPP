import React, { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const SearchPerson = ({
  clearSearchPerson,
  onSelect,
  onTyping,
  onClearSearchPerson,
  data,
  value
}) => {
  const [personName, setPersonName] = useState(value);
  const [valueSearch, setValueSearch] = useState(value);
  
  const handleOnSelect = (person) => {
    onSelect(person);
  };

  const handleOnSearch = (string, results) => {
    onTyping(string);
    
    results = results.filter(e => e.full_name.includes(string));
  }

  useEffect(() => {
    if (clearSearchPerson) {
      setPersonName(" ");
      onClearSearchPerson(false);
    }

    if (!clearSearchPerson) {
      setValueSearch(value);
    }
  }, [onClearSearchPerson, clearSearchPerson, value]);

  const formatResult = (person) => {
    return (
      <div style={{ cursor: "pointer" }}>
         <span className="d-block">
                {person.first_name} {person.last_name}
              </span>
              <span className="text-info mb-0" style={{ fontSize: ".9em" }}>
                {person.church && (
                  <em>{"Iglesia: " + person.church.global_title}</em>
                )}
              </span>
              <hr style={{margin: "0", padding: "0", marginTop: "5px"}}/>
      </div>
    );
  };

  return (
    <div>
      <label htmlFor="">Estudiante</label>
      <ReactSearchAutocomplete
        items={data}
        onSelect={handleOnSelect}
        formatResult={formatResult}
        onSearch={handleOnSearch}
        inputSearchString={personName}
        placeholder={valueSearch ? valueSearch : "Digitar estudiante"}
        fuseOptions={{ keys: ["full_name"] }} // Search on both fields
        resultStringKeyName="full_name" // String to display in the results
        showIcon={false}
        showNoResultsText="No existe ningún estudiante con dicho nombre."
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
          zIndex: 2,
        }}
      />
    </div>
  );
};

export default SearchPerson;