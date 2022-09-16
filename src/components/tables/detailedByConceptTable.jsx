import React, { Component } from "react";
import Table from "../common/table";
import { formatNumber } from "../../utils/custom";

class DetailedByConceptTable extends Component {
  columns = [
    { path: "concept", label: "Concepto" },
    {
      path: "amount",
      label: "Ingreso",
      content: (entry) =>
        entry.amount > 0 && (
          <div className="text-right">
            <span>{formatNumber(entry.amount)}</span>
          </div>
        ),
    },
    {
      path: "amount",
      label: "Egreso",
      content: (entry) =>
        entry.amount < 0 && (
          <div className="text-right">
            <span>{formatNumber(Math.abs(entry.amount))}</span>
          </div>
        ),
    },
  ];

  render() {
    const {
      items,
      sortColumn,
      onSort,
      totalAmount,
      totalIngresos,
      totalEgresos,
    } = this.props;

    return (
      <React.Fragment>
        <Table
          columns={this.columns}
          data={items}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        {items.length > 0 && (
          <table className="table col-12">
            <thead className="thead-dark">
              <tr>
                <td className="bg-dark text-white h6">
                  Total registros: {items.length}
                </td>
                <td className="bg-dark text-white h6">
                  <span className="text-dark">|||</span>
                </td>

                <td className="bg-dark text-white h6 text-right">
                  {formatNumber(totalIngresos)}
                </td>
                <td className="bg-dark text-white h6 text-right">
                  {formatNumber(totalEgresos)}
                </td>
              </tr>
              <tr>
                <td className="bg-dark text-white h6">SUPERAVIT:</td>
                <td colSpan={3} className="bg-dark text-white h6 text-right">
                  {formatNumber(totalAmount)}
                </td>
              </tr>
            </thead>
          </table>
        )}
      </React.Fragment>
    );
  }
}

export default DetailedByConceptTable;
