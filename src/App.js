import React, { useState } from "react";
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import { history } from "./history";

import LoginForm from "./view/LoginForm"
import HomePage from "./view/HomePage";
import Appointment from "./view/Appointment";
import StartAppointment from "./view/StartAppointment"
import NewSession from "./view/NewSession";
import "./dist/css/app.css"

function App() {


  return (
    <div className="App" className="layout-height">
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={(props) => <LoginForm  {...props} />} />
          <Route path="/home" component={(props) => <HomePage  {...props} />} />
          <Route path="/appointment" component={(props) => <Appointment  {...props} />} />
          <Route path="/newsession" component={(props) => <NewSession  {...props} />} />
          <Route path="/startappointment" component={(props) => <StartAppointment  {...props} />} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </div>
  )

}

export default App;
