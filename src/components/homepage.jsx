import React, { Component } from "react";

class HomePage extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="d-flex justify-content-center">
          <h2>Clínica Dental <strong>Dra. Raisi Valdez</strong></h2>
        </div>
        <div className="d-flex justify-content-center">
          <img
            style={{ width: "40%", padding: "5px", margin: "0" }}
            src={process.env.PUBLIC_URL + "/images/raisi_logo.jpeg"}
            alt="DENTAL"
          />
        </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
