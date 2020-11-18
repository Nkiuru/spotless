import React, {useEffect, useState} from 'react';
import {Link as RouterLink, useLocation} from "react-router-dom";
import {getHeatmap, getReport} from "../../utils/api";
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

const ReportPage = () => {
  const location = useLocation();
  const {id} = location.state;
  const [report, setReport] = useState({});
  const [type, setType] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getReport(id)
      .then((report) => {
        setReport(report);
      })
  }, [id]);

  const mapSelected = async (event) => {
    setType(event.target.value);
    await getHeatmap(id, event.target.value)
      .then((res) => {
        const aux = document.getElementById('aux');
        const canvas = document.getElementById('main');
        console.log(res)
        update_img(res, aux, canvas, 1n);
      }).catch((err) => {
        console.error(err)
        setErrorMsg('Could not load map');
        setError(true);
      });
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
                <MenuItem value="clean">After cleaning</MenuItem>
                <MenuItem value="contamination">Before cleaning</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <canvas id="aux" style={{display: 'none'}}/>
            <canvas id="main" width={72} height={56} className={styles.map}/>
          </div>
          <Typography variant={"h5"}>Cleaner comments:</Typography>
          <div className={styles.comments}>
            <Typography variant={"body1"} className={styles.comment}>{report.comments}</Typography>
          </div>
        </Grid>
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
            <Typography style={{marginLeft: '4px'}} variant={"h5"}>{report['room_name']}</Typography>
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
            <Typography style={{marginLeft: '4px'}} variant={"h5"}>{report.overview}</Typography>
          </div>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Contamination index:</Typography>
            <Typography style={{marginLeft: '4px'}} variant={"h5"}
                        className={styles[getVariant(report['contamination_index'] || 75)]}>{report['contamination_index'] || 75}</Typography>
          </div>
        </Grid>
      </Grid>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={() => setError(false)} severity="error">{errorMsg}</Alert>
      </Snackbar>
    </PageContainer>
  )
}

export default ReportPage;