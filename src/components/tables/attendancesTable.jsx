import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import auth from "../../services/authService";

class AttendancesTable extends Component {
  columns = [
    { path: "id", label: "#" },
    {
      path: "full_name",
      label: "Nombre",
      content: (attendance) => (
        <Link to={`/obrero/${attendance.person.id}`}> {attendance.person.full_name} </Link>
      ),
    },
    {
        path: "identification",
        label: "Cédula",
        content: (attendance) => {
          return <span>{attendance.person.identification} </span>;
        },
      },
    {
      path: "church_id",
      label: "Iglesia",
      content: (attendance) => {
        return (
          <span>
            {attendance.person.church &&
              `${attendance.person.church.global_title}`}
          </span>
        );
      },
    },
    { path: "created_date", label: "Fecha (m/d/a)" },
    {
      path: "created_by",
      label: "Registrado por",
      content: (attendance) => {
        return <span>{attendance.created_by.username}</span>;
      },
    },
  ];

  deleteColumn = {
    key: "delete",
    content: (attendance) => (
      <div className="text-center">
        <span
          onClick={() => this.props.onDelete(attendance)}
          className="fa fa-trash text-danger cursor-pointer trash-size"
        ></span>
      </div>
    ),
  };

  constructor() {
    super();
    const user = auth.getCurrentUser().email;
    const role = auth.getCurrentUser().role;

    if (user && (role === "Owner" || role === "Admin"))
      this.columns.push(this.deleteColumn);
  }

  render() {
    const { attendances, sortColumn, onSort } = this.props;

    return (
      <Table
        columns={this.columns}
        data={attendances}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default AttendancesTable;
