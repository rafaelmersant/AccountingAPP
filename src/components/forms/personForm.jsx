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
import Select from "../common/select";

class PersonForm extends Form {
  state = {
    data: {
      id: 0,
      first_name: "",
      last_name: "",
      age: "",
      gender: "",
      date_of_birth: "",
      ocupation: "",
      phone: "",
      cellphone: "",
      identification: "",
      civil_status: "",
      address: "",
      reason_consultation: "",
      disease: "",
      doctor: "",
      reference: "",
      created_by: getCurrentUser().id,
      created_date: new Date().toISOString(),
    },
    civil_status_options: [
      { id: "S", name: "Soltero" },
      { id: "C", name: "Casado" },
      { id: "U", name: "Unión libre" },
    ],
    gender_options: [
      { id: "M", name: "Masculino" },
      { id: "F", name: "Femenino" },
    ],
    errors: {},
    action: "Nuevo Paciente",
    clearSearchChurch: false,
    searchChurchText: "",
  };

  schema = {
    id: Joi.number(),
    first_name: Joi.string().required().max(100).min(3).label("Nombre"),
    last_name: Joi.string().required().min(3).max(100).label("Apellidos"),
    age: Joi.optional(),
    gender: Joi.optional(),
    date_of_birth: Joi.optional(),
    ocupation: Joi.optional(),
    phone: Joi.optional(),
    cellphone: Joi.optional(),
    identification: Joi.optional(),
    civil_status: Joi.optional(),
    address: Joi.optional(),
    reason_consultation: Joi.optional(),
    disease: Joi.optional(),
    doctor: Joi.optional(),
    reference: Joi.optional(),
    created_by: Joi.number(),
    created_date: Joi.optional(),
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
        action: "Editar Paciente",
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

    const data = { ...this.state.data };
    data.church_id = church.id;

    this.setState({
      data,
      hideSearchChurch: true,
      clearSearchChurch: false,
      searchChurchText: `${church.global_title}`,
    });
  };

  handleCleanChurch = async () => {
    const { data } = { ...this.state };
    data.church_id = 0;
    this.setState({ data, searchChurchText: "" });
  };

  handleSetNewChurch = (e) => {
    this.handleSelectChurch(e);
  };

  handleTypingChurch = (value) => {
    this.setState({ searchChurchTextType: value });
  };

  handleSearchChurch = async (value) => {
    this.setState({ clearSearchChurch: value });
  };

  mapToViewModel(person) {
    return {
      id: person[0].id,
      first_name: person[0].first_name,
      last_name: person[0].last_name,
      age: person[0].age ? person[0].age : "",
      gender: person[0].gender ? person[0].gender : "",
      date_of_birth: person[0].date_of_birth ? person[0].date_of_birth : "",
      ocupation: person[0].ocupation ? person[0].ocupation : "",
      phone: person[0].phone ? person[0].phone : "",
      cellphone: person[0].cellphone ? person[0].cellphone : "",
      identification: person[0].identification ? person[0].identification : "",
      civil_status: person[0].civil_status ? person[0].civil_status : "",
      address: person[0].address ? person[0].address : "",
      reason_consultation: person[0].reason_consultation
        ? person[0].reason_consultation
        : "",
      disease: person[0].disease ? person[0].disease : "",
      doctor: person[0].doctor ? person[0].doctor : "",
      reference: person[0].reference ? person[0].reference : "",
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
      toast.error("Este paciente ya existe!");
      return false;
    }

    const { data } = { ...this.state };
    // data.first_name = data.first_name.toUpperCase();
    // data.last_name = data.last_name.toUpperCase();

    const { data: person } = await savePerson(data);

    if (!this.props.popUp) this.props.history.push("/pacientes");
    else this.props.closeMe(person);
  };

  handleChangeOption = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
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
                {this.renderInput("identification", "Cedula de Identidad")}
              </div>
              <div className="col">
                <Select
                  name="civil_status"
                  value={this.state.data.civil_status}
                  label="Estado Civil"
                  options={this.state.civil_status_options}
                  onChange={this.handleChangeOption}
                  error={null}
                />
              </div>
              <div className="col">
                {this.renderInput("date_of_birth", "Fecha de Nacimiento", "text", "", "AAAA-MM-DD")}
              </div>
            </div>

            <div className="row">
              <div className="col">{this.renderInput("age", "Edad")}</div>
              <div className="col">
                <Select
                  name="gender"
                  value={this.state.data.gender}
                  label="Sexo"
                  options={this.state.gender_options}
                  onChange={this.handleChangeOption}
                  error={null}
                />
              </div>
              <div className="col">{this.renderInput("phone", "Teléfono")}</div>

              <div className="col">
                {this.renderInput("cellphone", "Celular")}
              </div>
            </div>

            <div className="row">
              <div className="col">
                {this.renderInput("ocupation", "Ocupación")}
              </div>

              <div className="col">
                {this.renderInput("doctor", "Nombre del doctor")}
              </div>


            </div>

            <div className="row">
              <div className="col">
                {this.renderInput("reason_consultation", "Motivo de consulta")}
              </div>
            </div>
            
            <div className="row">
              <div className="col">
                {this.renderInput("address", "Dirección")}
              </div>
            </div>

            <div className="row">
              <div className="col">
                {this.renderInput(
                  "disease",
                  "Sufre alguna enfermedad de interés"
                )}
              </div>
            </div>

            
            <div className="row">
              <div className="col">
                {this.renderInput("reference", "Referencia")}
              </div>
            </div>
            <div className="mt-3">{this.renderButton("Guardar")}</div>
          </form>
        </div>
      </div>
    );
  }
}

export default PersonForm;
