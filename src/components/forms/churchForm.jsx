import React from "react";
import Form from "../common/form";
import Joi from "joi-browser";
import { getCurrentUser } from "../../services/authService";
import { getChurch, saveChurch } from "../../services/churchService";

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
  };

  schema = {
    id: Joi.number(),
    global_title: Joi.string().required().min(3).label("Titulo Conciliar"),
    local_title: Joi.string().required().min(3).label("Titulo Local"),
    location: Joi.string().label("Ubicación"),
    shepherd_id: Joi.optional().label("Pastor"),
    created_by: Joi.number(),
    created_date: Joi.string(),
  };

  async populateChurch() {
    try {
      const churchId = this.props.match.params.id;
      if (churchId === "new") return;

      const { data: church } = await getChurch(churchId);

      this.setState({
        data: this.mapToViewModel(church.results),
        action: "Editar iglesia",
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateChurch();
  }

  mapToViewModel(church) {
    return {
      id: church[0].id,
      global_title: church[0].global_title,
      local_title: church[0].local_title ? church[0].local_title : "",
      location: church[0].location ? church[0].location : "",
      shepherd_id: church[0].shepherd_id ? church[0].shepherd_id : "",
      created_by: church[0].created_by
        ? church[0].created_by
        : getCurrentUser().email,
      created_date: church[0].created_date,
    };
  }

  doSubmit = async () => {
    await saveChurch(this.state.data);

    this.props.history.push("/iglesias");
  };

  render() {
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
                {this.renderInput("shepherd_id", "Pastor")}
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
      </div>
    );
  }
}

export default ChurchForm;