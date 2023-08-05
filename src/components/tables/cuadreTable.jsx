import React, { Component } from "react";
import Table from "../common/table";
import { formatNumber } from "../../utils/custom";

class CuadreTable extends Component {
  columns = [
    { path: "created_date", label: "Fecha (m/d/a)", classes: "date-min-width" },
    {
      path: "person",
      label: "Paciente",
      content: (entry) => (
        <div className="text-left">
          {entry.person && (
            <span>
              {entry.person.first_name} {entry.person.last_name}
            </span>
          )}
          {!entry.church && !entry.person && (
            <span className="text-danger">{`Nota: ${entry.note}`}</span>
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
    const {
      entries,
      totalAmount,
      sortColumn,
      onSort,
    } = this.props;

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
                <td colSpan={2} className="bg-dark text-white h6">
                  Total registros: {entries.length}
                </td>

                <td className="bg-dark text-white text-right h6">
                  Total: {formatNumber(totalAmount)}
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
