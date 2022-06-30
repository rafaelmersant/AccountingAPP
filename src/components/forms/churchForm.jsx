import React from "react";
import Form from "../common/form";
import Joi from "joi-browser";
import { getCurrentUser } from "../../services/authService";
import { getChurch, saveChurch } from "../../services/churchService";
import SearchPerson from "../common/searchPerson";
import PersonModal from "../modals/personModal";

class ChurchForm extends Form {
  state = {
    data: {
      id: 0,
      global_title: "",
      local_title: "",
      location: "",
      shepherd_id: "",
      created_by: getCurrentUser().id,
      created_date: new Date().toISOString(),
    },
    errors: {},
    action: "Nueva Iglesia",
    hideSearchPerson: false,
    searchPersonText: "",
    clearSearchPerson: false,
  };

  schema = {
    id: Joi.number(),
    global_title: Joi.optional().label("Titulo Conciliar"),
    local_title: Joi.optional().label("Titulo Local"),
    location: Joi.optional().label("Ubicación"),
    shepherd_id: Joi.optional().label("Pastor"),
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
          church.results[0].shepherd.first_name
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

  async componentDidMount() {
    await this.populateChurch();
  }

  handleSelectPerson = async (person) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    if (person.id === 0) {
      this.raisePersonModal.click();
      return false;
    }

    const data = { ...this.state.data };
    data.shepherd_id = person.id;

    this.setState({
      data,
      hideSearchPerson: true,
      clearSearchPerson: false,
      searchPersonText: `${person.first_name} ${person.last_name}`,
    });
  };

  handleFocusPerson = (value) => {
    setTimeout(() => {
      this.setState({ hideSearchPerson: value });
    }, 200);
  };

  handleCleanPerson = async () => {
    const { data } = { ...this.state };
    data.shepherd_id = 0;
    this.setState({ data, searchPersonText: "" });
  };

  handleSetNewPerson = (e) => {
    this.handleSelectPerson(e);
  };

  mapToViewModel(church) {
    return {
      id: church[0].id,
      global_title: church[0].global_title,
      local_title: church[0].local_title ? church[0].local_title : "",
      location: church[0].location ? church[0].location : "",
      shepherd_id: church[0].shepherd ? church[0].shepherd.id : "",
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
                  onFocus={() => this.handleFocusPerson(false)}
                  onBlur={() => this.handleFocusPerson(true)}
                  clearSearchPerson={this.state.clearSearchPerson}
                  hide={this.state.hideSearchPerson}
                  value={this.state.searchPersonText}
                  label="Pastor"
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
