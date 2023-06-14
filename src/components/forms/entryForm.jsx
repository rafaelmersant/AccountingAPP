import React from "react";
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
import Select from "../common/select";
import { getPeople } from "../../services/personService";

registerLocale("es", es);

class EntryForm extends Form {
  _isMounted = false;

  state = {
    data: {
      id: 0,
      church_id: "2",
      church: {},
      person_id: "",
      person: {},
      note: "",
      period_year: new Date().getFullYear(),
      period_month: new Date().getMonth() + 1,
      total_amount: 0,
      created_by: getCurrentUser().id,
      created_date: new Date().toISOString(),
      entry_date: new Date().toISOString(),
    },
    loading: true,
    disabledSave: false,
    entryDate: new Date(),
    concepts: [],
    people: [],
    details: [],
    detailsOriginal: [],
    detailsToDelete: [],
    line: {
      id: 0,
      entry_id: 0,
      concept_id: 0,
      concept: "",
      amount: "",
      reference: "",
      type: "",
      method: "E",
      period_year: new Date().getFullYear(),
      period_month: new Date().getMonth() + 1,
      created_date: new Date().toISOString(),
      editing: false,
    },
    methods: [
      { id: "E", name: "Efectivo" },
      { id: "D", name: "Deposito" },
    ],
    months: [
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
    errors: {},
    currentConcept: {},
    action: "Nuevo Registro",
    clearSearchConcept: false,
    clearSearchPerson: false,
    clearSearchChurch: false,
    hideSearchChurch: false,
    searchConceptText: "",
    searchChurchText: "AMOR DEL CALVARIO III",
    searchPersonText: "",
    searchPersonTextType: "",
    serializedEntryHeader: {},
    serializedEntryDetail: [],
    totalEntradas: 0,
    totalSalidas: 0,
    totalDiezmos: 0,
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
    total_amount: Joi.number(),
    created_by: Joi.number(),
    created_date: Joi.string(),
    entry_date: Joi.string(),
  };

  async populateConcepts() {
    const { data: concepts } = await getConcepts();
    this.setState({ concepts: concepts.results });
  }

  async populatePeople() {
    const { data: people } = await getPeople();
    this.setState({ people: people.results });
  }

  resetLineValues() {
    const line = { ...this.state.line };
    line.id = 0;
    line.concept_id = 0;
    line.concept = "";
    line.amount = "";
    line.reference = "";
    line.type = "";
    line.method = "E";
    line.period_year = new Date().getFullYear();
    line.period_month = new Date().getMonth() + 1;
    line.created_date = new Date().toISOString();
    line.editing = false;

    this.setState({ line });
  }

  newEntry = () => {
    window.location = `/registro/new`;
  };

  updateLine = async (concept) => {
    let line = { ...this.state.line };
    let { totalEntradas, totalSalidas, totalDiezmos } = { ...this.state };

    line.concept_id = concept.id;
    line.concept = concept.description;
    line.type = concept.type;
    line.amount = line.amount !== "" ? parseFloat(line.amount) : "";

    let amount = line.amount !== "" ? Math.abs(line.amount) : 0;

    if (line.type === "S" && amount !== 0) {
      line.amount = -1 * Math.abs(amount);
      totalSalidas += Math.abs(amount);
    }

    if (line.type === "E") totalEntradas += parseFloat(amount);

    if (line.concept_id === 2) {
      const diezmo =
        line.amount !== ""
          ? Math.abs(line.amount)
          : parseFloat(this.state.data.note);
      totalDiezmos += parseFloat(diezmo);
    }

    this.setState({ line, totalEntradas, totalSalidas, totalDiezmos });
    this.updateTotals();

    return line;
  };

  updateTotals = () => {
    setTimeout(() => {
      const data = { ...this.state.data };
      let totalEntradas = 0;
      let totalSalidas = 0;
      let totalDiezmos = 0;

      data.total_amount = 0;

      for (const item of this.state.details) {
        data.total_amount += Math.round(parseFloat(item.amount) * 100) / 100;
      }

      //Total Entradas/Salidas
      for (const item of this.state.details) {
        if (item.type === "S" && item.concept.id !== 7)
          totalSalidas += Math.abs(
            Math.round(parseFloat(item.amount) * 100) / 100
          );

        if (item.type === "E")
          totalEntradas += Math.round(parseFloat(item.amount) * 100) / 100;

        if (item.concept.id === 2)
          totalDiezmos += Math.round(parseFloat(item.amount) * 100) / 100;
      }

      data.total_amount = Math.round(parseFloat(data.total_amount) * 100) / 100;
      this.setState({ data, totalEntradas, totalSalidas, totalDiezmos });
    }, 200);
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

      //Total Entradas/Salidas
      let totalEntradas = 0;
      let totalSalidas = 0;
      let totalDiezmos = 0;

      entryDetail.forEach((item) => {
        if (item.type === "S" && item.concept.id !== 7)
          totalSalidas += Math.abs(
            Math.round(parseFloat(item.amount) * 100) / 100
          );

        if (item.type === "E")
          totalEntradas += Math.round(parseFloat(item.amount) * 100) / 100;

        if (item.concept.id === 2)
          totalDiezmos += Math.round(parseFloat(item.amount) * 100) / 100;
      });

      this.setState({
        data: entryHeaderMapped,
        details: mapToViewEntryDetail(entryDetail),
        detailsOriginal: mapToViewEntryDetail(entryDetail),
        entryDate: new Date(entryHeader.entry_date),
        searchChurchText: searchChurchText,
        searchPersonText: searchPersonText,
        hideSearchChurch: true,
        action: "Detalle de registro No. ",
        serializedEntryHeader: entryHeader,
        serializedEntryDetail: entryDetail,
        loading: false,
        totalEntradas,
        totalSalidas,
        totalDiezmos,
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

  handleTypingPerson = (value) => {
    this.setState({ searchPersonTextType: value });
  };

  handleChangeEntryDate = (date) => {
    const data = { ...this.state.data };
    data.entry_date = date.toISOString();
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
      if (e.type !== "keydown" && e.type !== "mousedown") {
        this.setState({
          searchConceptText: concept.description,
        });
      }
    };
    handler(window.event);

    if (concept.id === 0) {
      this.raiseConceptModal.click();
      return false;
    }

    this.setState({
      currentConcept: concept,
    });

    this.updateLine(concept);

    document.getElementById("amount").focus();
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
      if (e.type !== "keydown" && e.type !== "mousedown") {
        this.setState({
          searchPersonText: `${person.first_name} ${person.last_name}`,
        });
      }
    };
    handler(window.event);

    document.getElementById("note").focus();

    // const data = { ...this.state.data };
    // data.person_id = person.id;

    this.setState({
      searchPersonTextType: person.full_name,
    });
  };

  handleAddDetail = async () => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    setTimeout(async () => {
      const line = await this.updateLine(this.state.currentConcept);
      const details = [...this.state.details];
      //const line = { ...this.state.line };
      // line.amount = Math.round(parseFloat(line.amount) * 100) / 100;

      if (this.state.line.concept_id) details.push(line);

      this.setState({
        details,
        currentConcept: {},
        searchConceptText: "",
        clearSearchConcept: true,
      });

      // this.updateTotals();
      this.resetLineValues();
    }, 150);

    document.querySelector("div#divDetail input").focus();
  };

  handleAddDetailDiezmo = async () => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);
    const diezmo = this.state.concepts.filter((item) => item.id === 2);

