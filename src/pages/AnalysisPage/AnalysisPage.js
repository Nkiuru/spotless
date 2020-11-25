import React, {useEffect, useState} from 'react';
import PageContainer from "../../containers/PageContainer";
import {Typography} from "@material-ui/core";
import CleaningsByCleaner from "../../components/Charts/CleaningsByCleaner";
import {getReports} from "../../utils/api";
import styles from './AnalysisPage.module.scss';

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
      <div className={styles.graph}>
        <CleaningsByCleaner reports={reports} loading={loading}/>
      </div>
    </PageContainer>
  )
}

export default AnalysisPage;