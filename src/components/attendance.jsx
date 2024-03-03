import React, { Component } from "react";
import { toast } from "react-toastify";
import { getPeople } from "../services/personService";
import SearchPerson from "./common/searchPerson";
import { deleteAttendance, getAttendanceByPerson, getAttendances, saveAttendance } from "../services/attendanceService";
import { getCurrentUser } from "../services/authService";
import Loading from "./common/loading";
import AttendancesTable from "./tables/attendancesTable";
import Pagination from "react-js-pagination";

class Attendance extends Component {
  state = {
    loading: true,
    people: [],
    attendances: [],
    clearSearchPerson: false,
    searchPersonText: "",
    searchPersonTextType: "",
    selectedPerson: {},
    attendanceDone: false,
    totalAttendances: 0,
    sortColumn: { path: "created_date", order: "desc" },
  };

  async componentDidMount() {
    this.populatePeople();
    this.populateAttendances();

    this.intervalEntryId = setInterval(async () => {
      await this.populateAttendances();
    }, 4000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalEntryId);
  }

  async populatePeople() {
    const { data: people } = await getPeople();
    this.setState({ people: people.results });
  }

  async populateAttendances(_sortColumn, _currentPage) {
    const { currentPage, sortColumn } = { ...this.state };

    _sortColumn = _sortColumn ? _sortColumn : sortColumn;
    _currentPage = _currentPage ? _currentPage : currentPage;

    const { data: attendances } = await getAttendances();
    this.setState({ attendances: attendances.results, loading: false });

    console.log("data:", attendances.results);
    this.setState({
      attendances: attendances.results,
      totalAttendances: attendances.count,
      loading: false,
      sortColumn: _sortColumn,
      currentPage: _currentPage,
    });
  }

  handleSelectPerson = async (person) => {
    const handler = (e) => {
      e.preventDefault();
      if (e.type !== "keydown" && e.type !== "mousedown") {
        this.setState({
          searchPersonText: `${person.first_name} ${person.last_name}`,
        });
      }
    };
    handler(window.event);

    const { data: attendance } = await getAttendanceByPerson(
      person.id,
      new Date().toISOString().split("T")[0]
    );

    if (attendance.results.length > 0)
      toast.info(`Ya este obrero fue registrado para hoy.`);

    this.setState({
      selectedPerson: person,
      attendanceDone: attendance.results.length > 0,
    });
  };

  handleSearchPerson = async (value) => {
    this.setState({ clearSearchPerson: value });
  };

  handleCleanPerson = async () => {
    this.populatePeople();
    this.setState({
      searchPersonText: "",
      selectedPerson: {},
    });
  };

  handleAttendance = async () => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    if (this.state.attendanceDone) {
      toast.error(`Ya este obrero fue registrado para hoy.`);

      return false;
    }

    setTimeout(async () => {
      toast.success(
        `Asistencia registrada para el obrero: ${this.state.selectedPerson.first_name} ${this.state.selectedPerson.last_name}`
      );

      const attendance = {
        id: 0,
        person_id: this.state.selectedPerson.id,
        created_by: getCurrentUser().id,
        attendance_date: new Date().toISOString().split("T")[0],
      };

      await saveAttendance(attendance);

      this.setState({
        selectedPerson: {},
        searchPersonText: "",
        clearSearchPerson: true,
      });

      document.querySelector("div#divPerson input").focus();
    }, 150);
  };

  handlePageChange = async (page) => {
    this.setState({ currentPage: page });

    await this.populateAttendances(null, page);
  };

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });

    await this.populateAttendances(sortColumn);
  };

  handleDelete = async (attendance) => {
    const answer = window.confirm(
      "Esta seguro de eliminar este registro? \nNo podrá deshacer esta acción"
    );
    if (answer) {
      const originalAttendances = this.state.attendances;
      const attendances = this.state.attendances.filter((m) => m.id !== attendance.id);
      this.setState({ attendances });

      try {
        await deleteAttendance(attendance.id);
        toast.success(
          `El registro #${attendance.id} correspondiente al obrero: ${attendance.person.full_name} fue eliminado!`
        );
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Este registro ya fue eliminado");

        this.setState({ attendances: originalAttendances });
      }
    }
  };

  validateAttendance() {
    if (Object.keys(this.state.selectedPerson).length > 0) return false;
    return true;
  }

  render() {
    const { pageSize, currentPage, sortColumn } = this.state;
    const { user } = this.props;

    const { totalAttendances, attendances } = { ...this.state };
    const total = attendances ? attendances.length : 0;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h5 className="pull-left text-info mt-2">Asistencia de Obreros</h5>
          </div>
        </div>

        <div>
          <div className="row">
            <div className="col-12 mb-3" id="divPerson">
              <SearchPerson
                onSelect={this.handleSelectPerson}
                onClearSearchPerson={this.handleSearchPerson}
                clearSearchPerson={this.state.clearSearchPerson}
                value={this.state.searchPersonText}
                data={this.state.people}
                selectedItem={this.state.selectedPerson}
              />
            </div>
            <div>
              {Object.keys(this.state.selectedPerson).length > 0 && (
                <div
                  style={{
                    marginTop: "36px",
                  }}
                >
                  <span
                    className="fa fa-trash text-danger"
                    style={{
                      fontSize: "24px",
                      position: "absolute",
                      marginLeft: "-39px",
                      cursor: "pointer",
                      zIndex: 99,
                    }}
                    title="Limpiar filtro de obrero"
                    onClick={this.handleCleanPerson}
                  ></span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="row">
            <div className="col-12 mb-3">
              <button
                className="btn btn-info"
                onClick={this.handleAttendance}
                disabled={this.validateAttendance()}
              >
                Registrar Asistencia
              </button>
            </div>
          </div>
        </div>

        {this.state.loading && (
          <div className="d-flex justify-content-center mb-3">
            <Loading />
          </div>
        )}

        {!this.state.loading && (
          <AttendancesTable
            attendances={this.state.attendances}
            user={user}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
        )}

        {!this.state.loading && attendances.length > 0 && (
          <div className="row">
            <div>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={pageSize}
                totalItemsCount={totalAttendances}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange.bind(this)}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
            <p className="text-muted ml-3 mt-2">
              <em>
                Mostrando {total} registros de {totalAttendances}
              </em>
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default Attendance;
