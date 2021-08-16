import React, { useState } from "react";
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import { history } from "./history";

import LoginForm from "./view/LoginForm"
import HomePage from "./view/HomePage";
import Appointment from "./view/Appointment";
import StartAppointment from "./view/StartAppointment"
import NewSession from "./view/NewSession";
import Register from "./view/Register";
import MyAppointment from "./view/MyAppoinment";
import "./dist/css/app.css"

function App() {


  return (
    <div className="App" className="layout-height">
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={(props) => <LoginForm  {...props} />} />
          <Route path="/home" component={(props) => <HomePage  {...props} />} />
          <Route path="/appointment" component={(props) => <Appointment  {...props} />} />
          <Route path="/mysession" component={(props) => <NewSession  {...props} />} />
          <Route path="/startappointment" component={(props) => <StartAppointment  {...props} />} />
          <Route path="/register" component={(props) => <Register  {...props} />} />
          <Route path="/myappointment" component={(props) => <MyAppointment  {...props} />} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </div>
  )

}

export default App;
