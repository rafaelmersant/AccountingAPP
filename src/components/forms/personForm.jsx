import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import Form from "../common/form";
import {
  getPerson,
  savePerson,
  getPersonByFirstLastName,
} from "../../services/personService";
import { getCurrentUser } from "../../services/authService";
import SearchChurch from "../common/searchChurch";
import ChurchModal from "../modals/churchModal";

class PersonForm extends Form {
  state = {
    data: {
      id: 0,
      first_name: "",
      last_name: "",
      identification: "",
      obrero_inicial: "",
      obrero_exhortador: "",
      obrero_licenciado: "",
      min_licenciado: "",
      min_ordenado: "",
      church_id: "",
      created_by: getCurrentUser().id,
      created_date: new Date().toISOString(),
    },
    errors: {},
    action: "Nuevo Obrero",
    hideSearchChurch: false,
    clearSearchChurch: false,
    searchChurchText: "",
  };

  schema = {
    id: Joi.number(),
    first_name: Joi.string().required().max(100).min(3).label("Nombre"),
    last_name: Joi.string().required().min(3).max(100).label("Apellidos"),
    identification: Joi.optional(),
    obrero_inicial: Joi.optional(),
    obrero_exhortador: Joi.optional(),
    obrero_licenciado: Joi.optional(),
    min_licenciado: Joi.optional(),
    min_ordenado: Joi.optional(),
    church_id: Joi.optional(),
    created_by: Joi.number(),
    created_date: Joi.string(),
  };

  async populatePerson() {
    try {
      const personId = this.props.match.params.id;
      if (personId === "new") return;

      const { data: person } = await getPerson(personId);

      const church = person.results[0].church
        ? person.results[0].church.global_title
        : "";

      this.setState({
        data: this.mapToViewModel(person.results),
        action: "Editar Obrero",
        searchChurchText: church,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populatePerson();

    if (this.props.person_name && this.props.person_name.length) {
      const data = { ...this.state.data };
      data.first_name = this.props.person_name;
      this.setState({ data });
      this.forceUpdate();
    }
  }

  handleSelectChurch = async (church) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    if (church.id === 0) {
      this.raiseChurchModal.click();
      return false;
    }

    const data = { ...this.state.data };
    data.church_id = church.id;

    this.setState({
      data,
      hideSearchChurch: true,
      clearSearchChurch: false,
      searchChurchText: `${church.global_title}`,
    });
  };

  handleFocusChurch = (value) => {
    setTimeout(() => {
      this.setState({ hideSearchChurch: value });
    }, 200);
  };

  handleCleanChurch = async () => {
    const { data } = { ...this.state };
    data.church_id = 0;
    this.setState({ data, searchChurchText: "" });
  };

  handleSetNewChurch = (e) => {
    this.handleSelectChurch(e);
  };

  mapToViewModel(person) {
    return {
      id: person[0].id,
      first_name: person[0].first_name,
      last_name: person[0].last_name,
      identification: person[0].identification ? person[0].identification : "",
      obrero_inicial: person[0].obrero_inicial ? person[0].obrero_inicial : "",
      obrero_exhortador: person[0].obrero_exhortador ? person[0].obrero_exhortador : "",
      obrero_licenciado: person[0].obrero_licenciado ? person[0].obrero_licenciado : "",
      min_licenciado: person[0].min_licenciado ? person[0].min_licenciado : "",
      min_ordenado: person[0].min_ordenado ? person[0].min_ordenado : "",
      church_id: person[0].church ? person[0].church.id : "",
      created_by: person[0].created_by
        ? person[0].created_by
        : getCurrentUser().id,
      created_date: person[0].created_date,
    };
  }

  doSubmit = async () => {
    const { data: _person } = await getPersonByFirstLastName(
      this.state.data.first_name.toUpperCase(),
      this.state.data.last_name.toUpperCase()
    );

    if (_person.length > 0 && this.state.data.id === 0) {
      toast.error("Este obrero ya existe!");
      return false;
    }

    const { data } = { ...this.state };
    // data.first_name = data.first_name.toUpperCase();
    // data.last_name = data.last_name.toUpperCase();

    const { data: person } = await savePerson(data);

    if (!this.props.popUp) this.props.history.push("/obreros");
    else this.props.closeMe(person);
  };

  render() {
    const { popUp } = this.props;

    return (
      <div className="container-fluid">
        {!popUp && (
          <h3 className="bg-dark text-light list-header">
            {this.state.action}
          </h3>
        )}

        <div className="col-12 pb-3 bg-light">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col">
                {this.renderInput("first_name", "Nombre")}
              </div>
              <div className="col">
                {this.renderInput("last_name", "Apellidos")}
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput("identification", "Identificación")}
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput("obrero_inicial", "Obrero Inicial")}
              </div>
              <div className="col">
              {this.renderInput("obrero_exhortador", "Obrero Exhortador")}  
              </div>
              <div className="col">
              {this.renderInput("obrero_licenciado", "Obrero Licenciado")}
              </div>
              <div className="col">
              {this.renderInput("min_licenciado", "Ministro Licenciado")}
              </div>
              <div className="col">
              {this.renderInput("min_ordenado", "Ministro Ordenado")}
              </div>              
            </div>

            <div className="row">
              <div className="col">
                <SearchChurch
                  onSelect={this.handleSelectChurch}
                  onFocus={() => this.handleFocusChurch(false)}
                  onBlur={() => this.handleFocusChurch(true)}
                  clearSearchChurch={this.state.clearSearchChurch}
                  hide={this.state.hideSearchChurch}
                  value={this.state.searchChurchText}
                  label="Iglesia"
                />
              </div>
              <div>
                {this.state.data.church_id > 0 && (
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
                      title="Limpiar filtro de iglesia"
                      onClick={this.handleCleanChurch}
                    ></span>
                  </div>
                )}
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
              data-target="#churchModal"
              hidden="hidden"
              ref={(button) => (this.raiseChurchModal = button)}
            ></button>
            <ChurchModal popUp={false} setNewChurch={this.handleSetNewChurch} />
          </div>
        )}
      </div>
    );
  }
}

export default PersonForm;
