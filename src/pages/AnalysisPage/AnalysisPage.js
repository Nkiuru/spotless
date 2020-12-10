import React, {useEffect, useState} from 'react';
import PageContainer from "../../containers/PageContainer";
import {Grid, Typography} from "@material-ui/core";
import CleaningsByCleaner from "../../components/Charts/CleaningsByCleaner";
import {getReports, getRooms} from "../../utils/api";
import ContaminationIndexOverTime from "../../components/Charts/ContaminationIndexOverTime";
import CleaningDuration from "../../components/Charts/CleaningDuration";

const AnalysisPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    Promise.all([getRooms(), getReports()])
      .then((result) => {
        result[1].forEach((report) => {
          report.room = result[0].find((room) => {
            return room['_id'] === report['room_id'];
          });
        })
        setRooms(result[0]);
        setReports(result[1]);
        setLoading(false);
      });
  }, []);
  return (
    <PageContainer style={{textAlign: 'start'}}>
      <Typography variant={"h5"} style={{marginBottom: 16}}>Analysis</Typography>
      <Grid container spacing={4} style={{marginBottom: 16}}>
        <Grid item xs={12}>
          <ContaminationIndexOverTime reports={reports} loading={loading} rooms={rooms}/>
        </Grid>
        <Grid item xs={6}>
          <CleaningsByCleaner reports={reports} loading={loading}/>
        </Grid>
        <Grid item xs={6}>
          <CleaningDuration reports={reports} loading={loading}/>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default AnalysisPage;