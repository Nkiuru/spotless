import React from 'react';
import './App.scss';
import {Route, Switch, Redirect} from "react-router-dom";
import {authenticated as auth} from '../utils/api';
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import CleanersPage from "../pages/CleanersPage";
//import PageContainer from "../containers/PageContainer";
import Toolbar from "../components/Toolbar";
import {useLocation} from 'react-router-dom';
import AnalysisPage from "../pages/AnalysisPage";
import RoomsPage from "../pages/RoomsPage";
import AssignmentsPage from "../pages/AssignmentsPage";
import RoomDetailsPage from "../pages/RoomDetailsPage";

function App() {
  const location = useLocation();
  const login = () => (auth() ? <Redirect to="/dashboard"/> : <LoginPage/>);
  const dash = () => (!auth() ? <Redirect to="/"/> : <DashboardPage/>);
  const cleaners = () => (!auth() ? <Redirect to="/"/> : <CleanersPage/>);
  const assignments = () => (!auth() ? <Redirect to="/"/> : <AssignmentsPage/>);
  const rooms = () => (!auth() ? <Redirect to="/"/> : <RoomsPage/>);
  const room = () => (!auth() ? <Redirect to="/"/> : <RoomDetailsPage/>);
  const analysis = () => (!auth() ? <Redirect to="/"/> : <AnalysisPage/>);

  return (
    <div className="App">
      <Toolbar/>
      <Switch>
        <Route path={"/dashboard"} render={dash}/>
        <Route path={"/cleaners"} render={cleaners}/>
        <Route path={"/assignments"} render={assignments}/>
        <Route path={"/rooms/:id"} render={room}/>
        <Route path={"/rooms"} render={rooms}/>
        <Route path={"/analysis"} render={analysis}/>
        <Route path={"/"} render={login}/>
      </Switch>
    </div>
  );
}

export default App;
