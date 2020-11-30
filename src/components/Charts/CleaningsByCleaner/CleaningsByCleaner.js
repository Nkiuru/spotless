import React from 'react';
import PropTypes from "prop-types";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart
} from 'recharts';
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./CleaningsByCleaner.module.scss";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";

const CleaningsByCleaner = ({reports, loading}) => {
  let data = reports.map((report) => {
    return report['cleaner_name'];
  })
  const counts = {};
  data.forEach((x) => {
    counts[x] = (counts[x] || 0) + 1;
  });
  const formattedReports = [];
  Object.keys(counts).forEach((x) => {
    formattedReports.push({
      cleaner: x,
      amount: counts[x]
    });
  });

  return (
    <div style={{height: '100%'}}>
      <Paper className={styles.container}>
        <Typography variant={"h6"} className={styles.title}>Cleanings per cleaner</Typography>
        <>
          {loading ? <CircularProgress color={"secondary"} style={{margin: 'auto'}}/> :
            <ResponsiveContainer width="100%" height={400} className={styles.chart}>
              {formattedReports.length === 0 ?
                <Typography variant={"h6"} className={styles.title} style={{textAlign: 'center'}}>No cleaning events</Typography>
                :
                <BarChart data={formattedReports}>
                  <XAxis dataKey="cleaner"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend/>
                  <Bar dataKey="amount" name="Cleaning events" fill="#8884d8"/>
                </BarChart>
              }

            </ResponsiveContainer>
          }
        </>
      </Paper>
    </div>
  )
}

CleaningsByCleaner.propTypes = {
  loading: PropTypes.bool.isRequired,
  reports: PropTypes.array.isRequired
};

export default CleaningsByCleaner;