import React, { Component } from "react";
import _ from "lodash";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../common/loading";
import { paginate } from "../../utils/paginate";
import { getEntryHeaderByRangeDashboard } from "../../services/entryServices";
import { formatNumber } from "../../utils/custom";
import Select from "../common/select";
import Input from "../common/input";

registerLocale("es", es);

class Dashboard extends Component {
  state = {
    data: {
      period_month: new Date().getMonth(),
      period_year: new Date().getFullYear(),
    },
    loading: true,
    entries: [],
    totalCount: 0,
    totalAmount: 0,
    totalAmountEfectivo: 0,
    totalAmountDeposito: 0,
    totalAmountSalidas: 0,
    totalOfrendaMisionera: 0,
    total20Concilio: 0,
    totalCuotaObrero: 0,
    totalOtrosIngresos: 0,
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
    let { data: entries } = await getEntryHeaderByRangeDashboard(
      period_month,
      period_year
    );

    entries = this.mapToModel(entries.results);
    // console.log('entries:', entries)

    // for (const entry of entries) {
    //   for (const item of entry.item_set) {
    //     if (item.concept.id === 1 && item.period_month === 8)
    //       console.log(
    //         `${item.id} month: ${item.period_month} | concept: ${item.concept.description} ${item.concept.id} | item.Amount: ${item.amount}`
    //       );
    //   }
    // }

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
    data[input.name] = parseInt(input.value);
    this.setState({ data });
  };

  mapToModel = (data) => {
    let result = [];

    for (const item of data) {
      const exist = result.find(_item => _item.id === item.id);
      // console.log('exist:', exist)
      if (!exist)
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
    const { period_month, period_year } = this.state.data;

    let totalAmount = 0;
    let totalOfrendaMisionera = 0;
    let total20Concilio = 0;
    let totalCuotaObrero = 0;
    let totalOtrosIngresos = 0;
    let totalAmountDeposito = 0;
    let totalAmountEfectivo = 0;
    let totalAmountSalidas = 0;

    for (const entry of allEntries) {
      for (const item of entry.item_set) {
        if (
          item.concept.id === 1 &&
          item.period_month === period_month &&
          item.period_year === period_year
        )
          total20Concilio += parseFloat(item.amount);

        if (
          item.concept.id === 2 &&
          item.period_month === period_month &&
          item.period_year === period_year
        )
          totalOfrendaMisionera += parseFloat(item.amount);

        if (
          item.concept.id === 4 &&
          item.period_month === period_month &&
          item.period_year === period_year
        )
          totalCuotaObrero += parseFloat(item.amount);

        if (
          item.concept.id !== 1 &&
          item.concept.id !== 2 &&
          item.concept.id !== 4 &&
          item.type !== "S" &&
          item.period_month === period_month &&
          item.period_year === period_year
        )
          totalOtrosIngresos += parseFloat(item.amount);

        if (
          item.method === "D" &&
          item.type !== "S" &&
          item.period_month === period_month &&
          item.period_year === period_year
        ) {
          totalAmountDeposito += parseFloat(item.amount);
        }

        if (
          item.method === "E" &&
          item.type !== "S" &&
          item.period_month === period_month &&
          item.period_year === period_year
        ) {
          totalAmountEfectivo += parseFloat(item.amount);
        }

        if (
          item.type === "S" &&
          item.period_month === period_month &&
          item.period_year === period_year
        ) {
          totalAmountSalidas += parseFloat(item.amount);
        } else if (
          item.period_month === period_month &&
          item.period_year === period_year
        ) {
          totalAmount += parseFloat(item.amount);
        }
      }
    }

    const sorted = _.orderBy(allEntries, [sortColumn.path], [sortColumn.order]);
    const entries = paginate(sorted, 1, 9999999);

    return {
      totalCount: allEntries.length,
      totalAmount,
      totalAmountDeposito,
      totalAmountEfectivo,
      totalAmountSalidas,
      totalOfrendaMisionera,
      total20Concilio,
      totalCuotaObrero,
      totalOtrosIngresos,
      entries,
    };
  };

  render() {
    const {
      totalAmount,
      totalAmountDeposito,
      totalAmountEfectivo,
      totalAmountSalidas,
      totalOfrendaMisionera,
      total20Concilio,
      totalCuotaObrero,
      totalOtrosIngresos,
    } = this.getPagedData();

    return (
      <div className="container-fluid mb-3">
        <div className="row">
          <div className="col">
            <h2 className="text-info bg-light mb-3">Dashboard</h2>
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
                <section className="d-flex justify-content-around">
                  <div>
                    <div className="card card-size text-orange bg-dark mb-3">
                      <div className="card-header">Entrada en Efectivo</div>
                      <div className="card-body">
                        <h5 className="card-title">
                          {formatNumber(totalAmountEfectivo)}
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="card card-size text-white bg-info mb-3">
                      <div className="card-header">Entrada en Deposito</div>
                      <div className="card-body">
                        <h5 className="card-title">
                          {formatNumber(totalAmountDeposito)}
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="card card-size text-white bg-success mb-3">
                    <div className="card-header">Otros Ingresos</div>
                    <div className="card-body">
                      <h5 className="card-title">
                        {formatNumber(totalOtrosIngresos)}
                      </h5>
                    </div>
                  </div>
                </section>

                <section className="d-flex justify-content-around">
                  <div>
                    <div className="card card-size text-white bg-primary mb-3">
                      <div className="card-header">20% al Concilio</div>
                      <div className="card-body">
                        <h5 className="card-title">
                          {formatNumber(total20Concilio)}
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="card card-size bg-warning mb-3">
                      <div className="card-header">Ofrenda Misionera</div>
                      <div className="card-body">
                        <h5 className="card-title">
                          {formatNumber(totalOfrendaMisionera)}
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="card card-size bg-light mb-3">
                    <div className="card-header">Cuota de Obreros</div>
                    <div className="card-body">
                      <h5 className="card-title">
                        {formatNumber(totalCuotaObrero)}
                      </h5>
                    </div>
                  </div>
                </section>

                <section className="d-flex justify-content-around">
                  <div className="card card-size text-white bg-secondary mb-3">
                    <div className="card-header">Entradas Total</div>
                    <div className="card-body">
                      <h5 className="card-title">
                        {formatNumber(totalAmount)}
                      </h5>
                    </div>
                  </div>

                  <div className="card card-size text-white bg-danger mb-3">
                    <div className="card-header">Salidas Total</div>
                    <div className="card-body">
                      <h5 className="card-title">
                        {formatNumber(totalAmountSalidas)}
                      </h5>
                    </div>
                  </div>

                  <div className="card card-size text-dark bg-info mb-3">
                    <div className="card-header">Sobrante</div>
                    <div className="card-body">
                      <h5 className="card-title">
                        {formatNumber(totalAmount + totalAmountSalidas)}
                      </h5>
                    </div>
                  </div>
                </section>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
