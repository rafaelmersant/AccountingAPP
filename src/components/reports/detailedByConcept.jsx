import React, { Component } from "react";
import _ from "lodash";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../common/loading";
import { paginate } from "../../utils/paginate";
import { getEntryHeaderByRangeDashboard } from "../../services/entryServices";
import Select from "../common/select";
import Input from "../common/input";
import DetailedByConceptTable from "../tables/detailedByConceptTable";

registerLocale("es", es);

class DetailedByConcept extends Component {
  state = {
    data: {
      period_month: new Date().getMonth(),
      period_year: new Date().getFullYear(),
    },
    items: [],
    loading: true,
    entries: [],
    totalCount: 0,
    totalAmount: 0,
    sortColumn: { path: "concept", order: "desc" },
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

  handleChangeParams = async ({ currentTarget: input }) => {
    const { data } = { ...this.state };
    data[input.name] = parseInt(input.value);
    this.setState({ data });

    await this.populateEntries(data.period_month, data.period_year);
  };

  mapToModel = (data) => {
    let result = [];

    for (const item of data) {
      const exist = result.find((_item) => _item.id === item.id);
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

    let records = [];
    let items = [];

    let totalIngresos = 0;
    let totalEgresos = 0;
    let totalAmount = 0;

    for (const entry of allEntries) {
      for (const item of entry.item_set) {
        if (
          item.period_month === period_month &&
          item.period_year === period_year
        ) {
          const amount = item.amount ? parseFloat(item.amount) : 0;
          const acc = records[item.concept.description]
            ? parseFloat(records[item.concept.description])
            : 0;

          if (item.type === "E") {
            records[item.concept.description] = amount + acc;
            totalIngresos += amount;
          } else {
            records[item.concept.description] = amount + acc;
            totalEgresos -= amount;
          }

          console.log(`id: ${entry.id} - Concepto: ${item.concept.description} => ${amount}`);
        }
      }
    }

    totalAmount = totalIngresos - totalEgresos;

    const sorted = _.orderBy(allEntries, [sortColumn.path], [sortColumn.order]);
    const entries = paginate(sorted, 1, 9999999);

    let counter = 1;
    for (const key in records) {
      items.push({ id: counter++, concept: key, amount: records[key] });
    }

    return {
      totalCount: allEntries.length,
      totalAmount,
      totalIngresos,
      totalEgresos,
      entries,
      items,
    };
  };

  render() {
    const { totalAmount, totalIngresos, totalEgresos, items } =
      this.getPagedData();

    return (
      <div className="container-fluid mb-3">
        <div className="row">
          <div className="col">
            <h2 className="text-info bg-light mb-3">
              Reporte Detallado por Concepto
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
              <section className="w-50">
                <DetailedByConceptTable
                  items={items}
                  sortColumn={this.state.sortColumn}
                  totalAmount={totalAmount}
                  totalIngresos={totalIngresos}
                  totalEgresos={totalEgresos}
                />
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DetailedByConcept;
