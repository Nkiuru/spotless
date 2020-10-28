import React from 'react';
import Typography from "@material-ui/core/Typography";
import PageContainer from "../../containers/PageContainer";
import styles from './DashboardPage.module.scss';
import Grid from "@material-ui/core/Grid";
import KeyStat from "./KeyStat";

const DashboardPage = () => {
  return (
    <PageContainer style={{textAlign: 'start'}}>
      <Grid container spacing={6}>
        <Grid item xs={5}>
          <Typography variant={"h5"} className={styles.semiBold}>Alerts</Typography>
        </Grid>
        <Grid item xs={3}>
          <Grid container spacing={4}>
            <Grid item xs>
              <KeyStat subtitle={"Rooms cleaned today"} value={1} color={"#27AE60"}/>
            </Grid>
            <Grid item xs>
              <KeyStat subtitle={"Average contamination index"} value={50} color={"#F2C94C"}/>
            </Grid>
            <Grid item xs>
              <KeyStat subtitle={"Green rooms"} value={0} color={"#27AE60"}/>
            </Grid>
            <Grid item xs>
              <KeyStat subtitle={"Red rooms"} value={4} color={"#EB5757"}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </PageContainer>
  )
}

export default DashboardPage;