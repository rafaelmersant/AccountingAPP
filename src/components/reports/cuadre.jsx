import React, { Component } from "react";
import _ from "lodash";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../common/loading";
import { paginate } from "../../utils/paginate";
import CuadreTable from "../tables/cuadreTable";
// import ExportInvoices607 from "./reports/exportInvoices607";
import { getEntryHeaderByRange } from "../../services/entryServices";
import { formatNumber } from "../../utils/custom";

registerLocale("es", es);

class Cuadre extends Component {
  state = {
    data: {
      start_date: new Date(),
      end_date: new Date(),
    },
    loading: true,
    entries: [],
    entriesExcel: [],
    totalCount: 0,
    totalAmount: 0,
    totalOfrendaMisionera: 0,
    total20Concilio: 0,
    totalCuotaObrero: 0,
    totalOtrosIngresos: 0,
    totalDepositos: 0,
    start_date: new Date().toISOString().substring(0, 10),
    end_date: new Date().toISOString().substring(0, 10),
    sortColumn: { path: "created_date", order: "desc" },
  };

  async componentDidMount() {
    let { start_date, end_date } = { ...this.state };
    this.populateEntries(start_date, end_date);
  }

  async populateEntries(start_date, end_date) {
    this.setState({ loading: true });
    this.forceUpdate();

    let { data: entries } = await getEntryHeaderByRange(start_date, end_date);

    entries = this.mapToModel(entries.results);

    this.setState({ entries, loading: false });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearchYear = ({ currentTarget: input }) => {
    this.setState({ searchYear: input.value });
  };

  handleSearchButton = () => {
    this.populateEntries(this.state.start_date, this.state.end_date);
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleChangeStartDate = (date) => {
    const data = { ...this.state.data };
    data.start_date = new Date(date.toISOString());
    this.setState({ data, start_date: date.toISOString().substring(0, 10) });
  };

  handleChangeEndDate = (date) => {
    const data = { ...this.state.data };
    data.end_date = new Date(date.toISOString());
    this.setState({ data, end_date: date.toISOString().substring(0, 10) });
  };

  mapToModel = (data) => {
    let result = [];

    for (const item of data) {
      if (item.total_amount > 0)
        result.push({
          id: item.id,
          note: item.note,
          person: item.person,
          church: item.church,
          item_set: item.item_set,
          created_date: item.created_date,
          total_amount: item.total_amount,
        });
    }

    return result;
  };

  getPagedData = () => {
    const { sortColumn, entries: allEntries } = this.state;

    // const totalAmount = _.sumBy(allEntries, (item) =>
    //   parseFloat(item.total_amount)
    // );

    let totalAmount = 0;
    let totalOfrendaMisionera = 0;
    let total20Concilio = 0;
    let totalCuotaObrero = 0;
    let totalOtrosIngresos = 0;
    let totalDepositos = 0;
    let totalEfectivo = 0;
    let totalSalidas = 0;

    for (const entry of allEntries) {
      for (const item of entry.item_set) {
        if (item.concept.id === 1) total20Concilio += parseFloat(item.amount);
        if (item.concept.id === 2)
          totalOfrendaMisionera += parseFloat(item.amount);
        if (item.concept.id === 4) totalCuotaObrero += parseFloat(item.amount);
        if (
          item.concept.id !== 1 &&
          item.concept.id !== 2 &&
          item.concept.id !== 4 &&
          item.type !== "S"
        )
          totalOtrosIngresos += parseFloat(item.amount);

        if (item.method === "D" && item.type !== "S") {
          totalDepositos += parseFloat(item.amount);
        }

        if (item.method === "E" && item.type !== "S") {
          totalEfectivo += parseFloat(item.amount);
        }

        if (item.type === "S") {
          totalSalidas += parseFloat(item.amount);
        } else {
          totalAmount += parseFloat(item.amount);
        }
      }
    }

    const sorted = _.orderBy(allEntries, [sortColumn.path], [sortColumn.order]);
    const entries = paginate(sorted, 1, 9999999);

    return {
      totalCount: allEntries.length,
      totalAmount,
      totalOfrendaMisionera,
      total20Concilio,
      totalCuotaObrero,
      totalOtrosIngresos,
      totalDepositos,
      totalEfectivo,
      totalSalidas,
      entries,
    };
  };

  entriesExportFormat = (data) => {
    let result = [];

    data.forEach((item) => {
      result.push({
        id: item.id,
        note: item.note,
        person: item.person,
        church: item.church,
        item_set: item.item_set,
        created_date: new Date(item.created_date).toLocaleDateString(),
        total_amount: item.total_amount,
      });
    });

    return result;
  };

  render() {
    const { sortColumn } = this.state;
    const { user } = this.props;

    const {
      entries,
      totalAmount,
      totalOfrendaMisionera,
      total20Concilio,
      totalCuotaObrero,
      totalOtrosIngresos,
      totalDepositos,
      totalEfectivo,
      totalSalidas,
    } = this.getPagedData();

    return (
      <div className="container-fluid mb-3">
        <div className="row">
          <div className="col">
            <h2 className="text-info bg-light mb-3">Reporte - Cuadre</h2>

            {/* <ExportInvoices607
              data={this.entriesExportFormat(entries)}
              sheetName="Cuadre"
            /> */}

            <div className="d-flex flex-row">
              <div className="col-2">
                <label className="mr-1">Fecha Inicial</label>
                <div className="mr-3">
                  <DatePicker
                    className="form-control form-control-sm"
                    selected={this.state.data.start_date}
                    onChange={(date) => this.handleChangeStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>

              <div className="col-2">
                <label className="mr-1">Fecha Final</label>
                <div className="mr-3">
                  <DatePicker
                    className="form-control form-control-sm"
                    selected={this.state.data.end_date}
                    onChange={(date) => this.handleChangeEndDate(date)}
                    dateFormat="dd/MM/yyyy"
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
              <div className="col-12">
                <CuadreTable
                  entries={entries}
                  totalAmount={totalAmount}
                  totalOfrendaMisionera={totalOfrendaMisionera}
                  total20Concilio={total20Concilio}
                  totalCuotaObrero={totalCuotaObrero}
                  totalOtrosIngresos={totalOtrosIngresos}
                  user={user}
                  sortColumn={sortColumn}
                />
                <section>
                  <div className="row">
                    <div className="col">
                      <span className="text-success h5">
                        Monto en Deposito: {formatNumber(totalDepositos)}
                      </span>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col">
                      <span className="text-primary h5">
                        Monto en Efectivo: {formatNumber(totalEfectivo)}
                      </span>
                    </div>
                  </div>

                  {/* <div className="col">
                    <span className="text-danger h5">
                      Monto en Salidas: {formatNumber(totalSalidas)}
                    </span>
                  </div> */}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Cuadre;
