import React, {useEffect, useState} from 'react';
import {getRooms} from "../../utils/api";
import {IconButton, Paper, Table, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import moment from "moment";
import {VisibilityOutlined} from "@material-ui/icons";
import {useHistory} from 'react-router-dom';
import styles from "./RoomsPage.module.scss";
import PageContainer from "../../containers/PageContainer";
import {getRoomTypeProp} from "../../utils/utils";
import RoomsMap from "./RoomsMap";
import TableFilters from "../AssignmentsPage/TableFilters";

const RoomsPage = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [origRooms, setOrigRooms] = useState([]);

  useEffect(() => {
    getRooms()
      .then((rooms) => {
          setRooms(rooms);
          setOrigRooms(rooms);
          setIsLoaded(true);
        },
        (error) => {
          setError(true);
          setIsLoaded(true);
          console.log(error);
        });
  }, []);

  return (
    <PageContainer>
      <div className={styles.headerRow}>
        <Typography variant={"h5"} className={styles.bold}>Rooms</Typography>
        {isLoaded &&
        <div className={styles.filters}>
          <TableFilters rooms={origRooms} setRooms={setRooms} hideAll={true} hideAssigned={true} initialBuilding={rooms[0] && rooms[0].building} initialFloor={rooms[0] && rooms[0].floor}/>
        </div>
        }
      </div>
      {isLoaded &&
      <RoomsMap rooms={rooms}/>
      }
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
              <TableCell align="right">{getRoomTypeProp(row, 'displayName')}</TableCell>
              <TableCell align="right">{getDate(row['last_cleaned'])}</TableCell>
              <TableCell>
                <IconButton size={"small"} color={"secondary"} onClick={() => {
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