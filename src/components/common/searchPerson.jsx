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
  }, [onClearSearchPerson, clearSearchPerson]);

  useEffect(() => {
    if (personName !== value) {
      setPersonName(value);
    }
  }, [value, personName]);

  const formatResult = (person) => {
    return (
      <div style={{ cursor: "pointer" }}>
        <span className="d-block">
          {person.first_name} {person.last_name}
        </span>
      </div>
    );
  };

  return (
    <div>
      <label htmlFor="">Diezmo de Miembro</label>
      <ReactSearchAutocomplete
        items={data}
        onSelect={handleOnSelect}
        formatResult={formatResult}
        onSearch={handleOnSearch}
        inputSearchString={personName}
        placeholder="Nombre del miembro"
        fuseOptions={{ keys: ["full_name"] }} // Search on both fields
        resultStringKeyName="full_name" // String to display in the results
        showIcon={false}
        showNoResultsText="No existe ningún miembro con dicho nombre."
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
