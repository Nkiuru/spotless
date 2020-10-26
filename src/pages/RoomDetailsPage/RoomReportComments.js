import React from 'react';
import styles from './RoomDetailsPage.module.scss';
import {Divider, Typography} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import moment from 'moment';
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles({
  root: {
    lineHeight: '200%'
  },
});
const CommentsList = ({reports}) => {
  const classes = useStyles();

  return (
    <Card className={styles.comments}>
      <div className={styles.cardContent}>
        <Typography variant={"h6"} className={styles.semiBold} style={{marginBottom: 16}}>Cleaner comments:</Typography>
        {reports.length > 0 ? (
          reports.reduce((result, report) => {
            const showReport = report.comments !== '';
            if (showReport) {
              const time = moment(report['cleaning_time']);
              result.push(
                <div key={report['_id']} className={styles.comment}>
                  <Divider />
                  <Typography variant={"h6"} className={classes.root}>{time.format('D MMM, YYYY')}</Typography>
                  <Typography variant={"h6"} className={[styles.semiBold, styles.author, classes.root].join(' ')}>{report['cleaner_name']}</Typography>
                  <Typography variant={"body1"} className={classes.root}>{report.comments}</Typography>
                </div>
              );
            }
            return result;
          }, [])
        ) :
        <Typography variant={"body1"} className={styles.semiBold}>No comments</Typography>
        }
      </div>
    </Card>
  );
}

export default CommentsList;