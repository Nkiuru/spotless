import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import PageContainer from "../../containers/PageContainer";
import styles from './DashboardPage.module.scss';
import Grid from "@material-ui/core/Grid";
import KeyStat from "./KeyStat";
import {getRooms, getUser} from "../../utils/api";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import {getVariant} from "../../utils/utils";
import ReportsPerDay from "../../components/Charts/ReportsPerDay";

const DashboardPage = () => {
  const [user, setUser] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    setUser(u);

    getRooms()
      .then((result) => {
        setRooms(result);
        setLoading(false);
      })
  }, []);

  const getCleanedRooms = () => {
    return rooms.filter((room) => {
      if (!room['last_cleaned']) {
         return false;
      }
      return moment(room['last_cleaned']).isSame(moment().format('YYYY-MM-DD'));
    }).length;
  }

  const getContaminationIndex = () => {
    const contaminations = [];
    rooms.forEach((room) => {
      const val = room['contamination_index'];
      if (val > 100) {
        contaminations.push(100);
      } else if (val < 0) {
        contaminations.push(0);
      } else {
        contaminations.push(val);
      }
    })
    return contaminations.reduce((a, b) => (a + b)) / contaminations.length;
  }

  const getGreenRooms = () => {
    return rooms.filter((room) => {
      return getVariant(room['contamination_index']) === 'good';
    }).length;
  }

  const getRedRooms = () => {
    return rooms.filter((room) => {
      return getVariant(room['contamination_index']) === 'critical';
    }).length;
  }
  return (
    <PageContainer style={{textAlign: 'start'}}>
      <Typography variant={"h4"} style={{marginBottom: 16}}>Hello {user && user.username}!</Typography>
      <Grid container spacing={6}>
        <Grid item xs={5}>
          <Typography variant={"h5"} className={styles.semiBold}>Alerts</Typography>
          <Typography variant={"h6"} style={{marginTop: 16}} className={styles.semiBold}>No active alerts</Typography>
        </Grid>
        <Grid item xs className={styles.grid}>
          <Grid container spacing={4}>
            <Grid item xs>
              <KeyStat subtitle={"Rooms cleaned today"}
                       value={loading ? <CircularProgress color={"secondary"}/> : getCleanedRooms()} color={"#F2C94C"}/>
            </Grid>
            <Grid item xs>
              <KeyStat subtitle={"Average contamination index"}
                       value={loading ? <CircularProgress color={"secondary"}/> : getContaminationIndex()}
                       color={"#27AE60"}/>
            </Grid>
            <Grid item xs>
              <KeyStat subtitle={"Green rooms"}
                       value={loading ? <CircularProgress color={"secondary"}/> : getGreenRooms()} color={"#27AE60"}/>
            </Grid>
            <Grid item xs>
              <KeyStat subtitle={"Red rooms"} value={loading ? <CircularProgress color={"secondary"}/> : getRedRooms()}
                       color={"#EB5757"}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ReportsPerDay />
    </PageContainer>
  )
}

export default DashboardPage;