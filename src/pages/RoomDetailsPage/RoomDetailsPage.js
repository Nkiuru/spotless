import React, {useEffect, useState} from "react";
import {useLocation, useHistory} from 'react-router-dom';
import {Button, Typography} from "@material-ui/core";
import {getAssignedCleaners, getFloorplan, getReports, getRoom, getRoomHeatmap} from "../../utils/api";
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

const RoomDetailsPage = () => {
  const location = useLocation();
  const history = useHistory();
  const params = location.state;
  const [roomLoaded, setRoomLoaded] = useState(false);
  const [room, setRoom] = useState({});
  const [reports, setReports] = useState([]);
  const [cleaner, setCleaner] = useState({});
  const [image, setImage] = useState('');
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
    getFloorplan(params.id).then((img) => {
      setImage(URL.createObjectURL(img));
    }).catch((err) => {
      console.log(err)
    })
  }, [params.id]);

  useEffect(() => {
    if (showMap) {
      getRoomHeatmap(params.id, 'contamination')
        .then((response) => {
          const aux = document.getElementById('aux');
          const canvas = document.getElementById('main');
          let scaler = 1n;
          if (room['is_simulated']) {
            if (room['contamination_index'] >= 60) {
              scaler = 20n;
            } else if (room['contamination_index'] >= 30) {
              scaler = 10n;
            } else {
              scaler = 5n;
            }
          }
          // eslint-disable-next-line no-undef
          update_img(response, aux, canvas, scaler);
        })
        .catch((err) => {
          setShowMap(false);
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
            <div className={styles.row} style={{marginTop: 32}}>
              <Typography variant={"h5"}>Room map</Typography>
              <Button variant={"outlined"} color={"primary"} onClick={() => setShowMap(!showMap)}>
                {showMap ? 'Hide map' : 'Show Map'}
              </Button>
            </div>
            {showMap && (
              <div className={styles.container}>
                <canvas id="aux" style={{display: 'none'}}/>
                <canvas id="main" width={72} height={56} className={styles.map} />
                <img src={image} alt={""} className={styles.overlay} />
              </div>
            )}
            <CommentsList reports={reports}/>
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