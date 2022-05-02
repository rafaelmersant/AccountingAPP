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

class PersonForm extends Form {
  state = {
    data: {
      id: 0,
      first_name: "",
      last_name: "",
      identification: "",
      church_id: "",
      created_by: getCurrentUser().id,
      created_date: new Date().toISOString(),
    },
    errors: {},
    action: "Nuevo Obrero",
  };

  schema = {
    id: Joi.number(),
    first_name: Joi.string().required().max(100).min(3).label("Nombre"),
    last_name: Joi.string().required().min(3).max(100).label("Apellidos"),
    identification: Joi.optional(),
    church_id: Joi.optional(),
    created_by: Joi.number(),
    created_date: Joi.string(),
  };

  async populatePerson() {
    try {
      const personId = this.props.match.params.id;
      if (personId === "new") return;

      const { data: person } = await getPerson(personId);

      this.setState({
        data: this.mapToViewModel(person.results),
        action: "Editar Obrero",
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

  mapToViewModel(person) {
    return {
      id: person[0].id,
      first_name: person[0].first_name,
      last_name: person[0].last_name,
      identification: person[0].identification ? person[0].identification : "",
      church_id: person[0].church_id ? person[0].church_id : "",
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

            {this.renderInput("church_id", "Iglesia")}
            
            {this.renderButton("Guardar")}
          </form>
        </div>
      </div>
    );
  }
}

export default PersonForm;
