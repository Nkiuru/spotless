import React from 'react';
import PropTypes from "prop-types";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./CleaningDuration.module.scss";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import {ROOM_TYPES} from "../../../utils/constants";

const CleaningDuration = ({reports, loading}) => {
  let data = reports.map((report) => {
    return report.room && report.room['room_type'];
  })
  const counts = {};
  data.forEach((x) => {
    counts[x] = reports.filter((report) => {
      if (typeof x === 'undefined') {
        return x === report.room;
      } else {
        if (!report.room) {
          return false;
        }
        return x === report.room['room_type'];
      }
    });
  });
  const formattedReports = [];
  const und = counts['undefined'];
  if (und) {
    formattedReports.push({
      type: 'No type',
      amount: Math.round(und.reduce((acc, report) => {
        return acc + report['cleaning_duration_seconds'];
      }, 0) / und.length),
      estimated: 0
    });
    delete counts['undefined'];
  }

  Object.keys(counts).forEach((x) => {
    formattedReports.push({
      type: ROOM_TYPES[x].displayName,
      amount: Math.round(counts[x].reduce((acc, report) => {
        return acc + report['cleaning_duration_seconds'];
      }, 0) / counts[x].length),
      estimated: ROOM_TYPES[x].cleaningTime * 60
    });
  });

  return (
    <div style={{height: '100%'}}>
      <Paper className={styles.container}>
        <Typography variant={"h6"} className={styles.title}>Cleaning duration by room type</Typography>
        <>
          {loading ? <CircularProgress color={"secondary"} style={{margin: 'auto'}}/> :
            <ResponsiveContainer width="100%" height={400} className={styles.chart}>
              {formattedReports.length === 0 ?
                <Typography variant={"h6"} className={styles.title} style={{textAlign: 'center'}}>No cleaning
                  events</Typography>
                :
                <BarChart data={formattedReports}>
                  <XAxis dataKey="type"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend/>
                  <Bar dataKey="amount" name="Actual time" fill="#8884d8" unit=" seconds"/>
                  <Bar dataKey="estimated" name="Estimated time" fill="#82ca9d" unit=" seconds"/>
                </BarChart>
              }
            </ResponsiveContainer>
          }
        </>
      </Paper>
    </div>
  )
}

CleaningDuration.propTypes = {
  loading: PropTypes.bool.isRequired,
  reports: PropTypes.array.isRequired
};

export default CleaningDuration;