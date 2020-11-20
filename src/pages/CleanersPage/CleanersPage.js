import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableContainer,
  TableRow,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions, TablePagination,
} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {AddCircleOutline, VisibilityOutlined} from "@material-ui/icons";
import {createCleaner, getCleaners, getRooms} from "../../utils/api";
import styles from './CleanersPage.module.scss';
import * as Yup from "yup";
import {Formik, Form, Field} from "formik";
import {TextField} from "formik-material-ui";
import PageContainer from "../../containers/PageContainer";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import ShiftPicker from "../../components/ShiftPicker/ShiftPicker";
import moment from "moment";
import EnhancedTableHead from "../../components/RoomSelector/EnhancedTableHead";
import {makeStyles} from "@material-ui/core/styles";
import {getComparator, stableSort} from "../../utils/tableUtils";

const CleanersPage = () => {
  const [cleaners, setCleaners] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    Promise.all([getCleaners(), getRooms(null, null, true)])
      .then((responses) => {
        setCleaners(responses[0]);
        setRooms(responses[1]);
        setIsLoaded(true);
      }, (err) => {
        console.log(err);
      });
  }, [setOpen, isLoaded])

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <PageContainer style={{textAlign: 'start'}}>
      <div className={styles.headerRow}>
        <Typography variant={"h5"} className={styles.bold}>Cleaners</Typography>
        <Tooltip title="Add cleaner">
          <IconButton onClick={() => setOpen(true)}>
            <AddCircleOutline/>
          </IconButton>
        </Tooltip>
      </div>
      {isLoaded ? <CleanersTable cleaners={cleaners} rooms={rooms}/> :
        <CircularProgress color="secondary" style={{margin: '16px auto'}}/>}
      <AddCleanerDialog open={open} setOpen={setOpen} setIsLoaded={setIsLoaded} setSnackOpen={setSnackOpen}/>
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}
                anchorOrigin={{vertical: "top", horizontal: "center"}}>
        <Alert variant={"filled"} severity="success" onClose={handleSnackClose}>
          Cleaner created
        </Alert>
      </Snackbar>
    </PageContainer>
  )
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required')
});

const AddCleanerDialog = ({open, setOpen, setIsLoaded, setSnackOpen}) => {
  const handleClose = () => {
    setOpen(false);
  }

  const initialValues = {
    firstName: '',
    lastName: '',
    startHour: '08',
    endHour: '16',
    startMinutes: '00',
    endMinutes: '00'
  }

  const handleSubmit = async (vars, {setSubmitting}) => {
    const cleaner = await createCleaner(`${vars.firstName} ${vars.lastName}`,
      `${vars.startHour.padStart(2, '0')}:${vars.startMinutes.padStart(2, '0')}`,
      `${vars.endHour.padStart(2, '0')}:${vars.endMinutes.padStart(2, '0')}`);
    console.log(cleaner);
    setIsLoaded(false);
    setSubmitting(false);
    setSnackOpen(true);
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create a new cleaner</DialogTitle>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {({isSubmitting, resetForm, values}) => (
          <Form>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Field
                    component={TextField}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="First name"
                    type="text"
                    name="firstName"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    component={TextField}
                    margin="dense"
                    id="name"
                    label="Last name"
                    type="text"
                    name="lastName"
                    fullWidth
                  />
                </Grid>
                <ShiftPicker/>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Create cleaner
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const CleanersTable = ({cleaners, rooms}) => {
  const history = useHistory();
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [cleanersPerPage, setCleanersPerPage] = React.useState(15);

  const viewCleaner = (cleaner) => {
    const id = cleaner['_id'];
    history.push({
      pathname: `/cleaners/${id}`,
      state: {id}
    })
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setCleanersPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getCleaningProgress = (cleaner) => {
    const assignedRooms = rooms.filter((room) => {
      return room['assigned_cleaners'].length > 0 && room['assigned_cleaners'][0]['_id'] === cleaner['_id'];
    });
    const today = moment();
    const numCleaned = assignedRooms.filter((room) => {
      if (!room['last_cleaned']) {
        return false;
      }
      return moment(room['last_cleaned']).isSame(today, 'date');
    }).length;
    cleaner['cleaning_progress'] = Math.round(((numCleaned / assignedRooms.length) * 100)) || 0 + '%';
    return (
      <Tooltip title={`${numCleaned}/${assignedRooms.length}`} placement={"right"}>
        <Typography>{cleaner['cleaning_progress']}</Typography>
      </Tooltip>
    )
  }

  const getStatus = (cleaner) => {
    const shiftStart = moment(cleaner['shift_start'], 'HH:mm');
    const shiftEnd = moment(cleaner['shift_end'], 'HH:mm');
    const isBetween = moment().isBetween(shiftStart, shiftEnd);
    cleaner.status = isBetween ? '' : 'Unavailable';
    return cleaner.status;
  }
  const headCells = [
    {id: 'name', numeric: false, disablePadding: false, label: 'Name'},
    {id: 'shift_start', numeric: true, disablePadding: false, label: 'Shift start'},
    {id: 'shift_end', numeric: true, disablePadding: false, label: 'Shift end'},
    {id: 'cleaning_progress', numeric: true, disablePadding: false, label: 'Cleaning progress'},
    {id: 'current_location', numeric: true, disablePadding: false, label: 'Current location'},
    {id: 'status', numeric: true, disablePadding: false, label: 'Status'},
    {id: 'action', numeric: false, disablePadding: false, label: 'Action'},
  ];
  return (
    <Paper>
      <TableContainer>
        <Table size={'small'}>
          <EnhancedTableHead classes={classes} onRequestSort={handleRequestSort} order={order} orderBy={orderBy}
                             headCells={headCells}/>
          <TableBody>
            {stableSort(cleaners, getComparator(order, orderBy))
              .slice(page * cleanersPerPage, page * cleanersPerPage + cleanersPerPage)
              .map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={labelId}
                    style={{height: '33px'}}
                  >
                    <TableCell component="th" scope="row">{row.name}</TableCell>
                    <TableCell align="right">{row['shift_start']}</TableCell>
                    <TableCell align="right">{row['shift_end']}</TableCell>
                    <TableCell align="right">{getCleaningProgress(row)}</TableCell>
                    <TableCell align="right">{}</TableCell>
                    <TableCell align="right">{getStatus(row)}</TableCell>
                    <TableCell>
                      <IconButton size={"small"} color={"secondary"} onClick={() => {
                        viewCleaner(row)
                      }}><VisibilityOutlined/></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25, 50]}
        component="div"
        count={cleaners.length}
        rowsPerPage={cleanersPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}


export default CleanersPage;