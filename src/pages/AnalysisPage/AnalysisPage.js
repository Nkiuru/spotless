import React, {useEffect, useState} from 'react';
import PageContainer from "../../containers/PageContainer";
import {Grid, Typography} from "@material-ui/core";
import CleaningsByCleaner from "../../components/Charts/CleaningsByCleaner";
import {getReports} from "../../utils/api";
import ContaminationIndexOverTime from "../../components/Charts/ContaminationIndexOverTime";

const AnalysisPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports()
      .then((result) => {
        setReports(result);
        setLoading(false);
      });
  }, []);
  return (
    <PageContainer style={{textAlign: 'start'}}>
      <Typography variant={"h5"}>Analysis</Typography>
      <Grid container spacing={2}>
        <Grid item xs>
          <CleaningsByCleaner reports={reports} loading={loading}/>
        </Grid>
        <Grid item xs>
          <ContaminationIndexOverTime reports={reports} loading={loading}/>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default AnalysisPage;