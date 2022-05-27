import React, { Component } from "react";
import Table from "../common/table";
import { formatNumber } from "../../utils/custom";

class CuadreTable extends Component {
  columns = [
    { path: "created_date", label: "Fecha (m/d/a)" },
    {
      path: "church",
      label: "Iglesia",
      content: (entry) => (
        <div className="text-left">
          {entry.church && <span>{entry.church.global_title}</span>}
        </div>
      ),
    },
    {
      path: "person",
      label: "Obrero",
      content: (entry) => (
        <div className="text-left">
          {entry.person && (
            <span>
              {entry.person.first_name} {entry.person.last_name}
            </span>
          )}
        </div>
      ),
    },
    // {
    //   path: "concept",
    //   label: "Conceptos",
    //   content: (entry) => (
    //     <ul className="list-group" key={entry.id+entry.item_set.id}>
    //       {entry.item_set.map(item => (
    //         <i key={entry.item_set.id}>• {item.concept.description}</i>
    //       ))}
    //     </ul>
    //   ),
    // },
    {
      path: "defaultOne",
      label: "Ofrenda Misionera",
      content: (entry) => (
        <div className="text-right">
          {entry.item_set.map(
            (item) =>
              item.concept.id === 2 && <span>{formatNumber(item.amount)}</span>
          )}
        </div>
      ),
    },
    {
      path: "defaultTwo",
      label: "20% al Concilio",
      content: (entry) => (
        <div className="text-right">
          {entry.item_set.map(
            (item) =>
              item.concept.id === 1 && <span>{formatNumber(item.amount)}</span>
          )}
        </div>
      ),
    },
    {
      path: "defaultThree",
      label: "Cuota Obrero",
      content: (entry) => (
        <div className="text-right">
          {entry.item_set.map(
            (item) =>
              item.concept.id === 4 && <span>{formatNumber(item.amount)}</span>
          )}
        </div>
      ),
    },
    {
      path: "defaultFour",
      label: "Otros Ingresos",
      content: (entry) => (
        <div className="text-right">
          {entry.item_set.map(
            (item) =>
              item.concept.id !== 2 &&
              item.concept.id !== 1 &&
              item.concept.id !== 4 && <span>{formatNumber(item.amount)}</span>
          )}
        </div>
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
  ];

  render() {
    const { entries, totalAmount, sortColumn, onSort } = this.props;
    console.log("entries", entries);
    return (
      <React.Fragment>
        <Table
          columns={this.columns}
          data={entries}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        {entries.length > 0 && (
          <table className="table col-12">
            <thead className="thead-dark">
              <tr>
                <td className="bg-dark text-light">
                  Total registros: {entries.length}
                </td>
                <td className="bg-dark text-light text-right">
                  Monto Total: {formatNumber(totalAmount)}
                </td>
              </tr>
            </thead>
          </table>
        )}
      </React.Fragment>
    );
  }
}

export default CuadreTable;
