import React, { Component } from "react";
import PersonForm from "../forms/personForm";

class PersonModal extends Component {
  handleClosePopUp = e => {
    this.props.setNewPerson(e);
    this.closeButton.click();
  };

  render() {
    return (
      <div
        className="modal fade col-12"
        id="personModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="personModalLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="personModalLabel">
                Agregar nueva iglesia
              </h5>
              <button
                ref={button => (this.closeButton = button)}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <PersonForm popUp={true} closeMe={this.handleClosePopUp} />
          </div>
        </div>
      </div>
    );
  }
}

export default PersonModal;
