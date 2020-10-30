import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {getHeatmap, getReport} from "../../utils/api";
import PageContainer from "../../containers/PageContainer";
import {Typography, Select, Grid} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import styles from './ReportPage.module.scss';
import {Check, CloseRounded} from "@material-ui/icons";
import {update_img} from "../../utils/utils";

const ReportPage = () => {
  const location = useLocation();
  const {id} = location.state;
  const [report, setReport] = useState({});
  const [type, setType] = useState('');


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
        update_img(res, aux, canvas);
      }).catch( (err) => console.log(err));
  }

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
                <MenuItem value="Combined">After cleaning</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <canvas id="aux" style={{display: 'none'}}/>
            <canvas id="main" width={72} height={56}/>
          </div>
          <Typography variant={"h5"}>Cleaner comments:</Typography>
          <div className={styles.comments}>
            <Typography variant={"body1"} className={styles.comment}>{report.comments}</Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Cleaner:</Typography>
            <Typography style={{marginLeft: '4px'}} variant={"h5"}>{report['cleaner_name']}</Typography>
          </div>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Cleaning time:</Typography>
            <Typography style={{marginLeft: '4px'}} variant={"h5"}>{report['cleaning_time']}</Typography>
          </div>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Contamination index:</Typography>
            <Typography style={{marginLeft: '4px'}} variant={"h5"}>75</Typography>
          </div>
          <div className={styles.row}>
            <Typography variant={"h5"} className={styles.reportInfo}>Cleaning successful:</Typography>
            <div style={{marginLeft: 4, height: 35}}>{getIcon(report['cleaning_succesful'])}</div>
          </div>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ReportPage;