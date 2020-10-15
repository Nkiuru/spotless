import React from 'react';
import {AppBar, Typography, Tabs, Toolbar as MaterialToolbar, Tab} from "@material-ui/core";
import {Link, useLocation, matchPath} from 'react-router-dom';
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
})((props) => <Tabs {...props} TabIndicatorProps={{children: <span/>}}/>);

const mountTabValueFactory = (location, tabId) => (route) => !!matchPath(location.pathname, {
  path: route,
  exact: false,
  strict: false,
}) ? tabId : -1;

const Toolbar = () => {
  const location = useLocation();
  const tabId = 'myTabId';
  const getTabValue = mountTabValueFactory(location, tabId);

  return (
    <AppBar position={"static"}>
      <MaterialToolbar variant={"dense"}>
        <Typography variant={"h6"} className={styles.toolbar}>Spotless</Typography>
        <NavTabs variant={"fullWidth"} value={tabId}>
          <Tab label={"Dashboard"} value={getTabValue("/dashboard")} component={Link} to={"/dashboard"}
               disableRipple={true} className={styles.tab}/>
          <Tab label={"Assignments"} value={getTabValue("/assignments")} component={Link} to={"/assignments"}
               disableRipple={true} className={styles.tab}/>
          <Tab label={"Cleaners"} value={getTabValue("/cleaners")} component={Link} to={"/cleaners"}
               disableRipple={true} className={styles.tab}/>
          <Tab label={"Rooms"} value={getTabValue("/rooms")} component={Link} to={"/rooms"} disableRipple={true}/>
          <Tab label={"Analysis"} value={getTabValue("/analysis")} component={Link} to={"/analysis"}
               disableRipple={true} className={styles.tab}/>
        </NavTabs>
      </MaterialToolbar>
    </AppBar>
  );
}

export default Toolbar;