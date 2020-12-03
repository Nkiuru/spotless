import React, {useEffect, useState} from 'react';
import {Link as RouterLink, useParams} from "react-router-dom";
import {getFloorplan, getHeatmap, getReport} from "../../utils/api";
import PageContainer from "../../containers/PageContainer";
import {Typography, Select, Grid} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import styles from './ReportPage.module.scss';
import {Check, CloseRounded} from "@material-ui/icons";
import {getVariant, update_img} from "../../utils/utils";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import moment from "moment";
import Link from "@material-ui/core/Link";
import heatmap from "../../assets/heatmap2.png";
import ActivityGraph from "../../components/Charts/ActivityGraph";

const ReportPage = () => {
  const {id} = useParams();
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showContImg, setShowContImg] = useState(false);
  const [showCleanImg, setShowCleanImg] = useState(false);
  const [image, setImage] = useState('');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    getReport(id)
      .then((report) => {
        setReport(report);
        setLoading(false);
        getFloorplan(report['room_id']).then((img) => {
          setImage(URL.createObjectURL(img));
        });
      })
  }, [id]);

  const mapSelected = async (event) => {
    setType(event.target.value);
    if (report['is_simulated']) {
      setShowContImg(false);
      setShowCleanImg(false);
      if (event.target.value === 'contamination') {
        setShowContImg(true);
      } else {
        setShowCleanImg(true);
      }
    } else {
      await getHeatmap(id, event.target.value)
        .then((res) => {
          const aux = document.getElementById('aux');
          const canvas = document.getElementById('main');
          console.log(res)
          update_img(res, aux, canvas, 1n, event.target.value === 'clean');
          setShowMap(true);
        }).catch((err) => {
          console.error(err)
          setErrorMsg('Could not load map');
          setError(true);
        });
    }
  }
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(false);
  };

  const getIcon = (successful) => {
    return successful ? (<Check className={styles.good} fontSize={"large"}/>) : (
      <CloseRounded color={"error"} fontSize={"large"}/>);
  }

  const getRoom = (report) => {
    return (<Link component={RouterLink} color="secondary"
                  to={{
                    pathname: `/rooms/${report['room_id']}`,
                    state: {id: report['room_id']}
                  }}>
      {report['room_name']}
    </Link>);
  }

  const getOverview = (report) => {
    if (report.overview === '<empty>') {
      return '-';
    } else {
      return report.overview;
    }
  }

  return (
    <PageContainer style={{textAlign: 'start'}}>
      <Typography variant={"h4"} className={styles.semiBold}>Cleaning report details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div className={styles.row} style={{justifyContent: 'space-between'}}>
            <Typography variant={"h5"}>Room map</Typography>
            <FormControl variant={'outlined'} style={{minWidth: '320px', marginBottom: 8}}>
              <InputLabel id="demo-simple-select-outlined-label">Contamination map type</InputLabel>
              <Select label="Contamination map type" onChange={mapSelected} value={type}>
                <MenuItem value="clean">Cleaning</MenuItem>
                <MenuItem value="contamination">Before cleaning</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            {showContImg &&
            <img src={heatmap} alt="contamination map" className={styles.map}/>
            }
            {showCleanImg &&
            <img src={heatmap} alt="clean map" className={styles.map}/>
            }
            <div className={styles.container}>
              {!showCleanImg && !showContImg &&
              <>
                <canvas id="aux" style={{display: 'none'}}/>
                <canvas id="main" width={72} height={56} className={styles.map}/>
                {showMap && <img src={image} alt={""} className={styles.overlay}/>}
              </>
              }
            </div>
          </div>
          <Typography variant={"h5"}>Cleaner comments:</Typography>
          <div className={styles.comments}>
            <Typography variant={"body1"} className={styles.comment}>{report.comments}</Typography>
          </div>
        </Grid>
        {!loading &&
        <Grid item xs={6}>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Cleaner:</Typography>
            <Link component={RouterLink} color="secondary"
                  to={{
                    pathname: `/cleaners/${report['cleaner_id']}`,
                    state: {id: report['cleaner_id']}
                  }}>
              <Typography style={{marginLeft: '4px'}} variant={"h5"}>{report['cleaner_name']}</Typography>
            </Link>
          </div>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Room:</Typography>
            <Typography style={{marginLeft: '4px'}} variant={"h5"}>{getRoom(report)}</Typography>
          </div>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Cleaning time:</Typography>
            <Typography style={{marginLeft: '4px'}}
                        variant={"h5"}>{moment(report['cleaning_time']).format('YYYY-MM-DD HH:mm:ss')}</Typography>
          </div>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Cleaning successful:</Typography>
            <div style={{marginLeft: 4, height: 35}}>{getIcon(report['cleaning_succesful'])}</div>
          </div>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Overview:</Typography>
            <Typography style={{marginLeft: '4px'}} variant={"h5"}>{getOverview(report)}</Typography>
          </div>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Contamination index:</Typography>
            <Typography style={{marginLeft: '4px'}} variant={"h5"}
                        className={styles[getVariant(report['contamination_index'])]}>{report['contamination_index'].toFixed(2)} %</Typography>
          </div>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Cleaning duration:</Typography>
            <Typography style={{marginLeft: '4px'}}
                        variant={"h5"}>{moment.utc((report['cleaning_duration_seconds'] * 1000)).format('m [minutes] s [seconds]')}</Typography>
          </div>
          <ActivityGraph activity={report['between_cleaning_plot']} loading={loading}
                         lastCleaned={report['cleaning_time']} title={"Room activity before cleaning"}/>
        </Grid>}
      </Grid>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={() => setError(false)} severity="error">{errorMsg}</Alert>
      </Snackbar>
    </PageContainer>
  )
}

export default ReportPage;