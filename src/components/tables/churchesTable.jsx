import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import auth from "../../services/authService";

class ChurchesTable extends Component {
  columns = [
    {
      path: "id",
      label: "ID",
      content: (church) => (
        <div className="text-center">
          <Link to={`/curso/${church.id}`}>{church.id}</Link>
        </div>
      ),
    },
    {
      path: "global_title",
      label: "Descripción",
      content: (church) => (
        <Link to={`/curso/${church.id}`}>{church.global_title}</Link>
      ),
    },
  
    { path: "created_date", label: "Creado (m/d/a)" },
  ];

  deleteColumn = {
    key: "delete",
    content: (church) => (
      <div className="text-center">
        <span
          onClick={() => this.props.onDelete(church)}
          className="fa fa-trash text-danger cursor-pointer trash-size"
        ></span>
      </div>
    ),
  };

  constructor() {
    super();
    const user = auth.getCurrentUser().email;
    const role = auth.getCurrentUser().role;

    if (user && role === "Owner")
      this.columns.push(this.deleteColumn);
  }

  render() {
    const { churches, sortColumn, onSort } = this.props;

    return (
      <Table
        columns={this.columns}
        data={churches}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ChurchesTable;
