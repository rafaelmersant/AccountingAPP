import React, { Component } from "react";
import TableBody from "../common/tableBody";
import { formatNumber } from "../../utils/custom";

class EntryDetailTable extends Component {
  columns = [
    { path: "concept", label: "Concepto" },
    {
      path: "type",
      label: "Tipo",
      content: (item) => (
        <span>
          {`${item.type.replace("S", "Salida").replace("E", "Entrada")}`}
        </span>
      ),
    },
    { path: "reference", label: "Referencia" },
    {
      path: "amount",
      label: "Monto",
      align: "text-right",
      content: (item) => (
        <div className="text-right">
          <span>{formatNumber(item.amount)}</span>
        </div>
      ),
    },
  ];

  deleteColumn = {
    path: "delete",
    key: "delete",
    content: detail => (
      <div className="row text-center" style={{ width: "68px" }}>
        <div className="col-2 text-center">
          <span
            onClick={() => this.props.onDelete(detail)}
            className="fa fa-trash text-danger cursor-pointer"
            style={{ fontSize: "23px" }}
          ></span>
        </div>
        <div className="col-2 text-center">
          <span
            onClick={() => this.props.onEdit(detail)}
            className="fa fa-edit text-warning cursor-pointer"
            style={{ fontSize: "23px" }}
          ></span>
        </div>
      </div>
    )
  };

  constructor() {
    super();
    this.columns.push(this.deleteColumn);
  }

  render() {
    const { details, entryHeader } = this.props;

    // if (entryHeader.id)
    //   this.columns = this.columns.filter(c => c.path !== "delete");

    return (
      <React.Fragment>
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              {this.columns.map(column => (
                <th key={column.path || column.key} className="py-2">{column.label}</th>
              ))}
            </tr>
          </thead>

          <TableBody columns={this.columns} data={details} />

          {details.length > 0 && (
            <tfoot>
              <tr className="table-active">
                <th>Total</th>
                <th></th>
                <th></th>
                <th className="text-right">{formatNumber(entryHeader.total_amount)}</th>
                <th></th>
                {/* {(!entryHeader.id) && <th></th>} */}
              </tr>
            </tfoot>
          )}
        </table>
      </React.Fragment>
    );
  }
}

export default EntryDetailTable;
