import React, {useEffect, useState} from "react";
import {useLocation, useHistory} from 'react-router-dom';
import {Button, Typography} from "@material-ui/core";
import {getRoom} from "../../utils/api";
import PageContainer from "../../containers/PageContainer";
import styles from "./RoomDetailsPage.module.scss";
import {RoomDetailsCard} from "./RoomDetailsCard";

const RoomDetailsPage = () => {
  const location = useLocation();
  const history = useHistory();
  const params = location.state;
  const [roomLoaded, setRoomLoaded] = useState(false);
  const [room, setRoom] = useState({});

  useEffect(() => {
    getRoom(params.id)
      .then((room) => {
          console.log(room);
          setRoom(room);
          setRoomLoaded(true);
        },
        (error) => {
          console.log(error);
        })
  }, [params.id]);

  const navigateToMap = () => {
    history.push({
      pathname: `/rooms`,
      state: {id: params.id, action: 'show'}
    })
  }

  return (
    <PageContainer>
      {roomLoaded && (
        <>
          <div className={styles.titleRow}>
            <Typography variant={"h4"}>Room: {room.name}</Typography>
            <Button variant={"text"} onClick={navigateToMap} size={"small"}>Show on map</Button>
          </div>
          <div className={styles.content}>
            <RoomDetailsCard room={room}/>
          </div>
        </>
      )}
    </PageContainer>
  );
}

export default RoomDetailsPage;