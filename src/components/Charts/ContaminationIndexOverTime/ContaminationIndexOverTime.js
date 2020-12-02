import React from 'react';
import PropTypes from "prop-types";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./ContaminationIndexOverTime.module.scss";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import moment from "moment";

const ContaminationIndexOverTime = ({reports, loading}) => {
  let data = reports.map((report) => {
    return moment(report['cleaning_time']).format('DD.MM.YYYY');
  });
  const counts = {};
  data.forEach((x) => {
    const date = moment(x, 'DD.MM.YYYY');
    counts[x] = reports.filter((report) => {
      return moment(report['cleaning_time']).isSame(date, 'date');
    });
  });
  const formattedReports = [];
  Object.keys(counts).forEach((x) => {
    formattedReports.push({
      date: x,
      contamination: Math.round(counts[x].reduce((acc, report) => {
        return acc + report['contamination_index'];
      }, 0) / counts[x].length)
    });
  });

  return (
    <div style={{height: '100%'}}>
      <Paper className={styles.container}>
        <Typography variant={"h6"} className={styles.title}>Contamination index (before cleaning) over time</Typography>
        <>
          {loading ? <CircularProgress color={"secondary"} style={{margin: 'auto'}}/> :
            <ResponsiveContainer width="100%" height={400} className={styles.chart}>
              {formattedReports.length === 0 ?
                <Typography variant={"h6"} className={styles.title} style={{textAlign: 'center'}}>No cleaning
                  events</Typography>
                :
                <LineChart data={formattedReports}>
                  <XAxis dataKey="date"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend/>
                  <Line type="monotone" dataKey="contamination" name="Contamination index" stroke="#8884d8"
                        strokeWidth={2}/>
                </LineChart>
              }

            </ResponsiveContainer>
          }
        </>
      </Paper>
    </div>
  )
}

ContaminationIndexOverTime.propTypes = {
  loading: PropTypes.bool.isRequired,
  reports: PropTypes.array.isRequired
};

export default ContaminationIndexOverTime;