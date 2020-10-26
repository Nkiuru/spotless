import React, {useEffect, useState} from "react";
import {useLocation, useHistory} from 'react-router-dom';
import {Button, Typography} from "@material-ui/core";
import {getAssignedCleaners, getReports, getRoom} from "../../utils/api";
import PageContainer from "../../containers/PageContainer";
import styles from "./RoomDetailsPage.module.scss";
import RoomDetailsCard from "./RoomDetailsCard";
import RoomCleanerCard from "./RoomCleanerCard";
import CommentsList from "./RoomReportComments";
import RoomReportsTable from "./RoomReportsTable";

const RoomDetailsPage = () => {
  const location = useLocation();
  const history = useHistory();
  const params = location.state;
  const [roomLoaded, setRoomLoaded] = useState(false);
  const [room, setRoom] = useState({});
  const [reports, setReports] = useState([]);
  const [cleaner, setCleaner] = useState({});

  useEffect(() => {
    getRoom(params.id)
      .then((room) => {
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
    getReports(params.id)
      .then((reports) => {
        setReports(reports.sort((a, b) => new Date(b['cleaning_time']) - new Date(a['cleaning_time'])));
      })
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
            <div className={styles.detailsRow}>
              <RoomDetailsCard room={room}/>
              <RoomCleanerCard room={room} cleaner={cleaner} setCleaner={setCleaner}/>
            </div>
            <CommentsList reports={reports}/>
            <Typography variant={"h5"}>Room map</Typography>
            <div style={{width: 600, height: 400}}/>
            <RoomReportsTable reports={reports}/>
          </div>
        </>
      )}
    </PageContainer>
  );
}

export default RoomDetailsPage;