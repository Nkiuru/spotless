import React, {useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import {IconButton, Paper, Table, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import {getAssignedRooms, getCleaner, getReports, unAssignRoom} from "../../utils/api";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Clear} from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import PageContainer from "../../containers/PageContainer";
import Tooltip from "@material-ui/core/Tooltip";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import {getRoomTypeProp} from "../../utils/utils";
import CleaningReportsTable from "../../components/CleaningReportsTable";
import styles from './CleanerDetailsPage.module.scss';

const CleanerDetailsPage = () => {
  const location = useLocation();
  const params = location.state;
  const [cleanerLoaded, setCleanerLoaded] = useState(false);
  const [cleaner, setCleaner] = useState({});
  const [reports, setReports] = useState([]);

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
  }, [params.id]);

  return (
    <PageContainer style={{textAlign: 'start'}}>
      <Typography variant={"h5"}>Cleaner details</Typography>
      {cleanerLoaded ? (
        <>
          <Typography>Cleaner name: {cleaner.name}</Typography>
          <AssignmentsTable cleaner={cleaner}/>
          <CleaningReportsTable reports={reports} type={"cleaner"}/>
        </>
      ) : <CircularProgress color="secondary" style={{margin: '16px auto'}}/>}
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