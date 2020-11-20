import React, {useEffect, useState} from "react";
import {useLocation, useHistory} from 'react-router-dom';
import {Button, Typography} from "@material-ui/core";
import {getAssignedCleaners, getReports, getRoom, getRoomHeatmap} from "../../utils/api";
import PageContainer from "../../containers/PageContainer";
import styles from "./RoomDetailsPage.module.scss";
import RoomDetailsCard from "./RoomDetailsCard";
import RoomCleanerCard from "./RoomCleanerCard";
import CommentsList from "./RoomReportComments";
import CleaningReportsTable from "../../components/CleaningReportsTable/CleaningReportsTable";
import CircularProgress from "@material-ui/core/CircularProgress";
import {update_img} from "../../utils/utils";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import heatmap from "../../assets/heatmap2.png";

const RoomDetailsPage = () => {
  const location = useLocation();
  const history = useHistory();
  const params = location.state;
  const [roomLoaded, setRoomLoaded] = useState(false);
  const [room, setRoom] = useState({});
  const [reports, setReports] = useState([]);
  const [cleaner, setCleaner] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  useEffect(() => {
    if (showMap) {
      getRoomHeatmap(params.id, 'contamination')
        .then((response) => {
          const aux = document.getElementById('aux');
          const canvas = document.getElementById('main');
          // eslint-disable-next-line no-undef
          update_img(response, aux, canvas, 1n);
        })
        .catch((err) => {
          console.log(err.message)
          setErrorMsg(err.message);
          setError(true);
        })
    }
  }, [params.id, showMap])
  const navigateToMap = () => {
    history.push({
      pathname: `/rooms`,
      state: {id: params.id, action: 'show'}
    })
  }

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(false);
    setShowMap(false);
  };

  return (
    <PageContainer style={{width: '65%'}}>
      {roomLoaded ? (
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
            <div className={styles.row}>
              <Typography variant={"h5"}>Room map</Typography>
              <Button variant={"outlined"} color={"primary"} onClick={() => setShowMap(!showMap)}>
                {showMap ? 'Hide map' : 'Show Map'}
              </Button>
            </div>
            {showMap && (
              <>
                <canvas id="aux" style={{display: 'none'}}/>
                <canvas id="main" width={72} height={56} className={styles.map}/>
              </>
            )}
            <CleaningReportsTable reports={reports} type={'room'}/>
          </div>
        </>
      ) : <CircularProgress color="secondary" style={{margin: '16px auto'}}/>}
      <Snackbar open={error} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={() => setError(false)} severity="error">{errorMsg}</Alert>
      </Snackbar>
    </PageContainer>
  );
}

export default RoomDetailsPage;