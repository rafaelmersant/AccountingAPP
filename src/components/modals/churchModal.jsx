import React, { Component } from "react";
import ChurchForm from "../forms/churchForm";

class ChurchModal extends Component {
  handleClosePopUp = e => {
    this.props.setNewChurch(e);
    this.closeButton.click();
  };

  render() {
    return (
      <div
        className="modal fade col-12"
        id="churchModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="churchModalLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="churchModalLabel">
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

            <ChurchForm popUp={true} closeMe={this.handleClosePopUp} />
          </div>
        </div>
      </div>
    );
  }
}

export default ChurchModal;