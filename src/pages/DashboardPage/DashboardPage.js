import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import PageContainer from "../../containers/PageContainer";
import styles from './DashboardPage.module.scss';
import Grid from "@material-ui/core/Grid";
import KeyStat from "./KeyStat";
import {getUser} from "../../utils/api";

const DashboardPage = () => {
  const[ user, setUser] = useState('');
  useEffect(() => {
    const u = getUser();
    setUser(u);
  },[]);
  return (
    <PageContainer style={{textAlign: 'start'}}>
      <Typography variant={"h4"} style={{marginBottom: 16}}>Hello {user && user.username}!</Typography>
      <Grid container spacing={6}>
        <Grid item xs={5}>
          <Typography variant={"h5"} className={styles.semiBold}>Alerts</Typography>
          <Typography variant={"h6"} style={{marginTop: 16}} className={styles.semiBold}>No active alerts</Typography>
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