    this.setState({ currentConcept: diezmo[0] });
    const line = await this.updateLine(diezmo[0]);

    const details = [...this.state.details];
    //const line = { ...this.state.line };
    const data = { ...this.state.data };

    line.concept = diezmo[0].description;
    line.concept_id = diezmo[0].id;
    line.amount = Math.round(parseFloat(this.state.data.note) * 100) / 100;
    line.type = "E";
    line.reference = this.state.searchPersonTextType;

    if (line.concept_id) details.push(line);
    data.note = "";

    this.updateTotals();
    this.resetLineValues();

    this.setState({
      details,
      data,
      currentConcept: {},
      clearSearchPerson: true,
    });

    document.querySelector("div#divDiezmo input").focus();
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
        (d) => d !== detail
        // (d) => d.concept_id !== detail.concept_id
      );

      this.setState({ details, detailsToDelete });

      setTimeout(() => {
        this.updateTotals();
      }, 150);
    }
  };

  handleEditDetail = async (detail) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    if (Object.keys(this.state.currentConcept).length !== 0) {
      toast.error(
        "Esta editando una linea actualmente, favor agregarla antes de hacer otro cambio."
      );
      return false;
    }

    const line = { ...detail };
    const { data: concept } = await getConcept(detail.concept_id);
    line.amount = parseFloat(line.amount);
    line.editing = true;

    this.setState({
      line,
      currentConcept: concept.results[0],
      searchConceptText: line.concept,
    });

    this.handleDeleteDetail(detail, true);

    setTimeout(() => {
      document.getElementById("amount").focus();
    }, 300);
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
      await this.populatePeople();
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

    if (parseFloat(this.state.line.amount) === 0) return false;
  }

  doSubmit = async () => {
    try {
      if (Object.keys(this.state.currentConcept).length !== 0) {
        toast.error(
          "Esta editando una linea actualmente, favor agregarla antes de guardar los cambios."
        );
        return false;
      }

      if (this.state.disabledSave) return false;

      if (this.state.details.length === 0) {
        toast.error("Debe agregar al menos una linea en el detalle.");
        return false;
      }

      this.setState({ disabledSave: true });

      const { data, entryDate } = { ...this.state };
      data.period_month = entryDate.getMonth() + 1;
      data.period_year = entryDate.getFullYear();
      
      const { data: entryHeader } = await saveEntryHeader(
        data,
        this.state.details[0].concept
      );

      for (const item of this.state.details) {
        const detail = {
          id: item.id,
          entry_id: entryHeader.id,
          concept_id: item.concept_id,
          amount: parseFloat(item.amount),
          reference: item.reference,
          type: item.type,
          method: item.method,
          period_year: entryDate.getFullYear(),
          period_month: entryDate.getMonth() + 1,
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
    this.setState({ data, searchPersonText: "", searchPersonTextType: "" });
  };

  handleSearchConcept = async (value) => {
    this.setState({ clearSearchConcept: value });
  };

  handleSearchPerson = async (value) => {
    this.setState({ clearSearchPerson: value });
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
                <div className="col-6">
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
                {/* <div>
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
                </div> */}

                <div className="col-2 col-md-3 col-sm-3">
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
                    />
                  </div>
                </div>
              </div>

              <div
                className="row bg-secondary text-light mt-2 mb-2 pt-1 pb-1"
                id="divDiezmo"
              >
                <div className="col-6">
                  <SearchPerson
                    onSelect={this.handleSelectPerson}
                    onTyping={this.handleTypingPerson}
                    onClearSearchPerson={this.handleSearchPerson}
                    clearSearchPerson={this.state.clearSearchPerson}
                    value={this.state.searchPersonText}
                    data={this.state.people}
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
                        title="Limpiar filtro de miembro"
                        onClick={this.handleCleanPerson}
                      ></span>
                    </div>
                  )}
                </div>

                <div className="col-2 col-md-3 col-sm-3">
                  {this.renderInput(
                    "note",
                    "Monto",
                    "text",
                    "",
                    "Monto del Diezmo"
                  )}
                </div>
                <div className="col-2 col-md-3 col-sm-3">
                  <button
                    type="button"
                    className="btn btn-light text-black btn-sm"
                    style={{ marginTop: "2.3em", marginLeft: "-25px" }}
                    onClick={this.handleAddDetailDiezmo}
                    disabled={
                      this.state.searchPersonTextType.length === 0 &&
                      this.state.data.note.length === 0
                    }
                  >
                    Agregar Diezmo
                  </button>
                </div>
              </div>

              <div className="row mr-0 ml-0 pr-0 pl-0">
                <div className="col-4 mr-0 ml-0 pr-0 pl-0" id="divDetail">
                  <SearchConcept
                    onSelect={this.handleSelectConcept}
                    onClearSearchConcept={this.handleSearchConcept}
                    clearSearchConcept={this.state.clearSearchConcept}
                    value={this.state.searchConceptText}
                    data={this.state.concepts}
                    selectedItem={this.state.currentConcept}
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
                <div className="col-1 mr-0 ml-0 pr-0 pl-0 hidden-on-small">
                  <Select
                    name="method"
                    value={this.state.line.method}
                    label="Metodo"
                    options={this.state.methods}
                    onChange={this.handleChangeEntryLine}
                    error={null}
                  />
                </div>
                {/* <div className="col-1 mr-0 ml-0 pr-0 pl-0">
                  <Select
                    name="period_month"
                    value={this.state.line.period_month}
                    label="Mes"
                    options={this.state.months}
                    onChange={this.handleChangeEntryLine}
                    error={null}
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
                </div> */}
                <div className="col-2 mr-0 ml-0 pr-0 pl-0">
                  <Input
                    type="text"
                    name="reference"
                    value={this.state.line.reference}
                    label="Referencia"
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
                    style={{ minWidth: "120px" }}
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
                  totalEntradas={this.state.totalEntradas}
                  totalSalidas={this.state.totalSalidas}
                  totalDiezmos={this.state.totalDiezmos}
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

          {/* <div className="d-flex justify-content-end w-100 pr-3 mb-3">
            {this.state.data.id > 0 &&
              (role === "Admin" || role === "Owner") && (
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
          </div> */}
        </div>
      </React.Fragment>
    );
  }
}

export default EntryForm;
