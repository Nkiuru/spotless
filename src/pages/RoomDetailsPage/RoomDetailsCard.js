import React from "react";
import {ROOM_TYPES} from "../../utils/constants";
import Card from "@material-ui/core/Card";
import styles from "./RoomDetailsPage.module.scss";
import {Divider, Typography} from "@material-ui/core";
import PropTypes from 'prop-types';


export const RoomDetailsCard = ({room}) => {
  const getFrequency = () => {
    return room['room_type'] !== '<empty>' ? ROOM_TYPES[room['room_type']].frequency : '';
  }

  const getCleaningTime = () => {
    return room['room_type'] !== "<empty>" ? ROOM_TYPES[room['room_type']].cleaningTime : '';
  }
  return (
    <Card className={styles.card}>
      <div className={styles.cardContent}>
        <Typography variant={"h6"}>Room details</Typography>
        <Divider light={true} className={styles.divider}/>
        <Typography variant={"body1"} className={styles.semiBold}>Building {room.building}</Typography>
        <Typography variant={"body2"} className={styles.medium} color="textSecondary">Floor {room.floor}</Typography>
        <Divider light={true} className={styles.divider}/>
        <div className={styles.row}>
          <Typography variant={"body1"} className={styles.semiBold}>{room['room_type']}</Typography>
          <Typography variant={"body2"} className={styles.medium} color="textSecondary">Cleaning
            time: {getCleaningTime()}</Typography>
        </div>
        <Typography variant={"body2"} className={styles.medium}
                    color="textSecondary">Cleaning {getFrequency()} times /
          week</Typography>
        <Divider light={true} className={styles.divider}/>
        <div className={styles.row}>
          <Typography variant={"body1"} className={styles.semiBold}>Contamination index</Typography>
          <Typography variant={"body1"}
                      className={[styles.critical, styles.medium].join(' ')}>{room['contamination_index']}</Typography>
        </div>
      </div>
    </Card>
  );
}

RoomDetailsCard.propTypes = {
  room: PropTypes.object.isRequired
}