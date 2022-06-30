import React from "react";
import { NavLink } from "react-router-dom";

const NavBarSide = ({ user }) => {
  return (
    <div className="border-right" id="sidebar-wrapper">
      <div className="sidebar-heading text-center mb-3">
        <NavLink className="" to="/home">
          <img
            style={{ width: "100px", padding: "5px", margin: "0" }}
            src={process.env.PUBLIC_URL + "/images/logocepasH50_small.png"}
            alt="CEPAS"
          />
        </NavLink>
      </div>
      <div className="list-group list-group-flush">
        <React.Fragment>
          {user &&
            (user.role === "Admin" ||
              user.role === "Owner" ||
              user.role === "Level1") && (
              <div>
                <NavLink
                  className="list-group-item list-group-item-action border-none"
                  to="/Registros"
                >
                  <span className="fa fa-money mr-2 color-local" />
                  Registros
                </NavLink>

                <NavLink
                  className="list-group-item list-group-item-action border-none"
                  to="/conceptos"
                >
                  <span className="fa fa-book mr-2 color-local" />
                  Conceptos
                </NavLink>

                <NavLink
                  className="list-group-item list-group-item-action border-none"
                  to="/cuadre"
                >
                  <span className="fa fa-book mr-2 color-local" />
                  Cuadre (reporte)
                </NavLink>

                <NavLink
                  className="list-group-item list-group-item-action border-none"
                  to="/iglesias"
                >
                  <span className="fa fa-home mr-2 color-local" />
                  Iglesias
                </NavLink>
              </div>
            )}

          {user &&
            (user.role === "Admin" ||
              user.role === "Owner" ||
              user.role === "Level1" ||
              user.role === "Obrero") && (
              <div>
                <NavLink
                  className="list-group-item list-group-item-action border-none"
                  to="/obreros"
                >
                  <span className="fa fa-users mr-2 color-local" />
                  Obreros
                </NavLink>
              </div>
            )}
        </React.Fragment>

        {/* {user &&
          (user.role === "Admin" ||
            user.role === "Owner") && (
            <React.Fragment>
              <NavLink
                className="list-group-item list-group-item-action border-none"
                to="/invoices"
              >
                <span className="fa fa-list mr-2 color-local" />
                Dashboard Tesorería
              </NavLink>
            </React.Fragment>
          )} */}
      </div>
    </div>
  );
};

export default NavBarSide;
