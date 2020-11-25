import React, {useEffect, useState} from 'react';
import {getRooms} from "../../utils/api";
import {Typography} from "@material-ui/core";
import styles from "./RoomsPage.module.scss";
import PageContainer from "../../containers/PageContainer";
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

export default RoomsPage;