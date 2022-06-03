import React from "react";
import _ from "lodash";
import * as Sentry from "@sentry/react";
import { NavLink } from "react-router-dom";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import ReactToPrint from "react-to-print";
import Form from "../common/form";
import Input from "../common/input";
import SearchChurch from "../common/searchChurch";
import SearchPerson from "../common/searchPerson";
import SearchConcept from "../common/searchConcept";

import Loading from "../common/loading";

import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import PrintEntry from "../reports/printEntry";
import { getCurrentUser } from "../../services/authService";

import {
  saveEntryHeader,
  saveEntryDetail,
  getEntryHeader,
  getEntryDetail,
  deleteEntryDetail,
} from "../../services/entryServices";

import EntryDetailTable from "../tables/entryDetailTable";

import {
  mapToViewEntryDetail,
  mapToViewEntryHeader,
} from "../mappers/mapEntry";
import ChurchModal from "../modals/churchModal";
import PersonModal from "../modals/personModal";
import ConceptModal from "../modals/conceptModal";
import { getConcept, getConcepts } from "../../services/conceptService";
import PrintEntrySmall from "../reports/printEntrySmall";
// import Select from "../common/select";

registerLocale("es", es);

class EntryForm extends Form {
  _isMounted = false;

  state = {
    data: {
      id: 0,
      church_id: "",
      church: {},
      person_id: "",
      person: {},
      note: "",
      period_year: new Date().getFullYear(),
      period_month: new Date().getMonth() + 1,
      total_amount: 0,
      created_by: getCurrentUser().id,
      created_date: new Date().toISOString(),
    },
    loading: true,
    disabledSave: false,
    entryDate: new Date(),
    concepts: [],
    details: [],
    detailsOriginal: [],
    detailsToDelete: [],
    line: {
      id: 0,
      entry_id: 0,
      concept_id: 0,
      concept: "",
      amount: 0,
      reference: "",
      type: "",
      period_year: new Date().getFullYear(),
      period_month: new Date().getMonth(),
      created_date: new Date().toISOString(),
    },
    type: [
      { id: "E", name: "Entrada" },
      { id: "S", name: "Salida" },
    ],
    errors: {},
    currentConcept: {},
    action: "Nuevo Registro",
    clearSearchConcept: false,
    clearSearchPerson: false,
    clearSearchChurch: false,
    hideSearchConcept: false,
    hideSearchChurch: false,
    hideSearchPerson: false,
    searchConceptText: "",
    searchChurchText: "",
    searchPersonText: "",
    serializedEntryHeader: {},
    serializedEntryDetail: [],
  };

  //Schema (Joi)
  schema = {
    id: Joi.number(),
    church_id: Joi.optional(),
    church: Joi.optional(),
    person_id: Joi.optional(),
    person: Joi.optional(),
    note: Joi.optional(),
    period_year: Joi.optional(),
    period_month: Joi.optional(),
    total_amount: Joi.optional(),
    created_by: Joi.number(),
    created_date: Joi.string(),
  };

  async populateConcepts() {
    const { data: concepts } = await getConcepts();
    this.setState({ concepts: concepts.results });
  }

  resetLineValues() {
    const line = { ...this.state.line };
    line.id = 0;
    line.concept_id = 0;
    line.concept = "";
    line.amount = 0;
    line.reference = "";
    line.type = "";
    line.period_year = new Date().getFullYear();
    line.period_month = new Date().getMonth();
    line.created_date = new Date().toISOString();

    this.setState({ line });
  }

  newEntry = () => {
    window.location = `/registro/new`;
  };

  updateLine = (concept) => {
    const line = { ...this.state.line };

    line.concept_id = concept.id;
    line.concept = concept.description;
    line.type = concept.type; 
    line.amount = line.type === "S" ? line.amount * -1 : line.amount;

    this.setState({ line });
  };

  updateTotals = () => {
    const data = { ...this.state.data };
    data.total_amount = 0;

    this.state.details.forEach((item) => {
      data.total_amount += Math.round(parseFloat(item.amount) * 100) / 100;
    });

    data.total_amount = Math.round(data.total_amount * 100) / 100;

    this.setState({ data });
  };

