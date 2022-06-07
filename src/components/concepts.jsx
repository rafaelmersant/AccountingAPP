import React, { Component } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { paginate } from "../utils/paginate";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import NewButton from "./common/newButton";
import ConceptsTable from "./tables/conceptsTable";
import { getConcepts, deleteConcept } from "../services/conceptService";

class Concepts extends Component {
  state = {
    concepts: [],
    currentPage: 1,
    pageSize: 200,
    searchQuery: "",
    sortColumn: { path: "created_date", order: "desc" },
  };

  async componentDidMount() {
    const { data: concepts } = await getConcepts();

    this.setState({ concepts: concepts.results });
  }

  handleDelete = async (concept) => {
    const answer = window.confirm(
      "Esta seguro de eliminar este concepto? \nNo podrá deshacer esta acción"
    );
    if (answer) {
      const originalConcepts = this.state.concepts;
      const concepts = this.state.concepts.filter((m) => m.id !== concept.id);
      this.setState({ concepts });

      try {
        await deleteConcept(concept.id);
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Este concepto ya fue eliminado");

        this.setState({ concepts: originalConcepts });
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
      concepts: allConcepts,
    } = this.state;

    let filtered = allConcepts;
    if (searchQuery)
      filtered = allConcepts.filter((m) =>
        m.description.toLowerCase().includes(searchQuery.toLocaleLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const concepts = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, concepts };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    const { totalCount, concepts } = this.getPagedData();

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h5 className="pull-left text-info mt-2">Listado de Conceptos</h5>
            <div className="mb-4">
              <NewButton label="Nuevo Concepto" to="/concepto/new" />
            </div>

            <SearchBox
              value={searchQuery}
              onChange={this.handleSearch}
              placeholder="Buscar..."
            />
            <ConceptsTable
              concepts={concepts}
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
                <em>Mostrando {totalCount} conceptos</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Concepts;
