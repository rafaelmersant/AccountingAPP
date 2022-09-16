import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "./components/notFound";
import LoginForm from "./components/forms/loginForm";
import Logout from "./components/logout";

// Administration and settings
import Users from "./components/users";
import UserForm from "./components/forms/userForm";

import ProtectedRoute from "./components/common/protectedRoute";
import auth from "./services/authService";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./simple-sidebar.css";

import NavBarSide from "./components/navBarSide";
import NavBarTop from "./components/navBarTop";
import HomePage from "./components/homepage";

import ConceptForm from "./components/forms/conceptForm";
import Concepts from "./components/concepts";
import Churchs from "./components/churches";
import ChurchForm from "./components/forms/churchForm";
import People from "./components/people";
import PersonForm from "./components/forms/personForm";
import Entries from "./components/entries";
import EntryForm from "./components/forms/entryForm";
import Cuadre from "./components/reports/cuadre";
import Dashboard from "./components/reports/dashboard";
import ChurchesPayment from "./components/reports/churchesPayment";
import DetailedByConcept from "./components/reports/detailedByConcept";

class App extends Component {
  state = {
    user: {},
  };

  componentDidMount() {
    try {
      const user = auth.getCurrentUser();

      this.setState({ user });
    } catch (ex) {
      if (window.location.pathname !== "/login")
        window.location.replace("/login");
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        {/* <NavBar user={this.state.user} /> */}
        <div className="d-flex" id="wrapper">
          <NavBarSide user={this.state.user} />

          <div id="page-content-wrapper">
            <NavBarTop user={this.state.user} />

            <div className="container-fluid">
              <main>
                <Switch>
                  <Route path="/login" component={LoginForm} />
                  <Route path="/logout" component={Logout} />
                  
                  <ProtectedRoute path="/cuadre" component={Cuadre} />
                  <ProtectedRoute path="/dashboard" component={Dashboard} />
                  <ProtectedRoute path="/detallado-por-concepto" component={DetailedByConcept} />
                  <ProtectedRoute path="/pago-de-iglesias" component={ChurchesPayment} />

                  <ProtectedRoute path="/conceptos" component={Concepts} />
                  <ProtectedRoute path="/concepto/:id" component={ConceptForm} />

                  <ProtectedRoute path="/iglesias" component={Churchs} />
                  <ProtectedRoute path="/iglesia/:id" component={ChurchForm} />

                  <ProtectedRoute path="/registros" component={Entries} />
                  <ProtectedRoute path="/registro/:id" component={EntryForm} />

                  <ProtectedRoute path="/obreros" component={People} />
                  <ProtectedRoute
                    path="/obrero/:id"
                    component={PersonForm}
                  />
                  
                  <ProtectedRoute path="/users" component={Users} />
                  <ProtectedRoute path="/user/:id" component={UserForm} />
                  <ProtectedRoute path="/home" component={HomePage} />
                  <Redirect exact from="/" to="/home" />
                  <Route path="/not-found" component={NotFound} />
                  <Redirect to="/not-found" />
                </Switch>
              </main>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