  async populateEntry() {
    try {
      const entry_id = this.props.match.params.id;
      if (entry_id === "new") {
        this.setState({ loading: false });
        return;
      }

      const { data: entryHeader } = await getEntryHeader(entry_id);

      const { data: entryDetail } = await getEntryDetail(entryHeader.id);

      const entryHeaderMapped = mapToViewEntryHeader(entryHeader);
      
      const searchChurchText = entryHeader.church
        ? `${entryHeader.church.global_title}`
        : "";
      const searchPersonText = entryHeader.person
        ? `${entryHeader.person.first_name} ${entryHeader.person.last_name}`
        : "";

      this.setState({
        data: entryHeaderMapped,
        details: mapToViewEntryDetail(entryDetail),
        detailsOriginal: mapToViewEntryDetail(entryDetail),
        entryDate: new Date(entryHeader.created_date),
        searchChurchText: searchChurchText,
        searchPersonText: searchPersonText,
        hideSearchChurch: true,
        hideSearchPerson: true,
        action: "Detalle de registro No. ",
        serializedEntryHeader: entryHeader,
        serializedEntryDetail: entryDetail,
        loading: false,
      });

      this.forceUpdate();

      if (sessionStorage["printEntry"] === "y") {
        sessionStorage["printEntry"] = "";
        this.printButton.click();
      }

      if (sessionStorage["newEntry"] === "y") {
        sessionStorage["newEntry"] = null;
      }
    } catch (ex) {
      sessionStorage["newEntry"] = null;

      try {
        Sentry.captureException(ex);
      } catch (_ex) {
        console.log(ex);
      }

      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  handleChangeEntryDate = (date) => {
    const data = { ...this.state.data };
    data.creationDate = date.toISOString();
    this.setState({ data, entryDate: date });
  };

  handleChangeEntryLine = ({ currentTarget: input }) => {
    const line = { ...this.state.line };
    line[input.name] = input.value;
    this.setState({ line });

    if (this.state.currentConcept.length)
      this.updateLine(this.state.currentConcept);
  };

  handleSelectConcept = async (concept) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    if (concept.id === 0) {
      this.raiseConceptModal.click();
      return false;
    }

    const concept_found = _.find(this.state.details, function (item) {
      return item.concept_id === concept.id;
    });

    if (concept_found !== undefined) {
      toast.error("Este concepto ya fue agregado.");
      return false;
    }

    //default Cuota Obrero amount
    const { line } = {...this.state};
    const defaultAmount = concept.id === 4 ? 100 : 0;
    const defaultMonth = concept.id === 4 ? new Date().getMonth() + 1 : new Date().getMonth();
    line.amount = defaultAmount;
    line.period_month = defaultMonth;

    this.setState({
      line,
      hideSearchConcept: true,
      clearSearchConcept: false,
      currentConcept: concept,
      searchConceptText: concept.description,
    });

    this.updateLine(concept);
  };

  handleFocusConcept = (value) => {
    setTimeout(() => {
      this.setState({ hideSearchConcept: value });
    }, 200);
  };

  handleSelectChurch = async (church) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    if (church.id === 0) {
      this.raiseChurchModal.click();
      return false;
    }

    const data = { ...this.state.data };
    data.church_id = church.id;

    this.setState({
      data,
      hideSearchChurch: true,
      clearSearchChurch: false,
      searchChurchText: `${church.global_title}`,
    });
  };

  handleFocusChurch = (value) => {
    setTimeout(() => {
      this.setState({ hideSearchChurch: value });
    }, 200);
  };

  handleSelectPerson = async (person) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    if (person.id === 0) {
      this.raisePersonModal.click();
      return false;
    }

    const data = { ...this.state.data };
    data.person_id = person.id;

