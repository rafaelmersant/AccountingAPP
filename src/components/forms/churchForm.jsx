import React from "react";
import Form from "../common/form";
import Joi from "joi-browser";
import { getCurrentUser } from "../../services/authService";
import { getChurch, saveChurch } from "../../services/churchService";
import SearchPerson from "../common/searchPerson";
import PersonModal from "../modals/personModal";
import Select from "../common/select";
import { getPeople } from "../../services/personService";

class ChurchForm extends Form {
  state = {
    data: {
      id: 0,
      global_title: "",
      local_title: "",
      location: "",
      shepherd_id: "",
      zone: "",
      created_by: getCurrentUser().id,
      created_date: new Date().toISOString(),
    },
    errors: {},
    action: "Nueva Iglesia",
    searchPersonText: "",
    searchPersonTextType: "",
    clearSearchPerson: false,
    zones: [
      { id: "Cibao Central", name: "Cibao Central" },
      { id: "Metropolitana", name: "Metropolitana" },
      { id: "Santo Domingo Este A", name: "Santo Domingo Este A" },
      { id: "Santo Domingo Este B", name: "Santo Domingo Este B" },
      { id: "Santo Domingo Este C-A", name: "Santo Domingo Este C-A" },
      { id: "Santo Domingo Este C-B", name: "Santo Domingo Este C-B" },
      { id: "Santo Domingo Este D", name: "Santo Domingo Este D" },
      { id: "Santo Domingo Este D-2", name: "Santo Domingo Este D-2" },
      { id: "Santo Domingo Este D-2A", name: "Santo Domingo Este D-2A" },
      { id: "Santo Domingo Oeste-A", name: "Santo Domingo Oeste-A" },
      { id: "Santo Domingo Oeste-B", name: "Santo Domingo Oeste-B" },
      { id: "Region Este", name: "Region Este" },
      { id: "Sur A-1", name: "Sur A-1" },
      { id: "Sur A-2", name: "Sur A-2" },
      { id: "Sur A-3", name: "Sur A-3" },
      { id: "Sur B", name: "Sur B" },
      { id: "Sur C", name: "Sur C" },
      { id: "Sur D", name: "Sur D" },
      { id: "Sur E", name: "Sur E" },
      { id: "Sur Lejano", name: "Sur Lejano" },
      { id: "USA-Caribe", name: "USA-Caribe" },
      { id: "Europa", name: "Europa" },
    ],
  };

  schema = {
    id: Joi.number(),
    global_title: Joi.optional().label("Titulo Conciliar"),
    local_title: Joi.optional().label("Titulo Local"),
    location: Joi.optional().label("Ubicación"),
    shepherd_id: Joi.optional().label("Pastor"),
    zone: Joi.optional().label("Presbiterio"),
    created_by: Joi.number(),
    created_date: Joi.string(),
  };

  async populateChurch() {
    try {
      const churchId = this.props.match.params.id;
      if (churchId === "new") return;

      const { data: church } = await getChurch(churchId);
      const shepherd = church.results[0].shepherd
        ? church.results[0].shepherd.first_name +
          " " +
          church.results[0].shepherd.last_name
        : "";

      this.setState({
        data: this.mapToViewModel(church.results),
        action: "Editar iglesia",
        searchPersonText: shepherd,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  async populatePeople() {
    const { data: people } = await getPeople();
    this.setState({ people: people.results });
  }

  async componentDidMount() {
    await this.populateChurch();
    await this.populatePeople();
  }

  handleSelectPerson = async (person) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    const data = { ...this.state.data };
    data.shepherd_id = person.id;

    this.setState({
      data,
      clearSearchPerson: false,
      searchPersonText: `${person.first_name} ${person.last_name}`,
    });
  };

  handleCleanPerson = async () => {
    const { data } = { ...this.state };
    data.shepherd_id = 0;
    this.setState({ data, searchPersonText: "" });
  };

  handleSetNewPerson = (e) => {
    this.handleSelectPerson(e);
  };

  handleTypingPerson = (value) => {
    this.setState({ searchPersonTextType: value });
  };

  handleSearchPerson = async (value) => {
    this.setState({ clearSearchPerson: value });
  };

  mapToViewModel(church) {
    return {
      id: church[0].id,
      global_title: church[0].global_title,
      local_title: church[0].local_title ? church[0].local_title : "",
      location: church[0].location ? church[0].location : "",
      shepherd_id: church[0].shepherd ? church[0].shepherd.id : "",
      zone: church[0].zone ? church[0].zone : "",
      created_by: church[0].created_by
        ? church[0].created_by
        : getCurrentUser().id,
      created_date: church[0].created_date,
    };
  }

  doSubmit = async () => {
    const { data } = { ...this.state };
    const { data: church } = await saveChurch(data);

    if (!this.props.popUp) this.props.history.push("/iglesias");
    else this.props.closeMe(church);
  };

  render() {
    const { popUp } = this.props;

    return (
      <div className="container-fluid">
        <h3 className="bg-dark text-light pl-2 pr-2">{this.state.action}</h3>
        <div className="col-12 pb-3 bg-light">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-7">
                {this.renderInput("global_title", "Titulo Conciliar")}
              </div>
            </div>
            <div className="row">
              <div className="col-7">
                {this.renderInput("local_title", "Titulo Local")}
              </div>
            </div>
            <div className="row">
              <div className="col-7">
                <SearchPerson
                  onSelect={this.handleSelectPerson}
                  onTyping={this.handleTypingPerson}
                  onClearSearchPerson={this.handleSearchPerson}
                  clearSearchPerson={this.state.clearSearchPerson}
                  value={this.state.searchPersonText}
                  data={this.state.people}
                />
              </div>
              <div>
                {this.state.data.shepherd_id > 0 && (
                  <div
                    style={{
                      marginTop: "36px",
                    }}
                  >
                    <span
                      className="fa fa-trash text-danger"
                      style={{
                        fontSize: "24px",
                        position: "absolute",
                        marginLeft: "-39px",
                        cursor: "pointer",
                        zIndex: 3
                      }}
                      title="Limpiar filtro de pastor"
                      onClick={this.handleCleanPerson}
                    ></span>
                  </div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-7">
                <Select
                  name="zone"
                  value={this.state.data.zone}
                  label="Presbiterio"
                  options={this.state.zones}
                  onChange={this.handleChange}
                  error={null}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-7">
                {this.renderInput("location", "Ubicación")}
              </div>
            </div>
            {this.renderButton("Guardar")}
          </form>
        </div>

        {!popUp && (
          <div>
            <button
              type="button"
              data-toggle="modal"
              data-target="#personModal"
              hidden="hidden"
              ref={(button) => (this.raisePersonModal = button)}
            ></button>

            <PersonModal popUp={false} setNewPerson={this.handleSetNewPerson} />
          </div>
        )}
      </div>
    );
  }
}

export default ChurchForm;
