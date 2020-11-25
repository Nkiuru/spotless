import React from "react";
import PropTypes from "prop-types";
import styles from "./DashboardPage.module.scss";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import {UNCLEANED} from "../../utils/constants";
import {ArrowForward} from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import {useHistory} from "react-router-dom";
import moment from "moment";

const Alerts = ({reports, loading}) => {
  const history = useHistory();
  const today = moment();
  const filtered = reports.filter((report) => {
    return report.overview === UNCLEANED && today.isSame(report['cleaning_time'], 'date');
  });

  const openReport = (id) => {
    history.push({
      pathname: `/rooms/reports/${id}`,
      state: {id}
    })
  }
  return (
    <div className={styles.alerts}>
      {loading ? <CircularProgress size={20} style={{margin: 'auto'}}/> :
        <>
          {filtered.map((report) => (
            <div key={report['_id']} className={styles.alert} onClick={() => {
              openReport(report['_id']);
            }}>
              <Grid container direction={"row"} alignItems={"center"} justify={"space-between"}>
                <Grid item>
                  <Typography variant={"h6"} className={styles.semiBold}>{report['room_name']},
                    Floor {report.floor}</Typography>
                  <Typography variant={"body2"} className={styles.semiBold} style={{lineHeight: '24px'}}
                              color="textSecondary">{report['cleaner_name']}: {report.comments}</Typography>
                </Grid>
                <Grid item>
                  <ArrowForward color={"action"} style={{fontSize: '1.75rem'}}/>
                </Grid>
              </Grid>
            </div>
          ))}
          {filtered.length === 0 &&
          <Typography variant={"h6"} style={{marginTop: 16}} className={styles.semiBold}>No recent alerts</Typography>
          }
        </>
      }
    </div>
  );
}

Alerts.propTypes = {
  reports: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
}

export default Alerts;