    this.setState({
      data,
      hideSearchPerson: true,
      clearSearchPerson: false,
      searchPersonText: `${person.first_name} ${person.last_name}`,
    });
  };

  handleFocusPerson = (value) => {
    setTimeout(() => {
      this.setState({ hideSearchPerson: value });
    }, 200);
  };

  handleAddDetail = () => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    setTimeout(() => {
      this.updateLine(this.state.currentConcept);
      const details = [...this.state.details];
      const line = { ...this.state.line };
      line.amount = Math.round(line.amount * 100) / 100;

      console.log('line', line)

      if (this.state.line.concept_id) details.push(line);

      this.setState({
        details,
        currentConcept: {},
        searchConceptText: "",
        clearSearchConcept: true,
      });

      this.updateTotals();
      this.resetLineValues();
    }, 150);
  };

  handleDeleteDetail = (detail, soft = false) => {
    let answer = true;

    if (!soft) {
      answer = window.confirm(
        `Seguro que desea eliminar el concepto: \n ${detail.concept}`
      );
    }

    if (answer) {
      const detailsToDelete = [...this.state.detailsToDelete];
      if (!soft) detailsToDelete.push(detail);

      const details = this.state.details.filter(
        (d) => d.concept_id !== detail.concept_id
      );

      this.setState({ details, detailsToDelete });

      setTimeout(() => {
        this.updateTotals();
      });
    }
  };

  handleEditDetail = async (detail) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    const line = { ...detail };
    const { data: concept } = await getConcept(detail.concept_id);

    this.setState({
      line,
      currentConcept: concept.results[0],
      hideSearchConcept: true,
      searchConceptText: line.concept,
    });

    this.handleDeleteDetail(detail, true);
  };

  handleSetNewChurch = (e) => {
    this.handleSelectChurch(e);
  };

  handleSetNewPerson = (e) => {
    this.handleSelectPerson(e);
  };

  handleSetNewConcept = (e) => {
    // this.setState({ searchConceptText: `${e.description}` });
    this.handleSelectConcept(e);
  };

  isEntryEditable = () => {
    const isNew = this.state.data.id === 0;
    const isUserCapable =
      getCurrentUser().role === "Admin" || getCurrentUser().role === "Owner";

    if (isNew) return isNew;
    else return !isNew && isUserCapable;
  };

  async componentDidMount() {
    this._isMounted = true;

    try {
      await this.populateConcepts();
      await this.populateEntry(false);
    } catch (ex) {
      try {
        Sentry.captureException(ex);
      } catch (_ex) {
        console.log(ex);
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  validateLine() {
    if (!this.state.line.concept_id) return true;
    if (!parseFloat(this.state.line.amount) > 0) return true;

    if (this.state.line.amount <= 0) return false;
  }

  doSubmit = async () => {
    try {
      if (this.state.disabledSave) return false;

      this.setState({ disabledSave: true });

      const { data: entryHeader } = await saveEntryHeader(this.state.data);

      for (const item of this.state.details) {
        const detail = {
          id: item.id,
          entry_id: entryHeader.id,
          concept_id: item.concept_id,
          amount: item.amount,
          reference: item.reference,
          type: item.type,
          period_year: item.period_year,
          period_month: item.period_month,
          created_date: new Date().toISOString(),
        };

        await saveEntryDetail(detail);
      }

      try {
        for (const item of this.state.detailsToDelete) {
          await deleteEntryDetail(item.entry_id, item.id);
        }
      } catch (ex) {
        try {
          Sentry.captureException(ex);
        } catch (_ex) {
          console.log(ex);
        }
        console.log("Exception for deleteEntryDetail --> " + ex);
      }

      this.setState({ disabledSave: false });

      sessionStorage["newEntry"] = "y";
      window.location = `/registro/${entryHeader.id}`;
    } catch (ex) {
      try {
        Sentry.captureException(ex);
      } catch (_ex) {
        console.log(ex);
      }

      if (ex.response && ex.response.status >= 400 && ex.response.status < 500)
        toast.error("Hubo un error en la información enviada.");

      if (ex.response && ex.response.status >= 500) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });

        toast.error(
          "Parece que hubo un error en el servidor. Favor contacte al administrador."
        );
        console.log("errors", this.state.errors);
      }
    }
  };

  handleCleanConcept = async () => {
    this.setState({ currentConcept: {}, searchConceptText: "" });
  };

  handleCleanChurch = async () => {
    const { data } = { ...this.state };
    data.church_id = 0;
    this.setState({ data, searchChurchText: "" });
  };

  handleCleanPerson = async () => {
    const { data } = { ...this.state };
    data.person_id = 0;
    this.setState({ data, searchPersonText: "" });
  };

  render() {
    const { user } = this.props;
    const role = getCurrentUser().role;

    return (
      <React.Fragment>
        <div className="container-fluid">
          <h4 className="bg-dark text-light pl-2 pr-2 list-header">
            {this.state.action}
            {this.state.data.id > 0 &&
              !this.state.action.includes("Nuevo") &&
              this.state.data.id}
          </h4>
          <div
            className="col-12 pb-3 bg-light"
            disabled={!this.isEntryEditable()}
          >
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-8">
                  <SearchChurch
                    onSelect={this.handleSelectChurch}
                    onFocus={() => this.handleFocusChurch(false)}
                    onBlur={() => this.handleFocusChurch(true)}
                    clearSearchChurch={this.state.clearSearchChurch}
                    hide={this.state.hideSearchChurch}
                    value={this.state.searchChurchText}
                    label="Iglesia"
                  />
                </div>
                <div>
                {this.state.data.church_id > 0 && (
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
                        }}
                        title="Limpiar filtro de iglesia"
                        onClick={this.handleCleanChurch}
                      ></span>
                    </div>
                  )}
                </div>

                <div className="col-2">
                  <label className="mr-1">Fecha</label>
                  <div
                    className="mr-3"
                    disabled={
                      getCurrentUser().role !== "Admin" &&
                      getCurrentUser().role !== "Owner"
                    }
                  >
                    <DatePicker
                      className="form-control form-control-sm"
                      selected={this.state.entryDate}
                      onChange={(date) => this.handleChangeEntryDate(date)}
                      dateFormat="dd/MM/yyyy hh:mm aa"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-8">
                  <SearchPerson
                    onSelect={this.handleSelectPerson}
                    onFocus={() => this.handleFocusPerson(false)}
                    onBlur={() => this.handleFocusPerson(true)}
                    clearSearchPerson={this.state.clearSearchPerson}
                    hide={this.state.hideSearchPerson}
                    value={this.state.searchPersonText}
                    label="Obrero"
                  />
                </div>
                <div>
                {this.state.data.person_id > 0 && (
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
                        }}
                        title="Limpiar filtro de obrero"
                        onClick={this.handleCleanPerson}
                      ></span>
                    </div>
                  )}
                </div>

                <div className="col-4">
                  {this.renderInput("note", "Nota", "text", "", "Opcional")}
                </div>
              </div>

              <div className="row mr-0 ml-0 pr-0 pl-0">
                <div className="col-5 mr-0 ml-0 pr-0 pl-0">
                  <SearchConcept
                    onSelect={this.handleSelectConcept}
                    onFocus={() => this.handleFocusConcept(false)}
                    onBlur={() => this.handleFocusConcept(true)}
                    clearSearchConcept={this.state.clearSearchConcept}
                    hide={this.state.hideSearchConcept}
                    value={this.state.searchConceptText}
                    label="Concepto"
                  />
                </div>
                {Object.keys(this.state.currentConcept).length > 0 && (
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
                        marginLeft: "-29px",
                        cursor: "pointer",
                      }}
                      title="Limpiar filtro de concepto"
                      onClick={this.handleCleanConcept}
                    ></span>
                  </div>
                )}

                <div className="col-2 mr-0 ml-0 pr-0 pl-0">
                  <Input
                    type="text"
                    name="amount"
                    value={this.state.line.amount}
                    label="Monto"
                    onChange={this.handleChangeEntryLine}
                  />
                </div>
                <div className="col-2 mr-0 ml-0 pr-0 pl-0">
                  <Input
                    type="text"
                    name="reference"
                    value={this.state.line.reference}
                    label="Referencia"
                    onChange={this.handleChangeEntryLine}
                  />
                </div>
                <div className="col-1 mr-0 ml-0 pr-0 pl-0">
                  <Input
                    type="text"
                    name="period_month"
                    value={this.state.line.period_month}
                    label="Mes"
                    onChange={this.handleChangeEntryLine}
                  />
                </div>
                <div className="col-1 mr-0 ml-0 pr-0 pl-0">
                  <Input
                    type="text"
                    name="period_year"
                    value={this.state.line.period_year}
                    label="Año"
                    onChange={this.handleChangeEntryLine}
                  />
                </div>
                {/* <div className="col-2 mr-0 ml-0 pr-0 pl-0">
                <Select
                      name="type"
                      value={this.state.data.type}
                      label="Tipo"
                      options={this.state.type}
                      onChange={this.handleChangeEntryLine}
                      error={null}
                      disabled={this.state.data.id}
                    />
                </div> */}

                <div
                  className="col-1 pt-0 pb-0 mr-0 ml-0 pr-0 pl-0"
                  style={{ marginTop: "1.98em" }}
                >
                  <button
                    className="btn btn-info btn-sm ml-1 pl-3 pr-3"
                    onClick={this.handleAddDetail}
                    disabled={this.validateLine()}
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {this.state.loading && (
                <div className="d-flex justify-content-center">
                  <Loading />
                </div>
              )}

              {!this.state.loading && (
                <EntryDetailTable
                  entryHeader={this.state.data}
                  details={this.state.details}
                  user={user}
                  onDelete={this.handleDeleteDetail}
                  onEdit={this.handleEditDetail}
                />
              )}

              {this.isEntryEditable() && this.renderButton("Guardar")}
            </form>
          </div>

          <button
            type="button"
            data-toggle="modal"
            data-target="#churchModal"
            hidden="hidden"
            ref={(button) => (this.raiseChurchModal = button)}
          ></button>
          <button
            type="button"
            data-toggle="modal"
            data-target="#personModal"
            hidden="hidden"
            ref={(button) => (this.raisePersonModal = button)}
          ></button>
          <button
            type="button"
            data-toggle="modal"
            data-target="#conceptModal"
            hidden="hidden"
            ref={(button) => (this.raiseConceptModal = button)}
          ></button>

          <ChurchModal setNewChurch={this.handleSetNewChurch} />
          <PersonModal setNewPerson={this.handleSetNewPerson} />
          <ConceptModal setNewConcept={this.handleSetNewConcept} />

          <div className="container-fluid mt-3">
            {(role === "Admin" || role === "Owner") && (
              <NavLink className="btn btn-secondary" to="/registros">
                {"<-"} Ir al listado
              </NavLink>
            )}

            <button
              className="btn btn-success mb-3 pull-right"
              onClick={this.newEntry}
            >
              Nuevo Registro
            </button>
          </div>

          <div className="d-flex justify-content-end w-100 pr-3 mb-3">
            {this.state.data.id > 0 && (role === "Admin" || role === "Owner") && (
              <ReactToPrint
                trigger={() => (
                  <span
                    ref={(button) => (this.printButton = button)}
                    className="fa fa-print text-success cursor-pointer"
                    style={{ fontSize: "35px" }}
                  ></span>
                )}
                content={() => this.componentRef}
                // onAfterPrint={() => this.quotationPrinted()}
                //onBeforePrint={() => this.quotationPrinted()}
              />
            )}
          </div>

          <div hidden="hidden">
            <PrintEntry
              ref={(el) => (this.componentRef = el)}
              entryHeader={this.state.serializedEntryHeader}
              entryDetail={this.state.serializedEntryDetail}
            />
          </div>

          {/* <div className="d-flex justify-content-end w-100 pr-3 mb-3">
            {this.state.data.id > 0 && (role === "Admin" || role === "Owner") && (
              <ReactToPrint
                trigger={() => (
                  <span
                    ref={(button) => (this.printButton2 = button)}
                    className="fa fa-print text-info cursor-pointer"
                    style={{ fontSize: "35px" }}
                  ></span>
                )}
                content={() => this.componentRef}
                // onAfterPrint={() => this.quotationPrinted()}
                //onBeforePrint={() => this.quotationPrinted()}
              />
            )}
          </div>

          <div hidden="hidden">
            <PrintEntrySmall
              ref={(el) => (this.componentRef = el)}
              entryHeader={this.state.serializedEntryHeader}
              entryDetail={this.state.serializedEntryDetail}
            />
          </div> */}
        </div>
      </React.Fragment>
    );
  }
}

export default EntryForm;
