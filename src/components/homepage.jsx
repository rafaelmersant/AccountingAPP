import React, { Component } from "react";

class HomePage extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="d-flex justify-content-center">
          <h2>Colegio Evangélico Arca de Salvación <strong>YIREH</strong></h2>
        </div>
        <div className="d-flex justify-content-center">
          <img
            style={{ width: "40%", padding: "5px", margin: "0" }}
            src={process.env.PUBLIC_URL + "/images/yireh_logo.jpeg"}
            alt="CEPAS"
          />
        </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
