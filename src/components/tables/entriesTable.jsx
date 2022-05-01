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
        <span>{entry.church && `${entry.church.global_title}`}</span>
      ),
    },
    {
      path: "person",
      label: "Obrero",
      content: (entry) => (
        <span>{entry.person && `${entry.person.first_name} ${entry.person.last_name}`}</span>
      ),
    },
    {
      path: "total_amount",
      label: "Monto",
      content: (entry) => (
        <div className="text-right">
          <span>{formatNumber(entry.total_amount)}</span>
        </div>
      ),
    },
    { path: "created_date", label: "Fecha (m/d/a)" },
    // {
    //   path: "customer.firstName",
    //   label: "Cliente",
    //   content: (invoice) => (
    //     <span>
    //       {`${invoice.customer.firstName} ${invoice.customer.lastName}`}
    //     </span>
    //   ),
    // },
    // {
    //   path: "discount",
    //   label: "Descuento",
    //   align: "text-right",
    //   content: (item) => (
    //     <div className="text-right">
    //       <span>{formatNumber(item.discount)}</span>
    //     </div>
    //   ),
    // },
    // {
    //   path: "itbis",
    //   label: "ITBIS",
    //   align: "text-right",
    //   content: (item) => (
    //     <div className="text-right">
    //       <span>{formatNumber(item.itbis)}</span>
    //     </div>
    //   ),
    // },
    // {
    //   path: "subtotal",
    //   label: "Total",
    //   align: "text-right",
    //   content: (item) => (
    //     <div className="text-right">
    //       <span>{formatNumber(item.subtotal - item.discount)}</span>
    //     </div>
    //   ),
    // },
    // {
    //   path: "printed",
    //   label: "Impresa",
    //   align: "text-center",
    //   content: (invoice) => (
    //     <div className="text-center">
    //       <span>
    //         {invoice.printed
    //           .toString()
    //           .replace(true, "SI")
    //           .replace(false, "Pendiente")}
    //       </span>
    //     </div>
    //   ),
    // },
    // {
    //   path: "paid",
    //   label: "Pagada",
    //   align: "text-center",
    //   content: (invoice) => (
    //     <div className="text-center">
    //       <span>
    //         {invoice.paid
    //           .toString()
    //           .replace(true, "SI")
    //           .replace(false, "Pendiente")}
    //       </span>
    //     </div>
    //   ),
    // },
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

    if (user && (role === "Admin" || role === "Owner"))
      this.columns.push(this.deleteColumn);
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
