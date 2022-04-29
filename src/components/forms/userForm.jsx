import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getUser, saveUser, getEmailExists } from "../../services/userService";
import { getCurrentUser } from "../../services/authService";
import { toast } from "react-toastify";

class UserForm extends Form {
  state = {
    data: {
      id: 0,
      email: "",
      username: "",
      password: "",
      name: "",
      user_role: "",
      user_hash: "hash",
      created_by: getCurrentUser().email,
      created_date: new Date().toISOString(),
    },
    companies: [],
    roles: [
      { id: "Admin", name: "Admin" },
      { id: "Level1", name: "Level1" },
      { id: "Reportes", name: "Reportes" },
    ],
    errors: {},
    action: "Nuevo Usuario",
  };

  schema = {
    id: Joi.number(),
    email: Joi.string().required().email().label("Email"),
    username: Joi.string().required().label("Usuario"),
    password: Joi.string().required().min(8).max(30).label("Password"),
    name: Joi.string().required().min(5).label("Nombre"),
    user_role: Joi.string().required().label("Rol"),
    user_hash: Joi.string().optional(),
    created_by: Joi.string(),
    created_date: Joi.string(),
  };

  async populateUser() {
    try {
      const userId = this.props.match.params.id;
      if (userId === "new") return;

      const { data: user } = await getUser(userId);

      this.setState({
        data: this.mapToViewModel(user),
        action: "Editar Usuario",
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateUser();
  }

  mapToViewModel(user) {
    return {
      id: user[0].id,
      email: user[0].email,
      username: user[0].username,
      password: user[0].password,
      name: user[0].name,
      user_role: user[0].user_role,
      user_hash: user[0].user_hash ? user[0].user_hash : "hash",
      created_by: user[0].created_by
        ? user[0].created_by
        : getCurrentUser().email,
      created_date: user[0].created_date,
    };
  }

  doSubmit = async () => {
    const { data: email } = await getEmailExists(
      this.state.data.email
    );

    if (email.length && this.state.data.id === 0) {
      toast.error("Este email ya existe en el sistema.");
      return false;
    }

    await saveUser(this.state.data);

    this.props.history.push("/users");
  };

  render() {
    return (
      <div className="container-fluid">
        <h3 className="bg-dark text-light pl-2 pr-2">{this.state.action}</h3>
        <div className="col-12 pb-3 bg-light">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("email", "Email")}
            {this.renderInput("username", "Usuario")}
            {this.renderInput("password", "Contraseña", "password")}
            {this.renderInput("name", "Nombre")}
            {this.renderSelect("user_role", "Rol", this.state.roles)}
            {this.renderButton("Guardar")}
          </form>
        </div>
      </div>
    );
  }
}

export default UserForm;
