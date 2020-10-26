import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  InputLabel,
  MenuItem
} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {AddCircleOutline, VisibilityOutlined} from "@material-ui/icons";
import {createCleaner, getCleaners} from "../../utils/api";
import styles from './CleanersPage.module.scss';
import * as Yup from "yup";
import {Formik, Form, Field} from "formik";
import {Select, TextField} from "formik-material-ui";
import PageContainer from "../../containers/PageContainer";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

const CleanersPage = () => {
  const [cleaners, setCleaners] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    getCleaners()
      .then((cleaners) => {
        console.log(cleaners)
        setCleaners(cleaners);
        setIsLoaded(true);
      }, (err) => {
        console.log(err);
      })
  }, [setOpen, isLoaded])

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <PageContainer>
      <div className={styles.headerRow}>
        <Typography variant={"h5"} className={styles.bold}>Cleaners</Typography>
        <Tooltip title="Add cleaner">
          <IconButton onClick={() => setOpen(true)}>
            <AddCircleOutline/>
          </IconButton>
        </Tooltip>
      </div>
      {isLoaded ? <CleanersTable cleaners={cleaners}/> : <CircularProgress color="secondary" style={{margin: '16px auto'}}/>}
      <AddCleanerDialog open={open} setOpen={setOpen} setIsLoaded={setIsLoaded} setSnackOpen={setSnackOpen}/>
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert variant={"filled"} severity="success" onClose={handleSnackClose}>
          Cleaner created
        </Alert>
      </Snackbar>
    </PageContainer>
  )
}

const validationSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required()
});

const AddCleanerDialog = ({open, setOpen, setIsLoaded, setSnackOpen}) => {
  const handleClose = () => {
    setOpen(false);
  }

  const initialValues = {
    firstName: '',
    lastName: '',
    startHour: '8',
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
                <Grid item xs>
                  <InputLabel id="startHour">HH</InputLabel>
                  <Field component={Select}
                         inputProps={{labelId: "startHour", menuProps: {classes: {paper: styles.menu}}}}
                         name="startHour">
                    {[...Array(24).keys()].map((number) => {
                      return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
                    })}
                  </Field>
                </Grid>
                <Grid item xs>
                  <InputLabel id="startMinutes">MM</InputLabel>
                  <Field component={Select}
                         inputProps={{labelId: "startMinutes", menuProps: {classes: {paper: styles.menu}}}}
                         name="startMinutes">
                    {['00', 15, 30, 45].map((number) => {
                      return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
                    })}
                  </Field>
                </Grid>
                <Grid item xs>
                  <InputLabel id="endHour">HH</InputLabel>
                  <Field component={Select}
                         inputProps={{labelId: "endHour", menuProps: {classes: {paper: styles.menu}}}}

                         name="endHour">
                    {[...Array(23).keys()].map((number) => {
                      return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
                    })}
                  </Field>
                </Grid>
                <Grid item xs>
                  <InputLabel id="endMinutes">MM</InputLabel>
                  <Field component={Select}
                         inputProps={{labelId: "endMinutes", menuProps: {classes: {paper: styles.menu}}}}
                         name="endMinutes">
                    {['00', 15, 30, 45].map((number) => {
                      return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
                    })}
                  </Field>
                </Grid>
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

const CleanersTable = ({cleaners}) => {
  const history = useHistory();

  const viewCleaner = (cleaner) => {
    const id = cleaner['_id'];
    history.push({
      pathname: `/cleaners/${id}`,
      state: {id}
    })
  }

  return (
    <TableContainer component={Paper}>
      <Table size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Shift start</TableCell>
            <TableCell align="right">Shift end</TableCell>
            <TableCell align="right">Cleaning percent</TableCell>
            <TableCell align="right">Current location</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cleaners.map((row) => (
            <TableRow key={row['_id']}>
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell align="right">{row['shift_start']}</TableCell>
              <TableCell align="right">{row['shift_end']}</TableCell>
              <TableCell align="right">{}</TableCell>
              <TableCell align="right">{}</TableCell>
              <TableCell align="right">{}</TableCell>
              <TableCell>
                <IconButton size={"small"} color={"secondary"} onClick={() => {
                  viewCleaner(row)
                }}><VisibilityOutlined/></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export default CleanersPage;