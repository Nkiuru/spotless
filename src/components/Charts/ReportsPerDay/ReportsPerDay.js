import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {getReports} from "../../../utils/api";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./ReportsPerDay.module.scss";

const ReportsPerDay = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports()
      .then((reports) => {
        let data = reports.map((report) => {
          return moment(report['cleaning_time']).format('DD.MM.YYYY');
        })
        const counts = {};
        data.forEach((x) => {
          counts[x] = (counts[x] || 0) + 1;
        });
        const array = [];
        Object.keys(counts).forEach((x) => {
          array.push({
            date: x,
            amount: counts[x]
          });
        });
        setReports(array);
        setLoading(false);
      });
  }, []);
  return (
    <div style={{height:'100%'}}>
      {loading ? <CircularProgress color={"secondary"}/> :
        <ResponsiveContainer width="100%" height={400} className={styles.chart}>
          <LineChart data={reports}>
            <XAxis dataKey="date"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="amount" name="Cleaning events" stroke="#8884d8"/>
          </LineChart>
        </ResponsiveContainer>
      }
    </div>
  )
}

ReportsPerDay.propTypes = {};

export default ReportsPerDay;