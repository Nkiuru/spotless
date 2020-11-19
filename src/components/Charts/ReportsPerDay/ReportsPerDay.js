import React from 'react';
import PropTypes from "prop-types";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./ReportsPerDay.module.scss";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";

const ReportsPerDay = ({reports, loading}) => {
  let data = reports.map((report) => {
    return moment(report['cleaning_time']).format('DD.MM.YYYY');
  })
  const counts = {};
  data.forEach((x) => {
    counts[x] = (counts[x] || 0) + 1;
  });
  const formattedReports = [];
  Object.keys(counts).forEach((x) => {
    formattedReports.push({
      date: x,
      amount: counts[x]
    });
  });

  return (
    <div style={{height: '100%'}}>
      <Paper className={styles.container}>
        <Typography variant={"h6"} className={styles.title}>Cleaning events per day</Typography>
        {loading ? <CircularProgress color={"secondary"} style={{margin: 'auto'}}/> :
          <ResponsiveContainer width="100%" height={400} className={styles.chart}>
            <LineChart data={formattedReports}>
              <XAxis dataKey="date"/>
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Legend/>
              <Line type="monotone" dataKey="amount" name="Cleaning events" stroke="#8884d8" strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        }
      </Paper>
    </div>
  )
}

ReportsPerDay.propTypes = {
  loading: PropTypes.bool.isRequired,
  reports: PropTypes.array.isRequired
};

export default ReportsPerDay;