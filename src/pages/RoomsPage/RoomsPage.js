import React, {useEffect, useState} from 'react';
import {getHospitals, getRooms} from "../../utils/api";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {IconButton, Paper, Table, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import moment from "moment";
import {VisibilityOutlined} from "@material-ui/icons";
import {useHistory} from 'react-router-dom';
import styles from "../CleanersPage/CleanersPage.module.scss";
import PageContainer from "../../containers/PageContainer";

const RoomsPage = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [hospital, setHospital] = useState('');

  useEffect(() => {
    getHospitals('hospital0')
      .then((result) => {
          console.log(result);
          setIsLoaded(true);
          setHospitals(result);
        },
        (err) => {
          setError(true);
          setIsLoaded(true);
          console.log(err);
        })
  }, []);

  const hospitalSelected = (event) => {
    setHospital(event.target.value);
    getRooms(event.target.value['_id'])
      .then((rooms) => {
          console.log(rooms);
          setRooms(rooms);
        },
        (error) => {
          setError(true);
          setIsLoaded(true);
          console.log(error);
        });
  }

  return (
    <PageContainer>
      <div className={styles.headerRow}>
        <Typography variant={"h5"} className={styles.bold}>Rooms</Typography>
        {!isLoaded ? <CircularProgress color="secondary"/> :
          (
            <FormControl variant={'outlined'} style={{minWidth: '160px', margin: '8px'}}>
              <InputLabel id="demo-simple-select-outlined-label">Select hospital</InputLabel>
              <Select label="Select Hospital" onChange={hospitalSelected} value={hospital}>
                <MenuItem value={{}}>
                  <em>None</em>
                </MenuItem>
                {
                  hospitals.map(hosp => (
                    <MenuItem value={hosp} key={hosp['_id']}>{hosp.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          )
        }
      </div>
      {rooms.length > 0 && (
        <RoomTable rooms={rooms}/>
      )}
      {error && <p>ERROR</p>}
    </PageContainer>
  )
}

const RoomTable = ({rooms}) => {
  const history = useHistory();
  const getDate = (date) => {
    return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : 'Never';
  }

  const getPatient = (patient) => {
    return patient === "<empty>" ? 'No' : 'Yes';
  }

  const openRoom = (room) => {
    const id = room['_id'];
    history.push({
      pathname: `/rooms/${id}`,
      state: {id}
    })
  }

  return (
    <TableContainer component={Paper}>
      <Table size={"small"}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Building</TableCell>
            <TableCell align="right">Floor</TableCell>
            <TableCell align="right">Contamination index</TableCell>
            <TableCell align="right">Has Patient</TableCell>
            <TableCell align="right">Room type</TableCell>
            <TableCell align="right">Last cleaned</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
         </TableHead>
        <TableBody>
          {rooms.map((row) => (
            <TableRow key={row['_id']}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.building}</TableCell>
              <TableCell align="right">{row.floor}</TableCell>
              <TableCell align="right">{row['contamination_index']}</TableCell>
              <TableCell align="right">{getPatient(row.patient)}</TableCell>
              <TableCell align="right">{row['room_type']}</TableCell>
              <TableCell align="right">{getDate(row['last_cleaned'])}</TableCell>
              <TableCell>
                <IconButton color={"secondary"} onClick={() => {
                  openRoom(row)
                }}><VisibilityOutlined/></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RoomsPage;