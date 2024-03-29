import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import auth from "../../services/authService";
import { formatNumber } from "../../utils/custom";

class EntriesTable extends Component {
  columns = [
    {
      path: "id",
      label: "Transacción #",
      content: (entry) => (
        <div className="text-center">
          <Link to={`/registro/${entry.id}`}>{entry.id}</Link>
        </div>
      ),
    },
    {
      path: "church",
      label: "Iglesia",
      content: (entry) => (
        <span className={entry.total_amount > 0 ? "text-dark" : "text-danger"}>
          {entry.church && `${entry.church.global_title}`}
        </span>
      ),
    },
    {
      path: "person",
      label: "Obrero",
      classes: "hidden-on-small",
      content: (entry) => (
        <div>
          <span className={entry.total_amount > 0 ? "text-dark" : "text-danger"}>
            {entry.person &&
              `${entry.person.first_name} ${entry.person.last_name}`}
          </span>
          <span className={entry.total_amount > 0 ? "text-dark" : "text-danger"}>
            {!entry.church && !entry.person && `Nota: ${entry.note}`}
          </span>
        </div>
      ),
    },
    {
      path: "total_amount",
      label: "Monto",
      content: (entry) => (
        <div className="text-right">
          <span className={entry.total_amount > 0 ? "text-dark" : "text-danger"}>
            {formatNumber(entry.total_amount)}
          </span>
        </div>
      ),
    },
    {
      path: "created_by",
      label: "Creado por",
      classes: "min-width-entries-column-1 hidden-on-small",
      content: (entry) => <span>{entry.created_by.name}</span>,
    },
    { path: "created_date", label: "Fecha (m/d/a)", classes: "min-width-entries-column-1" },
  ];

  deleteColumn = {
    key: "delete",
    content: (entry) => (
      <div className="text-center">
        <span
          onClick={() => this.props.onDelete(entry)}
          className="fa fa-trash text-danger cursor-pointer trash-size"
        ></span>
      </div>
    ),
  };

  constructor() {
    super();
    const user = auth.getCurrentUser().email;
    const role = auth.getCurrentUser().role;

    if (user && role === "Owner") this.columns.push(this.deleteColumn);
  }

  render() {
    const { entries, sortColumn, onSort } = this.props;

    return (
      <Table
        columns={this.columns}
        data={entries}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default EntriesTable;
