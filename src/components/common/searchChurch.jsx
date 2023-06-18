import React, { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const SearchChurch = ({
  clearSearchChurch,
  onSelect,
  onTyping,
  onClearSearchChurch,
  data,
  value
}) => {
  const [churchName, setChurchName] = useState(value);
  const [valueSearch, setValueSearch] = useState(value);
  
  const handleOnSelect = (church) => {
    onSelect(church);
  };

  const handleOnSearch = (string, results) => {
    onTyping(string);
    
    results = results.filter(e => e.global_title.includes(string));
  }

  useEffect(() => {
    if (clearSearchChurch) {
      setChurchName(" ");
      onClearSearchChurch(false);
    }

    if (!clearSearchChurch) {
      setValueSearch(value);
    }
  }, [onClearSearchChurch, clearSearchChurch, value]);

  const formatResult = (church) => {
    return (
      <div style={{ cursor: "pointer" }}>
         <span className="d-block">{church.global_title}</span>
              {/* <span className="text-info mb-0" style={{ fontSize: ".9em" }}>
                {church.shepherd && (
                  <em>
                    {"Pastor(a): " +
                      church.shepherd.first_name +
                      " " +
                      church.shepherd.last_name}
                  </em>
                )}
              </span> */}
              <hr style={{margin: "0", padding: "0", marginTop: "5px"}}/>
      </div>
    );
  };

  return (
    <div>
      <label htmlFor="">Cursos</label>
      <ReactSearchAutocomplete
        items={data}
        onSelect={handleOnSelect}
        formatResult={formatResult}
        onSearch={handleOnSearch}
        inputSearchString={churchName}
        placeholder={valueSearch ? valueSearch : "Digitar Curso"}
        fuseOptions={{ keys: ["global_title", "shepherd_full_name"] }} // Search on both fields
        resultStringKeyName="global_title" // String to display in the results
        showIcon={false}
        showNoResultsText="No existe ningún curso con dicho nombre."
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
          zIndex: 3,
        }}
      />
    </div>
  );
};

export default SearchChurch;