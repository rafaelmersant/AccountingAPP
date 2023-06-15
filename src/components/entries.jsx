import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import NewButton from "./common/newButton";
import Loading from "./common/loading";
import SearchEntryBlock from "./common/searchEntryBlock";
import EntriesTable from "./tables/entriesTable";
import { getCurrentUser } from "../services/authService";
import { getEntriesHeader, deleteEntryHeader } from "../services/entryServices";

class Entries extends Component {
  state = {
    loading: true,
    entries: [],
    currentPage: 1,
    pageSize: 20,
    totalEntries: 0,
    sortColumn: { path: "created_date", order: "desc" },
    searchParams: {
      personId: 0,
      churchId: 0,
      entryId: 0,
    },
  };

  async componentDidMount() {
    await this.populateEntries();

    this.intervalEntryId = setInterval(async () => {
      await this.populateEntries();
    }, 4000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalEntryId);
  }

  async populateEntries(_sortColumn, _currentPage) {
    const { entryId, churchId, personId } = {
      ...this.state.searchParams,
    };
    const { currentPage, sortColumn } = { ...this.state };

    _sortColumn = _sortColumn ? _sortColumn : sortColumn;
    _currentPage = _currentPage ? _currentPage : currentPage;

    const { data: entries } = await getEntriesHeader(
      entryId,
      churchId,
      personId,
      _currentPage,
      _sortColumn
    );

    const pageSize = churchId || personId ? entries.count : this.state.pageSize;
    console.log(entries.results)
    this.setState({
      entries: entries.results,
      totalEntries: entries.count,
      loading: false,
      currentPage: _currentPage,
      sortColumn: _sortColumn,
      pageSize,
    });
  }

  handlePageChange = async (page) => {
    this.setState({ currentPage: page });
    sessionStorage["currentPage"] = parseInt(page);

    await this.populateEntries(null, page);
  };

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });

    await this.populateEntries(sortColumn);
  };

  handleDelete = async (entry) => {
    const answer = window.confirm(
      `Seguro que desea eliminar la transacción #${entry.id}`
    );

    if (answer) {
      try {
        const entries = this.state.entries.filter(
          (item) => item.id !== entry.id
        );
        this.setState({ entries });

        var deleted = await deleteEntryHeader(entry.id);
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Esta transacción ya fue eliminada");
      }

      if (deleted && deleted.status === 200)
        toast.success(`La transacción #${entry.id} fue eliminada con exito!`);
    }
  };

  handleEntryChange = async (entryId) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    const { searchParams } = { ...this.state };
    searchParams.entryId = entryId;

    this.setState({ searchParams, loading: true });
    this.populateEntries(null, 1);
  };

  handlePersonChange = async (personId) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    const { searchParams } = { ...this.state };
    searchParams.personId = personId;
    searchParams.churchId = "";
    searchParams.entryId = "";

    this.setState({ searchParams, loading: true });
    this.populateEntries(null, 1);
  };

  handleChurchChange = async (churchId) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    const { searchParams } = { ...this.state };
    searchParams.churchId = churchId;
    searchParams.personId = "";
    searchParams.entryId = "";

    this.setState({ searchParams, loading: true });
    this.populateEntries(null, 1);
  };

  render() {
    const { entries, sortColumn, totalEntries, pageSize, currentPage } =
      this.state;
    const user = getCurrentUser();
    const total = entries ? entries.length : 0;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between mb-3">
              <div>
                <h5 className="text-info">Búsqueda</h5>
              </div>
              <div>
                <NewButton label="Nuevo Registro" to="/registro/new" />
              </div>
            </div>

            <SearchEntryBlock
              onEntryChange={this.handleEntryChange}
              onChurchChange={this.handleChurchChange}
              onPersonChange={this.handlePersonChange}
            />

            {this.state.loading && (
              <div className="d-flex justify-content-center">
                <Loading />
              </div>
            )}

            {!this.state.loading && entries.length > 0 && (
              <div className="row">
                <EntriesTable
                  entries={entries}
                  user={user}
                  sortColumn={sortColumn}
                  onDelete={this.handleDelete}
                  onSort={this.handleSort}
                />
              </div>
            )}
            {!entries.length && (
              <div className="text-center mt-5 mb-5">
                <h5>
                  No existen registros con el criterio de búsqueda especificado
                </h5>
              </div>
            )}

            {!this.state.loading && entries.length > 0 && (
              <div className="row">
                <div>
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={pageSize}
                    totalItemsCount={totalEntries}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </div>
                <p className="text-muted ml-3 mt-2">
                  <em>
                    Mostrando {total} transacciones de {totalEntries}
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

export default Entries;
