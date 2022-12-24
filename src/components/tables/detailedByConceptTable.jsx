import React, { Component } from "react";
import Table from "../common/table";
import { formatNumber } from "../../utils/custom";

class DetailedByConceptTable extends Component {
  columns = [
    { path: "concept", label: "Concepto" },
    {
      path: "Ingreso",
      label: "Ingreso",
      content: (entry) =>
        entry.amount > 0 && (
          <div className="text-right">
            <span>{formatNumber(entry.amount)}</span>
          </div>
        ),
    },
    {
      path: "Egreso",
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
      totalDiezmos,
      totalSalidas,
      totalOfrendas,
      ofrendaMisionera,
      adelantoPastor,
      adelantoCopastor,
      adelantoConcilio
    } = this.props;

    const totalDiezmosResiduo = totalDiezmos + totalSalidas;
    const totalOfrendaResiduo = totalOfrendas - ofrendaMisionera;

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
              <tr>
                <td className="bg-info text-white h6">10% Diezmos: {formatNumber(totalDiezmosResiduo * 0.10)} </td>
                <td className="bg-info text-white h6">20% Diezmos: {formatNumber(totalDiezmosResiduo * 0.20)}</td>
                <td className="bg-info text-white h6">70% Diezmos: {formatNumber(totalDiezmosResiduo * 0.70)}</td>
                <td className="bg-info text-white h6">Diezmos residuo: {formatNumber(totalDiezmosResiduo)}</td>
              </tr>
              <tr>
                <td className="bg-info text-white h6">10% Ofrendas: {formatNumber(totalOfrendaResiduo * 0.10)}</td>
                <td className="bg-info text-white h6">90% Ofrendas: {formatNumber(totalOfrendaResiduo * 0.90)}</td>
                <td className="bg-info text-white h6">Total al copastor: {formatNumber((totalDiezmosResiduo * 0.10) + (totalOfrendaResiduo * 0.10))}</td>
                <td className="bg-info text-white h6">Total al pastor: {formatNumber((totalDiezmosResiduo * 0.70) + (totalOfrendaResiduo * 0.90))}</td>
              </tr>
              <tr>
                <td className="bg-info text-white h6">Total al copastor - adelanto: {formatNumber((totalDiezmosResiduo * 0.10) + (totalOfrendaResiduo * 0.10) - adelantoCopastor)}</td>
                <td className="bg-info text-white h6">Total al pastor - adelanto: {formatNumber((totalDiezmosResiduo * 0.70) + (totalOfrendaResiduo * 0.90) - adelantoPastor)}</td>
                <td colSpan={2} className="bg-info text-white h6">Total 20% - adelanto: {formatNumber((totalDiezmosResiduo * 0.20) - adelantoConcilio)}</td>
              </tr>
            </thead>
          </table>
        )}
      </React.Fragment>
    );
  }
}

export default DetailedByConceptTable;
