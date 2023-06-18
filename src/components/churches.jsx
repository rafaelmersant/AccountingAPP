import React, { Component } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { paginate } from "../utils/paginate";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import NewButton from "./common/newButton";
import ChurchesTable from "./tables/churchesTable";
import { getChurches, deleteChurch } from "../services/churchService";
import Loading from "./common/loading";
import { getCurrentUser } from "../services/authService";

class Churches extends Component {
  state = {
    loading: false,
    churches: [],
    currentPage: 1,
    pageSize: 50,
    searchQuery: "",
    sortColumn: { path: "created_date", order: "desc" },
  };

  async componentDidMount() {
    const { data: churches } = await getChurches();

    this.setState({ churches: churches.results, pageSize: churches.count });
  }

  handleDelete = async (church) => {
    const answer = window.confirm(
      "Esta seguro de eliminar esta iglesia? \nNo podrá deshacer esta acción"
    );
    if (answer) {
      const originalChurches = this.state.churches;
      const churches = this.state.churches.filter((m) => m.id !== church.id);
      this.setState({ churches });

      try {
        await deleteChurch(church.id);
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Esta iglesia ya fue eliminada");

        this.setState({ churches: originalChurches });
      }
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      churches: allChurches,
    } = this.state;

    let filtered = allChurches;
    if (searchQuery)
      filtered = allChurches.filter((m) =>
        m.global_title.toLowerCase().includes(searchQuery.toLocaleLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const churches = paginate(sorted, currentPage, pageSize);

    // this.setState({pageSize: filtered.length});

    return { totalCount: filtered.length, churches };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    const { totalCount, churches } = this.getPagedData();

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h5 className="pull-left text-info mt-2">Listado de Cursos</h5>
            {getCurrentUser().role === "Owner" && (
              <div className="mb-4">
                <NewButton label="Nuevo Curso" to="/curso/new" />
              </div>
            )}

            <SearchBox
              value={searchQuery}
              onChange={this.handleSearch}
              placeholder="Buscar..."
            />

            {this.state.loading && (
              <div className="d-flex justify-content-center mb-3">
                <Loading />
              </div>
            )}

            {!this.state.loading && (
              <ChurchesTable
                churches={churches}
                user={user}
                sortColumn={sortColumn}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
              />
            )}

            {!this.state.loading && churches.length > 0 && (
              <div className="row">
                <Pagination
                  itemsCount={totalCount}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={this.handlePageChange}
                />
                <p className="text-muted ml-3 mt-2">
                  Mostrando {totalCount} iglesias
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Churches;
