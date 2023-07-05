import React from "react";
import { NavLink } from "react-router-dom";

const NavBarSide = ({ user }) => {
  return (
    <div className="border-right" id="sidebar-wrapper">
      <div className="sidebar-heading text-center mb-3">
        <NavLink className="" to="/home">
          <img
            style={{ width: "65px", padding: "5px", margin: "0" }}
            src={process.env.PUBLIC_URL + "/images/raisi_logo.jpeg"}
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

                {/* <NavLink
                  className="list-group-item list-group-item-action border-none"
                  to="/cuadre"
                >
                  <span className="fa fa-book mr-2 color-local" />
                  Cuadre (reporte)
                </NavLink> */}

                {/* <NavLink
                  className="list-group-item list-group-item-action border-none"
                  to="/dashboard"
                >
                  <span className="fa fa-book mr-2 color-local" />
                  Dashboard
                </NavLink> */}

                <NavLink
                  className="list-group-item list-group-item-action border-none"
                  to="/detallado-por-concepto"
                >
                  <span className="fa fa-book mr-2 color-local" />
                  Reporte detallado
                </NavLink>

                <NavLink
                  className="list-group-item list-group-item-action border-none"
                  to="/cursos"
                >
                  <span className="fa fa-home mr-2 color-local" />
                  Cursos
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
                  to="/estudiantes"
                >
                  <span className="fa fa-users mr-2 color-local" />
                  Estudiantes
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
