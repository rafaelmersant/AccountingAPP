import React, { Component } from "react";
import ConceptForm from "../forms/conceptForm";

class ConceptModal extends Component {
  handleClosePopUp = e => {
    this.props.setNewConcept(e);
    this.closeButton.click();
  };

  render() {
    return (
      <div
        className="modal fade col-12"
        id="conceptModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="conceptModalLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="conceptModalLabel">
                Agregar nuevo concepto
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

            <ConceptForm popUp={true} closeMe={this.handleClosePopUp} />
          </div>
        </div>
      </div>
    );
  }
}

export default ConceptModal;
