import React, {useEffect, useState} from "react";
import {useLocation, useHistory} from 'react-router-dom';
import {Button, Typography} from "@material-ui/core";
import {getAssignedCleaners, getRoom} from "../../utils/api";
import PageContainer from "../../containers/PageContainer";
import styles from "./RoomDetailsPage.module.scss";
import RoomDetailsCard from "./RoomDetailsCard";
import RoomCleanerCard from "./RoomCleanerCard";

const RoomDetailsPage = () => {
  const location = useLocation();
  const history = useHistory();
  const params = location.state;
  const [roomLoaded, setRoomLoaded] = useState(false);
  const [room, setRoom] = useState({});
  const [cleaner, setCleaner] = useState({});

  useEffect(() => {
    getRoom(params.id)
      .then((room) => {
          console.log(room);
          setRoom(room);
          setRoomLoaded(true);
        },
        (error) => console.log(error));
    getAssignedCleaners(params.id)
      .then((cleaners) => {
        if (cleaners.length >= 1) {
          setCleaner(cleaners[0]);
        }
      }, (error) => console.log(error));
  }, [params.id]);

  const navigateToMap = () => {
    history.push({
      pathname: `/rooms`,
      state: {id: params.id, action: 'show'}
    })
  }

  return (
    <PageContainer style={{width: '65%'}}>
      {roomLoaded && (
        <>
          <div className={styles.titleRow}>
            <Typography variant={"h4"}>Room: {room.name}</Typography>
            <Button variant={"text"} onClick={navigateToMap} size={"small"}>Show on map</Button>
          </div>
          <div className={styles.content}>
            <RoomDetailsCard room={room}/>
            <RoomCleanerCard room={room} cleaner={cleaner} setCleaner={setCleaner}/>
          </div>
        </>
      )}
    </PageContainer>
  );
}

export default RoomDetailsPage;