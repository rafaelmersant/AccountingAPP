import React, { Component } from "react";

class HomePage extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="d-flex justify-content-center">
          <h2>Concilio Evangelico Pentecostal <strong>Arca de Salvación</strong>, INC.</h2>
        </div>
        <div className="d-flex justify-content-center">
          <h2 className="text-success">Brisa del Este I</h2>
        </div>
        <div className="d-flex justify-content-center">
          <img
            style={{ width: "30%", padding: "5px", margin: "0" }}
            src={process.env.PUBLIC_URL + "/images/logocepasH50_small.png"}
            alt="CEPAS"
          />


        </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
