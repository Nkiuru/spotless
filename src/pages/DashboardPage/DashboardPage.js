import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import PageContainer from "../../containers/PageContainer";
import styles from './DashboardPage.module.scss';
import Grid from "@material-ui/core/Grid";
import KeyStat from "./KeyStat";
import {
  getHospitals,
  getReports,
  getRooms,
  getUser,
  GLOBAL_HOSPITAL,
  setGlobalHospital,
  setGlobalHospitalName
} from "../../utils/api";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import {getStatus, getVariant, getVariantColor} from "../../utils/utils";
import ReportsPerDay from "../../components/Charts/ReportsPerDay";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Alerts from "./Alerts";
import {IconButton, Tooltip} from "@material-ui/core";
import {Refresh} from "@material-ui/icons";

const DashboardPage = () => {
  const [user, setUser] = useState('');
  const [rooms, setRooms] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [hospital, setHospital] = useState(GLOBAL_HOSPITAL);
  const [hospitalSet, setHospitalSet] = useState(false);
  const [fetchData, setFetchData] = useState(false);

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
  }, [hospitalSet, hospital, fetchData]);

  const hospitalSelected = (event) => {
    setHospital(event.target.value);
    setGlobalHospital(event.target.value);
    const hospital = hospitals.find((x) => x['_id'] === event.target.value);
    setGlobalHospitalName(hospital ? hospital.name : false);
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
    });
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

  const getColor = () => {
    return getVariantColor(getContaminationIndex());
  }

  return (
    <PageContainer style={{textAlign: 'start'}}>
      <Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
        <Grid item style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Typography variant={"h4"}>Hello {user && user.username}!</Typography>
          <Tooltip title={"Refresh"}>
            <IconButton onClick={() => {
              setFetchData(!fetchData);
            }}>
              <Refresh/>
            </IconButton>
          </Tooltip>
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
        <Grid item xs className={styles.grid} style={{marginTop: 48}}>
          <Grid container spacing={4}>
            <Grid item xs>
              <KeyStat subtitle={"Rooms cleaned today"}
                       value={loading ? <CircularProgress color={"secondary"}/> : getCleanedRooms()} color={"#F2C94C"}/>
            </Grid>
            <Grid item xs>
              <KeyStat subtitle={"Average contamination index"}
                       value={loading ? <CircularProgress color={"secondary"}/> : getContaminationIndex()} color={!loading && getColor()}/>
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