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

    let totalAmount = 0;
    let totalSalidas = 0;

    for (const entry of allEntries) {
      for (const item of entry.item_set) {
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
              <div className="col-6">
                <CuadreTable
                  entries={entries}
                  totalAmount={totalAmount}
                  user={user}
                  sortColumn={sortColumn}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Cuadre;
