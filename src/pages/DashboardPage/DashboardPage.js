import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import PageContainer from "../../containers/PageContainer";
import styles from './DashboardPage.module.scss';
import Grid from "@material-ui/core/Grid";
import KeyStat from "./KeyStat";
import {getHospitals, getReports, getRooms, getUser, GLOBAL_HOSPITAL, setGlobalHospital} from "../../utils/api";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import {getVariant} from "../../utils/utils";
import ReportsPerDay from "../../components/Charts/ReportsPerDay";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Alerts from "./Alerts";

const DashboardPage = () => {
  const [user, setUser] = useState('');
  const [rooms, setRooms] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [hospital, setHospital] = useState(GLOBAL_HOSPITAL);
  const [hospitalSet, setHospitalSet] = useState(false);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setLoading(true);
    Promise.all([getRooms(), getReports()])
      .then((result) => {
        setRooms(result[0]);
        setReports(result[1]);
        setLoading(false);
      });
    if (!hospitalSet) {
      getHospitals()
        .then((result) => {
          setHospitals(result);
        });
    }
  }, [hospitalSet, hospital]);

  const hospitalSelected = (event) => {
    setHospital(event.target.value);
    setGlobalHospital(event.target.value);
    setHospitalSet(!hospitalSet);
  }

  const getCleanedRooms = () => {
    const today = moment();
    return rooms.filter((room) => {
      if (!room['last_cleaned']) {
        return false;
      }
      return moment(room['last_cleaned']).isSame(today, 'date');
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
    return (contaminations.reduce((a, b) => (a + b)) / contaminations.length).toFixed(1);
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
      <Grid container direction={"row"} justify={"space-between"} alignItems={"center"} style={{marginBottom: '32px'}}>
        <Grid item>
          <Typography variant={"h4"} style={{marginBottom: 16}}>Hello {user && user.username}!</Typography>
        </Grid>
        <Grid item>
          <FormControl variant={'outlined'} style={{minWidth: '320px', margin: '8px'}}>
            <InputLabel id="demo-simple-select-outlined-label">Select hospital</InputLabel>
            <Select label="Select Hospital" onChange={hospitalSelected} value={hospital}>
              <MenuItem value={false}>
                <em>All</em>
              </MenuItem>
              {
                hospitals.map(hosp => (
                  <MenuItem value={hosp['_id']} key={hosp['_id']}>{hosp.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={5}>
          <Typography variant={"h5"} className={styles.semiBold}>Alerts</Typography>
          <Alerts reports={reports} loading={loading}/>
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
      <ReportsPerDay loading={loading} reports={reports}/>
    </PageContainer>
  )
}

export default DashboardPage;