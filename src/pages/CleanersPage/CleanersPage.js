import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Grid, IconButton, Paper, Table, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {AddCircleOutline, VisibilityOutlined} from "@material-ui/icons";
import {createCleaner, getCleaners} from "../../utils/api";
import styles from './CleanersPage.module.scss';
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

const CleanersPage = () => {
  const [cleaners, setCleaners] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [open, setOpen] = React.useState(false);

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
  return (
    <div>
      <div className={styles.headerRow}>
        <Typography variant={"h5"} style={{marginLeft: 'auto', paddingLeft: '84px'}}>Cleaners</Typography>
        <Tooltip title="Add cleaner">
          <IconButton onClick={() => setOpen(true)} style={{marginLeft: 'auto', marginRight: '32px'}}>
            <AddCircleOutline/>
          </IconButton>
        </Tooltip>
      </div>
      {isLoaded && <CleanersTable cleaners={cleaners}/>}
      <AddCleanerDialog open={open} setOpen={setOpen} setIsLoaded={setIsLoaded}/>
    </div>
  )
}

const AddCleanerDialog = ({open, setOpen, setIsLoaded}) => {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [startHour, setStartHour] = useState('8');
  const [startMinutes, setStartMinutes] = useState('00');
  const [endHour, setEndHour] = useState('16');
  const [endMinutes, setEndMinutes] = useState('00');

  const handleClose = () => {
    setOpen(false);
  }

  const handleSubmit = async () => {
    const cleaner = await createCleaner(`${first} ${last}`,
      `${startHour.padStart(2, '0')}:${startMinutes.padStart(2, '0')}`,
      `${endHour.padStart(2, '0')}:${endMinutes.padStart(2, '0')}`);
    console.log(cleaner);
    setIsLoaded(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create a new cleaner</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="First name"
              type="text"
              value={first}
              onChange={(event => setFirst(event.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              id="name"
              label="Last name"
              type="text"
              value={last}
              onChange={(event => setLast(event.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <InputLabel id="startHour">HH</InputLabel>
            <Select labelId="startHour" value={startHour} onChange={event => setStartHour(event.target.value)}
                    MenuProps={{classes: {paper: styles.menu}}}>
              {[...Array(24).keys()].map((number) => {
                return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
              })}
            </Select>
          </Grid>
          <Grid item xs>
            <InputLabel id="startMinutes">MM</InputLabel>
            <Select labelId="startMinutes" value={startMinutes} onChange={event => setStartMinutes(event.target.value)}
                    MenuProps={{classes: {paper: styles.menu}}}>
              {['00', 15, 30, 45].map((number) => {
                return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
              })}
            </Select>
          </Grid>
          <Grid item xs>
            <InputLabel id="endHour">HH</InputLabel>
            <Select labelId="endHour" value={endHour} onChange={event => setEndHour(event.target.value)}
                    MenuProps={{classes: {paper: styles.menu}}}>
              {[...Array(23).keys()].map((number) => {
                return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
              })}
            </Select>
          </Grid>
          <Grid item xs>
            <InputLabel id="endMinutes">MM</InputLabel>
            <Select labelId="endMinutes" value={endMinutes} onChange={event => setEndMinutes(event.target.value)}
                    MenuProps={{classes: {paper: styles.menu}}}>
              {['00', 15, 30, 45].map((number) => {
                return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
              })}
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Create cleaner
        </Button>
      </DialogActions>
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
      <Table>
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
                <IconButton color={"secondary"} onClick={() => {
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