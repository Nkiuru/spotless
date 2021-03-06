import React from 'react';
import './App.scss';
import {Route, Switch, Redirect} from "react-router-dom";
import {authenticated as auth, getUser} from '../utils/api';
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import CleanersPage from "../pages/CleanersPage";
import Toolbar from "../components/Toolbar";
import {useLocation} from 'react-router-dom';
import AnalysisPage from "../pages/AnalysisPage";
import RoomsPage from "../pages/RoomsPage";
import AssignmentsPage from "../pages/AssignmentsPage";
import RoomDetailsPage from "../pages/RoomDetailsPage";
import CleanerDetailsPage from "../pages/CleanerDetailsPage";
import ReportPage from "../pages/ReportPage";
import AdminPage from "../pages/AdminPage";

function App() {
  const location = useLocation();
  const user = getUser();
  const login = () => (auth() ? <Redirect to="/dashboard"/> : <LoginPage/>);
  const dash = () => (!auth() ? <Redirect to="/"/> : <DashboardPage/>);
  const cleaner = () => (!auth() ? <Redirect to="/"/> : <CleanerDetailsPage/>);
  const cleaners = () => (!auth() ? <Redirect to="/"/> : <CleanersPage/>);
  const assignments = () => (!auth() ? <Redirect to="/"/> : <AssignmentsPage/>);
  const rooms = () => (!auth() ? <Redirect to="/"/> : <RoomsPage/>);
  const room = () => (!auth() ? <Redirect to="/"/> : <RoomDetailsPage/>);
  const analysis = () => (!auth() ? <Redirect to="/"/> : <AnalysisPage/>);
  const report = () => (!auth() ? <Redirect to="/"/> : <ReportPage/>);
  const admin = () => (!auth() || !user.superAdmin ? <Redirect to="/"/> : <AdminPage/>);

  return (
    <div className="App">
      {location.pathname !== '/' && <Toolbar/>}
      <Switch location={location}>
        <Route path={"/dashboard"} render={dash}/>
        <Route path={"/cleaners/:id"} render={cleaner}/>
        <Route path={"/cleaners"} render={cleaners}/>
        <Route path={"/assignments"} render={assignments}/>
        <Route path={"/rooms/reports/:id"} render={report}/>
        <Route path={"/rooms/:id"} render={room}/>
        <Route path={"/rooms"} render={rooms}/>
        <Route path={"/analysis"} render={analysis}/>
        <Route path={"/simulator"} render={admin}/>
        <Route path={"/"} render={login}/>
      </Switch>
    </div>
  );
}

export default App;
