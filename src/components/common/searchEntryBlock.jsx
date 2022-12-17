import React, { Component } from "react";
import { toast } from "react-toastify";
import SearchChurch from "./searchChurch";
import Input from "./input";
import SearchPerson from "./searchPerson";

class SearchEntryBlock extends Component {
  state = {
    data: {
      entry: "",
    },

    hideSearchChurch: false,
    searchChurchText: "",

    hideSearchPerson: false,
    searchPersonText: "",
  };

  handleChange = async ({ currentTarget: input }) => {
    let { data, searchChurchText, searchPersonText } = { ...this.state };

    data[input.name] = input.value;

    if (input.name === "entry") {
      searchChurchText = "";
      searchPersonText = "";

      this.handleFocusChurch(true);
      this.handleFocusPerson(true);
      this.props.onEntryChange(input.value);
    }

    this.setState({ data, searchChurchText, searchPersonText });
  };

  handleFocusChurch = (value) => {
    setTimeout(() => {
      this.setState({ hideSearchChurch: value });
    }, 200);
  };

  handleFocusPerson = (value) => {
    setTimeout(() => {
      this.setState({ hideSearchPerson: value });
    }, 200);
  };

  handleSelectChurch = async (church) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    if (church.id === 0) {
      toast.error("Lo sentimos, no puede crear una nueva iglesia desde aqui.");
      return false;
    }

    const data = { ...this.state.data };
    data.church_id = church.id;
    data.entry = "";

    this.setState({
      data,
      hideSearchChurch: true,
      searchChurchText: `${church.global_title}`,
    });

    this.props.onChurchChange(church.id);
  };

  handleSelectPerson = async (person) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    if (person.id === 0) {
      toast.error("Lo sentimos, no puede crear un nuevo miembro desde aqui.");
      return false;
    }

    const data = { ...this.state.data };
    data.person_id = person.id;
    data.entry = "";

    this.setState({
      data,
      hideSearchPerson: true,
      searchPersonText: `${person.first_name} ${person.last_name}`,
    });

    this.props.onPersonChange(person.id);
  };

  handleClearChurchSelection = () => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    this.handleSelectChurch({ id: null, global_title: "", shepherd: {} });
    this.setState({ searchChurchText: "" });
  };

  handleClearPersonSelection = () => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    this.handleSelectPerson({ id: null, first_name: "", last_name: "" });
    this.setState({ searchPersonText: "" });
  };

  render() {
    return (
      <React.Fragment>
        <div className="d-flex">
          <div>
            <Input
              name="entry"
              value={this.state.data.entry}
              onChange={this.handleChange}
              placeholder="Número de Transacción"
              label="Transacción No."
            />
          </div>

          <div className="ml-4 w-25">
            <SearchChurch
              onSelect={this.handleSelectChurch}
              onFocus={() => this.handleFocusChurch(false)}
              onBlur={() => this.handleFocusChurch(true)}
              hide={this.state.hideSearchChurch}
              value={this.state.searchChurchText}
              label="Iglesia"
              name="searchChurch"
            />
          </div>
          <div>
            {this.state.searchChurchText && (
              <div
                style={{
                  marginTop: "36px",
                }}
              >
                <span
                  className="fa fa-trash text-danger"
                  style={{
                    fontSize: "20px",
                    position: "absolute",
                    marginLeft: "-21px",
                    cursor: "pointer",
                  }}
                  title="Limpiar filtro de iglesia"
                  onClick={this.handleClearChurchSelection}
                ></span>
              </div>
            )}
          </div>

          <div className="ml-4 w-25">
            <SearchPerson
              onSelect={this.handleSelectPerson}
              onFocus={() => this.handleFocusPerson(false)}
              onBlur={() => this.handleFocusPerson(true)}
              hide={this.state.hideSearchPerson}
              value={this.state.searchPersonText}
              label="Miembro"
              name="searchPerson"
            />
          </div>
          <div className="col">
            {this.state.searchPersonText && (
              <div
                style={{
                  marginTop: "36px",
                }}
              >
                <span
                  className="fa fa-trash text-danger"
                  style={{
                    fontSize: "20px",
                    position: "absolute",
                    marginLeft: "-36px",
                    cursor: "pointer",
                  }}
                  title="Limpiar filtro de miembro"
                  onClick={this.handleClearPersonSelection}
                ></span>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SearchEntryBlock;
