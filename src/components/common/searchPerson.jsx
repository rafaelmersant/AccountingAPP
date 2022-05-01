import React, { Component } from "react";
import Input from "./input";
import { getPeopleByName } from "../../services/personService";

class SearchPerson extends Component {
  state = {
    people: [],
    erros: {},
    searchPersonInput: "",
  };

  handleChange = async ({ currentTarget: input }) => {
    this.setState({ searchPersonInput: input.value });

    let { data: people } = await getPeopleByName(input.value);

    people = people.results;

    if (input.value === "") people = [];

    if (input.value.length > 0 && people.length === 0)
      people = [
        {
          id: 0,
          global_title: "No hay registros con este nombre",
        },
      ];

    this.setState({ people });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.hide && this.props === nextProps) return false;
    else return true;
  }

  componentDidUpdate() {
    if (this.props.hide) this.setState({ searchPersonInput: this.props.value });
  }

  render() {
    const { onSelect, onFocus, onBlur, hide, label = "" } = this.props;
    const { people } = this.state;

    return (
      <div>
        <Input
          type="text"
          id="searchPersonId"
          name="query"
          className="form-control form-control-sm"
          placeholder="Buscar por nombre..."
          autoComplete="Off"
          onChange={this.handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          value={this.state.searchPersonInput}
          label={label}
        />

        {people && !hide && (
          <div
            className="list-group col-11 shadow-lg bg-white position-absolute p-0"
            style={{ marginTop: "-15px", zIndex: "999", maxWidth: "500px" }}
          >
            {people.map((person) => (
              <button
                key={person.id}
                onClick={() => onSelect(person)}
                className="list-group-item list-group-item-action w-100"
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
  }
}

export default SearchPerson;
