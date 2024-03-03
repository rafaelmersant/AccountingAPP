import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import SearchBox from "./common/searchBox";
import NewButton from "./common/newButton";
import Loading from "./common/loading";
import { getPeople, deletePerson } from "../services/personService";
import PeopleTable from "./tables/peopleTable";
import { getChurches } from "../services/churchService";
import SearchChurch from "./common/searchChurch";

class People extends Component {
  state = {
    loading: true,
    people: [],
    churches: [],
    currentPage: 1,
    pageSize: 2000,
    searchQuery: "",
    totalPeople: 0,
    sortColumn: { path: "id", order: "asc" },
    clearSearchChurch: false,
    searchChurchText: "",
    searchChurchTextType: "",
    selectedChurch: {}
  };

  async componentDidMount() {
    this.populatePeople();
    this.populateChurches();
  }

  async populatePeople(_sortColumn, _currentPage, _searchQuery = "") {
    const { currentPage, sortColumn, searchQuery } = { ...this.state };

    _sortColumn = _sortColumn ? _sortColumn : sortColumn;
    _currentPage = _currentPage ? _currentPage : currentPage;
    _searchQuery = _searchQuery ? _searchQuery : searchQuery;

    const { data: people } = await getPeople(
      _sortColumn,
      _currentPage,
      _searchQuery
    );

    this.setState({
      people: people.results,
      totalPeople: people.count,
      loading: false,
      sortColumn: _sortColumn,
      currentPage: _currentPage,
    });
  }

  async populateChurches() {
    const { data: churches } = await getChurches();
    this.setState({ churches: churches.results });
  }

  handleDelete = async (person) => {
    // const { data: found } = await getCustomerInInvoice(
    //   person.id
    // );

    // if (found.count) {
    //   toast.error("No puede eliminar un cliente que tiene factura creada.");
    //   return false;
    // }

    const answer = window.confirm(
      "Esta seguro de eliminar este obrero? \nNo podrá deshacer esta acción"
    );
    if (answer) {
      const originalPeople = this.state.people;
      const people = this.state.people.filter((m) => m.id !== person.id);
      this.setState({ people });

      try {
        await deletePerson(person.id);
        toast.success(
          `El obrero ${person.first_name} ${person.last_name} fue eliminado!`
        );
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Este obrero ya fue eliminado");

        this.setState({ people: originalPeople });
      }
    }
  };

  handlePageChange = async (page) => {
    this.setState({ currentPage: page });

    await this.populatePeople(null, page);
  };

  handleSearch = async (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
    await this.populatePeople(null, null, query);
  };

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });

    await this.populatePeople(sortColumn);
  };

  handleSelectChurch = async (church) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    const filteredPeople = this.state.people.filter(function (person) {
      return person.church && person.church.id === church.id;
    });

    this.setState({
      selectedChurch: church,
      clearSearchChurch: false,
      searchChurchText: `${church.global_title}`,
      people: filteredPeople
    });
  };

  handleTypingChurch = (value) => {
    this.setState({ searchChurchTextType: value });
  };

  handleSearchChurch = async (value) => {
    this.setState({ clearSearchChurch: value });
  };

  handleCleanChurch = async () => {
    this.populatePeople();
    this.setState({ searchChurchText: "", selectedChurch: {} });
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    const { totalPeople, people } = { ...this.state };
    const total = people ? people.length : 0;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h5 className="pull-left text-info mt-2">Listado de Obreros</h5>

            <div className="mb-4">
              <NewButton label="Nuevo Obrero" to="/obrero/new" />
            </div>

            <div>
              <SearchBox
                value={searchQuery}
                onChange={this.handleSearch}
                placeholder="Buscar..."
              />
            </div>
            <div>
              <div className="row">
                <div className="col-12 mb-3">
                  <SearchChurch
                    onSelect={this.handleSelectChurch}
                    onTyping={this.handleTypingChurch}
                    onClearSearchChurch={this.handleSearchChurch}
                    clearSearchChurch={this.state.clearSearchChurch}
                    value={this.state.searchChurchText}
                    data={this.state.churches}
                  />
                </div>
                <div>
                  {Object.keys(this.state.selectedChurch).length > 0 && (
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
                        title="Limpiar filtro de iglesia"
                        onClick={this.handleCleanChurch}
                      ></span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {this.state.loading && (
              <div className="d-flex justify-content-center mb-3">
                <Loading />
              </div>
            )}

            {!this.state.loading && (
              <PeopleTable
                people={people}
                user={user}
                sortColumn={sortColumn}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
              />
            )}

            {!this.state.loading && people.length > 0 && (
              <div className="row">
                <div>
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={pageSize}
                    totalItemsCount={totalPeople}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </div>
                <p className="text-muted ml-3 mt-2">
                  <em>
                    Mostrando {total} obreros de {totalPeople}
                  </em>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default People;
