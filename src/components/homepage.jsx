import React, { Component } from "react";

class HomePage extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="d-flex justify-content-center">
          <h2>Concilio Evangelico Pentecostal <strong>Arca de Salvación</strong>, INC.</h2>
        </div>
        <div className="d-flex justify-content-center">
          <img
            style={{ width: "40%", padding: "5px", margin: "0" }}
            src={process.env.PUBLIC_URL + "/images/logoEmanuel.jpg"}
            alt="CEPAS"
          />
        </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
