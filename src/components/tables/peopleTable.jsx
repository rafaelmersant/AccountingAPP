import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import auth from "../../services/authService";

class PeopleTable extends Component {
  columns = [
    { path: "id", label: "Codigo" },
    {
      path: "first_name",
      label: "Nombre",
      content: (person) => (
        <Link to={`/obrero/${person.id}`}> {person.first_name} </Link>
      ),
    },
    {
      path: "last_name",
      label: "Apellidos",
      content: (person) => (
        <Link to={`/obrero/${person.id}`}> {person.last_name} </Link>
      ),
    },
    {
      path: "credential",
      label: "Credencial",
      content: (person) => (
        <span>
          {`${person.credential}`}
          {person.credential_start && ` - ${person.credential_start}`}
        </span>
      ),
    },
    { path: "identification", label: "Cédula" },
    {
      path: "church_id",
      label: "Iglesia",
      content: (person) => {
        return <span>{person.church && `${person.church.global_title}`}</span>;
      },
    },
    {
      path: "zone",
      label: "Presbiterio",
      content: (person) => {
        return (
          <span>
            {person.church && person.church.zone && `${person.church.zone}`}
          </span>
        );
      },
    },
    {
      path: "created_date",
      label: "Creado (m/d/a)",
      content: (person) => {
        return (
          <span>{new Date(person.created_date).toLocaleDateString()}</span>
        );
      },
    },
    // { path: "created_date", label: "Creado (m/d/a)" },
  ];

  deleteColumn = {
    key: "delete",
    content: (person) => (
      <div className="text-center">
        <span
          onClick={() => this.props.onDelete(person)}
          className="fa fa-trash text-danger cursor-pointer trash-size"
        ></span>
      </div>
    ),
  };

  constructor() {
    super();
    const user = auth.getCurrentUser().email;
    const role = auth.getCurrentUser().role;

    if (user && (role === "Owner" || role === "Admin")) this.columns.push(this.deleteColumn);
  }

  render() {
    const { people, sortColumn, onSort } = this.props;

    return (
      <Table
        columns={this.columns}
        data={people}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default PeopleTable;
