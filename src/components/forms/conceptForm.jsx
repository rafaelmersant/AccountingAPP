import React from "react";
import Form from "../common/form";
import Joi from "joi-browser";
import { getCurrentUser } from "../../services/authService";
import { getConcept, saveConcept } from "../../services/conceptService";

class ConceptForm extends Form {
  state = {
    data: {
      id: 0,
      description: "",
      type: "",
      created_by: getCurrentUser().id,
      created_date: new Date().toISOString(),
    },
    types: [
      { id: "E", name: "Entrada" },
      { id: "S", name: "Salida" },
    ],
    errors: {},
    action: "Nuevo Concepto",
  };

  schema = {
    id: Joi.number(),
    description: Joi.string().required().min(3).label("Descripción"),
    type: Joi.string().required().label("Tipo"),
    created_by: Joi.number(),
    created_date: Joi.string(),
  };

  async populateConcept() {
    try {
      const conceptId = this.props.match.params.id;
      if (conceptId === "new") return;

      const { data: concept } = await getConcept(conceptId);

      this.setState({
        data: this.mapToViewModel(concept.results),
        action: "Editar Concepto",
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateConcept();
  }

  mapToViewModel(concept) {
    return {
      id: concept[0].id,
      description: concept[0].description,
      type: concept[0].type ? concept[0].type : "",
      created_by: concept[0].created_by
        ? concept[0].created_by
        : getCurrentUser().email,
      created_date: concept[0].created_date,
    };
  }

  doSubmit = async () => {
    const { data } = { ...this.state };
    // data.description = data.description.toUpperCase();
    const { data: concept } = await saveConcept(data);

    if (!this.props.popUp) this.props.history.push("/conceptos");
    else this.props.closeMe(concept);
  };

  render() {
    return (
      <div className="container-fluid">
        <h3 className="bg-dark text-light pl-2 pr-2">{this.state.action}</h3>
        <div className="col-12 pb-3 bg-light">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
            <div className="col-2 col-sm-6 col-md-3">
                {this.renderSelect("type", "Tipo", this.state.types)}
              </div>
            </div>
            <div className="row">
              <div className="col-7 col-sm-12 col-md-7">
                {this.renderInput("description", "Descripción")}
              </div>
            </div>

            {this.renderButton("Guardar")}
          </form>
        </div>
      </div>
    );
  }
}

export default ConceptForm;
