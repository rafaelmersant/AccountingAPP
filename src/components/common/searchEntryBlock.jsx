import React, { Component } from "react";
import SearchChurch from "./searchChurch";
import Input from "./input";
import SearchPerson from "./searchPerson";
import { getPeople } from "../../services/personService";
import { getChurches } from "../../services/churchService";

class SearchEntryBlock extends Component {
  state = {
    data: {
      entry: "",
    },

    searchChurchText: "",
    searchPersonText: "",
    searchChurchTextType: "",
    searchCPersonTextType: "",
    clearSearchChurch: false,
    clearSearchPerson: false,
  };

  async populatePeople() {
    const { data: people } = await getPeople();
    this.setState({ people: people.results });
  }

  async populateChurches() {
    const { data: churches } = await getChurches();
    this.setState({ churches: churches.results });
  }

  async componentDidMount() {
    await this.populatePeople();
    await this.populateChurches();
  }

  handleChange = async ({ currentTarget: input }) => {
    let { data, searchChurchText, searchPersonText } = { ...this.state };

    data[input.name] = input.value;

    if (input.name === "entry") {
      searchChurchText = "";
      searchPersonText = "";

      this.props.onEntryChange(input.value);
    }

    this.setState({ data, searchChurchText, searchPersonText });
  };

  handleSelectChurch = async (church) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    const data = { ...this.state.data };
    data.church_id = church.id;
    data.entry = "";

    this.setState({
      data,
      clearSearchChurch: false,
      searchChurchText: `${church.global_title}`,
    });

    this.props.onChurchChange(church.id);
  };

  handleSelectPerson = async (person) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

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

  handleTypingChurch = (value) => {
    this.setState({ searchChurchTextType: value });
  };

  handleSearchChurch = async (value) => {
    this.setState({ clearSearchChurch: value });
  };

  handleTypingPerson = (value) => {
    this.setState({ searchPersonTextType: value });
  };

  handleSearchPerson = async (value) => {
    this.setState({ clearSearchPerson: value });
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
              onTyping={this.handleTypingChurch}
              onClearSearchChurch={this.handleSearchChurch}
              clearSearchChurch={this.state.clearSearchChurch}
              value={this.state.searchChurchText}
              data={this.state.churches}
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
                    zIndex: 3,
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
              onTyping={this.handleTypingPerson}
              onClearSearchPerson={this.handleSearchPerson}
              clearSearchPerson={this.state.clearSearchPerson}
              value={this.state.searchPersonText}
              data={this.state.people}
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
                    zIndex: 3
                  }}
                  title="Limpiar filtro de obrero"
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
