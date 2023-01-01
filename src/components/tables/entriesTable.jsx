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
      path: "detail",
      label: "Detalle",
      content: (entry) =>
        entry.item_set.map((item) => (
          <div className="text-left" key={item.id}>
            <span style={{ fontSize: "12px" }}>
              {item.concept.description}{" "}
              {item.reference && <span>({item.reference})</span>}:{" "}
              <strong> <span className={entry.amount > 0 ? "text-dark" : "text-danger"}>{formatNumber(item.amount)}</span></strong>
            </span>
          </div>
        )),
    },
    {
      path: "total_amount",
      label: "Monto",
      content: (entry) => (
        <div className="text-right">
          <span
            className={entry.total_amount > 0 ? "text-dark" : "text-danger"}
          >
            {formatNumber(entry.total_amount)}
          </span>
        </div>
      ),
    },
    {
      path: "created_by",
      label: "Creado por",
      classes: "min-width-entries-column-1",
      content: (entry) => <span>{entry.created_by.name}</span>,
    },
    {
      path: "entry_date",
      label: "Fecha (m/d/a)",
      classes: "min-width-entries-column-1",
    },
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
    console.log("entires:", entries);
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
