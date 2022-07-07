import React, { Component } from "react";
import _ from "lodash";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../common/loading";
import { getEntryHeaderByRangeChurchesReport } from "../../services/entryServices";
import { formatNumber } from "../../utils/custom";
import Select from "../common/select";
import Input from "../common/input";

registerLocale("es", es);

class ChurchesPayment extends Component {
  state = {
    data: {
      period_month: new Date().getMonth(),
      period_year: new Date().getFullYear(),
    },
    loading: true,
    entries: [],
    totalOfrendaMisionera: 0,
    total20Concilio: 0,
    sortColumn: { path: "created_date", order: "desc" },
    months: [
      { id: "0", name: "TODOS" },
      { id: "1", name: "Enero" },
      { id: "2", name: "Febrero" },
      { id: "3", name: "Marzo" },
      { id: "4", name: "Abril" },
      { id: "5", name: "Mayo" },
      { id: "6", name: "Junio" },
      { id: "7", name: "Julio" },
      { id: "8", name: "Agosto" },
      { id: "9", name: "Septiembre" },
      { id: "10", name: "Octubre" },
      { id: "11", name: "Noviembre" },
      { id: "12", name: "Diciembre" },
    ],
  };

  async componentDidMount() {
    let { period_month, period_year } = { ...this.state.data };
    this.populateEntries(period_month, period_year);
  }

  async populateEntries(period_month, period_year) {
    this.setState({ loading: true });
    let { data: entries } = await getEntryHeaderByRangeChurchesReport(
      period_month,
      period_year
    );

    entries = this.mapToModel(entries);

    this.setState({ entries, loading: false });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearchYear = ({ currentTarget: input }) => {
    this.setState({ searchYear: input.value });
  };

  handleSearchButton = async () => {
    const { period_month, period_year } = { ...this.state.data };
    await this.populateEntries(period_month, period_year);
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleChangeParams = ({ currentTarget: input }) => {
    const { data } = { ...this.state };
    data[input.name] = input.value;
    this.setState({ data });
  };

  mapToModel = (data) => {
    let result = [];
    let count = 1;
    
    for (let item of data) {
      const percent_concilio = item.percent_concilio
        ? item.percent_concilio
        : 0;
      const ofrenda_misionera = item.ofrenda_misionera
        ? item.ofrenda_misionera
        : 0;
      const total =
        parseFloat(percent_concilio) + parseFloat(ofrenda_misionera);

      result.push({
        id: item.id,
        count: count,
        global_title: item.global_title,
        percent_concilio: percent_concilio,
        ofrenda_misionera: ofrenda_misionera,
        total: total,
        paid: total > 0 ? 1 : 0
      });

      count++;
    }

    return result;
  };

  getPagedData = () => {
    const { sortColumn, entries: allEntries } = this.state;

    const totalAmount = allEntries.reduce(
      (acc, item) =>
        parseFloat(acc) +
        (parseFloat(item.percent_concilio) +
          parseFloat(item.ofrenda_misionera)),
      0
    );

    const total20Concilio = allEntries.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.percent_concilio),
      0
    );

    const totalOfrendaMisionera = allEntries.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.ofrenda_misionera),
      0
    );

    const totalPaid = allEntries.reduce(
        (acc, item) => parseFloat(acc) + parseFloat(item.paid),
        0
      );

    return {
      totalCount: allEntries.length,
      totalOfrendaMisionera,
      total20Concilio,
      totalAmount,
      totalPaid
    };
  };

  render() {
    const { entries } = { ...this.state };
    const { totalAmount, totalOfrendaMisionera, total20Concilio, totalPaid } =
      this.getPagedData();

    return (
      <div className="container-fluid mb-3">
        <div className="row">
          <div className="col">
            <h2 className="text-info bg-light mb-3">
              Pagos de 20% y Ofrenda Misionera
            </h2>
            <div className="d-flex flex-row">
              <div className="col-2">
                <div className="mr-3">
                  <Select
                    name="period_month"
                    className="form-control form-control-sm"
                    value={this.state.data.period_month}
                    label="Mes"
                    options={this.state.months}
                    onChange={this.handleChangeParams}
                    error={null}
                  />
                </div>
              </div>

              <div className="col-2">
                <div className="mr-3">
                  <Input
                    type="text"
                    name="period_year"
                    className="form-control form-control-sm"
                    value={this.state.data.period_year}
                    label="Año"
                    onChange={this.handleChangeParams}
                  />
                </div>
              </div>

              <div className="form-group mt-1">
                <button
                  className="btn btn-info ml-2 my-4"
                  style={{ maxHeight: 36 }}
                  onClick={this.handleSearchButton}
                >
                  Filtrar
                </button>
              </div>
            </div>

            {this.state.loading && (
              <div>
                <p className="text-left">Cargando...</p>
                <div className="d-flex justify-content-left mb-3">
                  <Loading />
                </div>
              </div>
            )}

            {!this.state.loading && (
              <React.Fragment>
                {entries && entries.length > 0 && (
                  <table className="table table-striped table-bordered col-lg-7 col-m-7 col-sm-12 table-fit">
                    <thead className="thead-dark">
                      <tr>
                        <th className="bg-dark text-white">#</th>
                        <th className="bg-dark text-white">Iglesia</th>

                        <th className="bg-dark text-white">20%</th>

                        <th className="bg-dark text-white">
                          Ofrenda Misionera
                        </th>
                        <th className="bg-dark text-white">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((item) => (
                        <tr key={item.id}>
                          <td>{item.count}</td>
                          <td>{item.global_title}</td>
                          <td>{formatNumber(item.percent_concilio)}</td>
                          <td>{formatNumber(item.ofrenda_misionera)}</td>
                          <td>{formatNumber(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-dark text-warning">
                      <tr>
                        <td colSpan={2}>Iglesias que han pagado: {totalPaid}</td>
                        <td className="text-right">
                          {formatNumber(total20Concilio)}
                        </td>
                        <td className="text-right">
                          {formatNumber(totalOfrendaMisionera)}
                        </td>
                        <td className="text-right">
                          {formatNumber(totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ChurchesPayment;
