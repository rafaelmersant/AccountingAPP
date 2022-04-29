import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../common/form";
import auth from "../../services/authService";
import { toast } from "react-toastify";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Usuario"),
    password: Joi.string().required().label("Contraseña"),
  };

  doSubmit = async () => {
    try {
      const { data: credentials } = this.state;
      await auth.login(credentials);

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/home";
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Usuario/Contraseña incorrecto.");

      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;

    return (
      <div className="container col-lg-5 col-md-12 col-sm-12 shadow p-3 mb-5 bg-white rounded">
        <h2 className="bg-secondary text-light pl-2 pr-2">Iniciar Sesión</h2>
        <div className="col-12 pb-3 bg-light">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("username", "Usuario")}
            {this.renderInput("password", "Contraseña", "password")}

            {this.renderButton("Entrar")}
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
