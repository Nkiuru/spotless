import React, {useEffect, useState} from 'react';
import {AppBar, Typography, Tabs, Toolbar as MaterialToolbar, Tab, IconButton, Icon} from "@material-ui/core";
import {Link, useLocation, matchPath, useHistory} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import styles from './Toolbar.module.scss';
import {
  ArrowBackRounded, AssessmentRounded,
  BusinessRounded,
  DashboardRounded, ExitToApp,
  FormatListBulletedRounded, Info,
  PeopleRounded, Settings
} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import {getUser, logout} from "../../utils/api";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from '@material-ui/icons/Menu';
import logo from "../../assets/logo.png";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import PageContainer from "../../containers/PageContainer";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState('');
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const u = getUser();
    setUser(u);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <Typography variant={"h6"} className={styles.name}
                      style={{display: "flex", flexDirection: 'row', width: '100%'}}>
            <Icon style={{width: 36}}><img src={logo} alt="logo" className={styles.logo}/></Icon>
            Spotless
          </Typography>
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
        <Tooltip title={"Open menu"}>
          <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            <MenuIcon color={"secondary"}/>
          </IconButton>
        </Tooltip>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {user.superAdmin &&
          <MenuItem onClick={() => {
            handleClose();
            history.push('/simulator');
          }}>
            <ListItemIcon>
              <Settings fontSize="small" style={{color: '#808080'}}/>
            </ListItemIcon>
            <ListItemText primary="Simulator"/>
          </MenuItem>}
          <MenuItem onClick={() => {
            setOpen(true);
            handleClose();
          }}>
            <ListItemIcon>
              <Info fontSize="small"/>
            </ListItemIcon>
            <ListItemText primary="About"/>
          </MenuItem>
          <MenuItem onClick={() => {
            handleClose();
            logout();
            history.push('/');
          }}>
            <ListItemIcon>
              <ExitToApp color={"secondary"} fontSize="small"/>
            </ListItemIcon>
            <ListItemText primary="Sign out"/>
          </MenuItem>

        </Menu>
        <AboutDialog open={open} setOpen={setOpen}/>
      </MaterialToolbar>
    </AppBar>
  );
}

const AboutDialog = ({open, setOpen}) => {

  const handleConfirmClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleConfirmClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"About the app"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" color="textPrimary">
          <p>
            The LeViteZer hospital room cleaning optimization solution aims to reduce hospital infection risk by
            optimizing the hospital room cleaning. The contamination of the rooms is tracked real time and the cleaning
            prioritized based on need.
          </p>

          <p>
            Realtime data of space usage is visualized in the Cleaner application. On top of a room layout the most used
            areas are visualized to provide the cleaner with simple and intuitive information on areas that need the
            most attention. The application also track the cleaning event to make sure all areas has been cleaned and
            then automatically generate a report with minimal interaction by cleaner. The guiding line on the design has
            been to keep it simple, provide only useful information and assist on making the cleaning report.
          </p>

          <p>
            The Management application supports efficient resource management and planning in case of changes in
            staffing or reallocation of time and resources. Furthermore, It displays data from the hospital in real time
            and offers tools to verify & track cleaning efficiency. The application also presents detailed information
            about rooms and their generated cleaning reports.
          </p>

          <p>
            Spotless is working name for the applications. The status of the applications is for demonstration purpose
            and for this purpose there is also a simple hospital contamination simulator as we currently only have few
            locations equipped with the sensors. LeViteZer supports the use of the demonstrator. Comments and
            improvement proposals are most welcome
            <address>
              <a href="mailto:kim.janson@levitezer.com">kim.janson@levitezer.com</a>
            </address>
          </p>

          <p>
            The Spotless management and cleaners applications have been developed in Metropolia University of Applied
            Sciences, innovation project supervised and supported by LeViteZer and in co-operation with Sodexo.
          </p>

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          handleConfirmClose();
        }} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Toolbar;