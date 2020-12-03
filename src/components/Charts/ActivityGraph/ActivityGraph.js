import React from 'react';
import PropTypes from "prop-types";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./ActivityGraph.module.scss";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import moment from "moment";
import {LTTB} from "downsample/methods/LTTB";

function pad(n){return n<10 ? '0'+n : n}

const ActivityGraph = ({activity, lastCleaned, loading}) => {
  console.log(lastCleaned)
  const start = moment(lastCleaned).valueOf();
  const step = 20000;
  let formattedData = [];
  formattedData.push({
    y: activity[0],
    x: new Date(start)
  });
  for (let i = 1; i < activity.length; i++) {
    formattedData.push({
      y: activity[i],
      x: new Date(start + step * i)
    });
  }
  formattedData = LTTB(formattedData, 400);
  formattedData.forEach((point) => {
    point.x = pad(point.x.getHours()) + ':' + pad(point.x.getMinutes());
  })
  return (
    <div style={{margin: '16px 0 32px'}}>
      <Paper className={styles.container}>
        <Typography variant={"h6"} className={styles.title}>Room activity since last cleaning</Typography>
        <>
          {loading ? <CircularProgress color={"secondary"} style={{margin: 'auto'}}/> :
            <ResponsiveContainer width="100%" height={400} className={styles.chart}>
              {formattedData.length === 0 ?
                <Typography variant={"h6"} className={styles.title} style={{textAlign: 'center'}}>No cleaning
                  events</Typography>
                :
                <LineChart data={formattedData}>
                  <XAxis dataKey="x"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend/>
                  <Line type="monotone" dataKey="y" name="Activity" stroke="#8884d8"
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

ActivityGraph.propTypes = {
  loading: PropTypes.bool.isRequired,
  activity: PropTypes.array.isRequired,
  lastCleaned: PropTypes.string.isRequired
};

export default ActivityGraph;