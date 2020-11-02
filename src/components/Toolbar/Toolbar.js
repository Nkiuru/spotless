import React from 'react';
import {AppBar, Typography, Tabs, Toolbar as MaterialToolbar, Tab, IconButton} from "@material-ui/core";
import {Link, useLocation, matchPath, useHistory} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import styles from './Toolbar.module.scss';
import {
  ArrowBackRounded, AssessmentRounded,
  BusinessRounded,
  DashboardRounded, ExitToApp,
  FormatListBulletedRounded,
  PeopleRounded
} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import {logout} from "../../utils/api";

const NavTabs = withStyles({
  root: {
    width: '100%',
    flexGrow: 1
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: '4px',
    '& > span': {
      width: '40%',
      backgroundColor: '#00b0ff',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
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
  const history = useHistory();
  const tabId = 'myTabId';
  const getTabValue = mountTabValueFactory(location, tabId);

  return (
    <AppBar position={"static"}>
      <MaterialToolbar variant={"dense"}>
        <div className={styles.toolbar}>
          {location.pathname.split('/').length > 2 ? (
            <Tooltip title={'Go Back'}>
              <IconButton onClick={() => {
                history.goBack()
              }}>
                <ArrowBackRounded className={styles.svg}/>
              </IconButton>
            </Tooltip>
          ) : <div style={{width: 40}}/>}
          <Typography variant={"h6"} className={styles.name}>Spotless</Typography>
        </div>
        <NavTabs variant={"fullWidth"} value={tabId}>
          <Tab label={<div className={styles.tab}><DashboardRounded fontSize={"small"}/> Dashboard</div>}
               value={getTabValue("/dashboard")} component={Link} to={"/dashboard"}
               disableRipple={true}/>
          <Tab label={<div className={styles.tab}><FormatListBulletedRounded fontSize={"small"}/> Assignments</div>}
               value={getTabValue("/assignments")} component={Link} to={"/assignments"}
               disableRipple={true} className={styles.tab}/>
          <Tab label={<div className={styles.tab}><PeopleRounded fontSize={"small"}/> Cleaners</div>}
               value={getTabValue("/cleaners")} component={Link} to={"/cleaners"}
               disableRipple={true} className={styles.tab}/>
          <Tab label={<div className={styles.tab}><BusinessRounded fontSize={"small"}/> Rooms</div>}
               value={getTabValue("/rooms")} component={Link} to={"/rooms"} disableRipple={true}/>
          <Tab label={<div className={styles.tab}><AssessmentRounded fontSize={"small"}/> Analysis</div>}
               value={getTabValue("/analysis")} component={Link} to={"/analysis"}
               disableRipple={true} className={styles.tab}/>
        </NavTabs>
        <Tooltip title={'Sign out'} color={"secondary"}>
          <IconButton onClick={() => {
            logout();
            history.push('/');
          }}>
            <ExitToApp/>
          </IconButton>
        </Tooltip>
      </MaterialToolbar>
    </AppBar>
  );
}

export default Toolbar;