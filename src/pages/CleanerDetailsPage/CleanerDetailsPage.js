import React, {useEffect, useState} from "react";
import {useLocation, useHistory} from 'react-router-dom';
import {IconButton, Paper, Table, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import {getAssignedRooms, getCleaner, getReports, unAssignRoom, deleteCleaner as removeCleaner} from "../../utils/api";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {AccountCircleRounded, Clear, DeleteForever, Edit} from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import PageContainer from "../../containers/PageContainer";
import Tooltip from "@material-ui/core/Tooltip";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import {getRoomTypeProp} from "../../utils/utils";
import CleaningReportsTable from "../../components/CleaningReportsTable";
import styles from './CleanerDetailsPage.module.scss';
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import EditCleanerDialog from "./EditCleanerDialog";

const CleanerDetailsPage = () => {
  const location = useLocation();
  const history = useHistory();
  const params = location.state;
  const [cleanerLoaded, setCleanerLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [cleaner, setCleaner] = useState({});
  const [reports, setReports] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [data, getData] = React.useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackText, setSnackText] = useState('Cleaned deleted');

  const handleConfirmClose = () => {
    setOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteCleaner = async () => {
    await removeCleaner(cleaner['_id']);
    setSnackText('Cleaner Deleted');
    setSnackOpen(true);
    history.goBack();
  }

  const saved = () => {
    setSnackText('Saved');
    setSnackOpen(true);
    getData(true);
  }
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  useEffect(() => {
    getCleaner(params.id)
      .then((room) => {
          console.log(room);
          setCleaner(room);
          setCleanerLoaded(true);
        },
        (error) => {
          console.log(error);
        });
    getReports(null, params.id)
      .then((reports) => {
        setReports(reports.sort((a, b) => new Date(b['cleaning_time']) - new Date(a['cleaning_time'])));
      })
  }, [params.id, data]);

  return (
    <PageContainer style={{textAlign: 'start'}}>
      <div className={styles.row} style={{justifyContent: 'space-between'}}>
        <Typography variant={"h5"} className={styles.semiBold}>Cleaner details</Typography>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          Actions
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => {
            handleClose();
            setEditing(true);
          }}>
            <ListItemIcon>
              <Edit fontSize="small" style={{color: '#808080'}}/>
            </ListItemIcon>
            <ListItemText primary="Edit cleaner"/>
          </MenuItem>
          <MenuItem onClick={() => {
            setOpen(true);
            handleClose()
          }}>
            <ListItemIcon>
              <DeleteForever color={"error"} fontSize="small"/>
            </ListItemIcon>
            <ListItemText primary="Delete cleaner"/>
          </MenuItem>
        </Menu>
      </div>
      {cleanerLoaded ? (
        <>
          <div className={[styles.row, styles.content].join(' ')}>
            <AccountCircleRounded className={styles.avatar}/>
            <div>
              <Typography variant={"h6"} className={styles.semiBold}>Cleaner name: {cleaner.name}</Typography>
              <Typography variant={"body1"} color={"textSecondary"}>
                Shift: {cleaner['shift_start']} - {cleaner['shift_end']}
              </Typography>
            </div>
          </div>
          <AssignmentsTable cleaner={cleaner}/>
          <CleaningReportsTable reports={reports} type={"cleaner"}/>
        </>
      ) : <CircularProgress color="secondary" style={{margin: '16px auto'}}/>}
      <Dialog
        open={open}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete cleaner"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the cleaner?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            handleConfirmClose();
            deleteCleaner();
          }} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {cleanerLoaded &&
      <EditCleanerDialog cleaner={cleaner} open={editing} setOpen={setEditing} onSave={saved}/>}
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}
                anchorOrigin={{vertical: "top", horizontal: "center"}}>
        <Alert variant={"filled"} severity="success" onClose={handleSnackClose}>
          {snackText}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}

const AssignmentsTable = ({cleaner}) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAssignedRooms(cleaner['_id'])
      .then((assignments) => {
        console.log(assignments);
        setAssignments(assignments);
        setLoading(false);
      }, (error) => {
        console.log(error);
      })
  }, [cleaner]);

  const removeAssignment = async (room) => {
    const response = await unAssignRoom(room['_id'], cleaner['_id']);
    console.log(response);
    const newAssignments = [...assignments];
    newAssignments.splice(assignments.indexOf(room), 1);
    setAssignments(newAssignments);
    setOpen(true);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    loading ? <CircularProgress color="secondary"/> :
      <TableContainer component={Paper}>
        <Table size={"small"}>
          <TableHead>
            <TableRow>
              <TableCell>Room</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Contamination Index</TableCell>
              <TableCell align="right">Room type</TableCell>
              <TableCell align="right">Cleaning Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((row) => (
              <TableRow key={row['_id']}>
                <TableCell component="th" scope="row">{row.name}</TableCell>
                <TableCell align="right">{}</TableCell>
                <TableCell align="right">{row['contamination_index']}</TableCell>
                <TableCell align="right">{getRoomTypeProp(row, 'displayName')}</TableCell>
                <TableCell align="right">{row['is_cleaning'] ? 'Cleaning in progress' : 'Needs cleaning'}</TableCell>
                <TableCell>
                  <Tooltip title={"Remove assignment"}>
                    <IconButton size={"small"} onClick={() => {
                      removeAssignment(row);
                    }}>
                      <Clear color={"error"}/>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
                  anchorOrigin={{vertical: "top", horizontal: "center"}}>
          <Alert variant={"filled"} severity="success" onClose={handleClose}>
            Assignment removed
          </Alert>
        </Snackbar>
      </TableContainer>
  );
}

export default CleanerDetailsPage;