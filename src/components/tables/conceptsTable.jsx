import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import auth from "../../services/authService";

class ConceptsTable extends Component {
  columns = [
    {
      path: "id",
      label: "ID",
      content: (concept) => (
        <div className="text-center">
          <Link to={`/concepto/${concept.id}`}>{concept.id}</Link>
        </div>
      ),
    },
    {
      path: "description",
      label: "Descripción",
      content: (concept) => (
        <span>
          {`${concept.description}`}
        </span>
      ),
    },
    {
      path: "type",
      label: "Tipo",
      content: (concept) => (
        <span>
          {`${concept.type.replace("S", "Salida").replace("E", "Entrada")}`}
        </span>
      ),
    },
    { path: "created_date", label: "Creado (m/d/a)" },
  ];

  deleteColumn = {
    key: "delete",
    content: (concept) => (
      <div className="text-center">
        <span
          onClick={() => this.props.onDelete(concept)}
          className="fa fa-trash text-danger cursor-pointer trash-size"
        ></span>
      </div>
    ),
  };

  constructor() {
    super();
    const user = auth.getCurrentUser().email;
    const role = auth.getCurrentUser().role;

    if (user && (role === "Admin" || role === "Owner"))
      this.columns.push(this.deleteColumn);
  }

  render() {
    const { concepts, sortColumn, onSort } = this.props;

    return (
      <Table
        columns={this.columns}
        data={concepts}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ConceptsTable;
