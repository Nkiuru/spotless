import React, {useState} from 'react';
import {AppBar, Typography, Tabs, Toolbar as MaterialToolbar, Tab} from "@material-ui/core";
import {Link, useLocation} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import styles from './Toolbar.module.scss';

const NavTabs = withStyles({
  root: {
    width: '100%',
    flexGrow: 1,
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: 'orange',
    },
  }
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const Toolbar = () => {
  const location = useLocation();
  return (
    <AppBar position={"static"}>
      <MaterialToolbar variant={"dense"}>
        <Typography variant={"h6"} className={styles.toolbar}>Spotless</Typography>
        <NavTabs variant={"fullWidth"} value={location.pathname}>
          <Tab label={"Dashboard"} value={"/dashboard"} component={Link} to={"/dashboard"} disableRipple={true}/>
          <Tab label={"Assignments"} value={"/assignments"} component={Link} to={"/assignments"} disableRipple={true}/>
          <Tab label={"Cleaners"} value={"/cleaners"} component={Link} to={"/cleaners"} disableRipple={true}/>
          <Tab label={"Analysis"} value={"/analysis"} component={Link} to={"/analysis"} disableRipple={true}/>
          <Tab label={"Rooms"} value={"/rooms"} component={Link} to={"/rooms"} disableRipple={true}/>
        </NavTabs>
      </MaterialToolbar>
    </AppBar>
  );
}

export default Toolbar;