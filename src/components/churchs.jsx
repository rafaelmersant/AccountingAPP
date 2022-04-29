import React, { Component } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { paginate } from "../utils/paginate";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import NewButton from "./common/newButton";
import ChurchsTable from "./tables/churchsTable";
import { getChurchs, deleteChurch } from "../services/churchService";

class Churchs extends Component {
  state = {
    churchs: [],
    currentPage: 1,
    pageSize: 10,
    searchQuery: "",
    sortColumn: { path: "created_date", order: "desc" },
  };

  async componentDidMount() {
    const { data: churchs } = await getChurchs();

    this.setState({ churchs });
  }

  handleDelete = async (church) => {
    const answer = window.confirm(
      "Esta seguro de eliminar esta iglesia? \nNo podrá deshacer esta acción"
    );
    if (answer) {
      const originalChurchs = this.state.churchs;
      const churchs = this.state.churchs.filter((m) => m.id !== church.id);
      this.setState({ churchs });

      try {
        await deleteChurch(church.id);
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Esta iglesia ya fue eliminada");

        this.setState({ churchs: originalChurchs });
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
      churchs: allChurchs,
    } = this.state;

    let filtered = allChurchs;
    if (searchQuery)
      filtered = allChurchs.filter((m) =>
        m.global_title.toLowerCase().startsWith(searchQuery.toLocaleLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const churchs = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, churchs };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    const { totalCount, churchs } = this.getPagedData();

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="mb-4">
              <NewButton label="Nueva Iglesia" to="/iglesia/new" />
            </div>

            <SearchBox
              value={searchQuery}
              onChange={this.handleSearch}
              placeholder="Buscar..."
            />
            <ChurchsTable
              churchs={churchs}
              user={user}
              sortColumn={sortColumn}
              onDelete={this.handleDelete}
              onSort={this.handleSort}
            />

            <div className="row">
              <Pagination
                itemsCount={totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={this.handlePageChange}
              />
              <p className="text-muted ml-3 mt-2">
                <em>Mostrando {totalCount} iglesias</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Churchs;
