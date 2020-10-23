import React from "react";
import Card from "@material-ui/core/Card";
import styles from "./RoomDetailsPage.module.scss";
import {Divider, Typography} from "@material-ui/core";
import PropTypes from 'prop-types';
import {getRoomTypeProp} from "../../utils/utils";


const RoomDetailsCard = ({room}) => {
  return (
    <Card className={styles.card}>
      <div className={styles.cardContent}>
        <Typography variant={"h6"} className={styles.semiBold}>Room details</Typography>
        <Divider light={true} className={styles.divider}/>
        <Typography variant={"body1"} className={styles.semiBold}>Building {room.building}</Typography>
        <Typography variant={"body2"} className={styles.medium} color="textSecondary">Floor {room.floor}</Typography>
        <Divider light={true} className={styles.divider}/>
        <div className={styles.row}>
          <Typography variant={"body1"} className={styles.semiBold}>{getRoomTypeProp(room, 'displayName')}</Typography>
          <Typography
            variant={"body2"}
            className={styles.semiBold}>
            Cleaning time: {getRoomTypeProp(room, 'cleaningTime')} min
          </Typography>
        </div>
        <Typography variant={"body2"} className={styles.medium}
                    color="textSecondary">Cleaning {getRoomTypeProp(room, 'frequency')} times / week
        </Typography>
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

export default RoomDetailsCard;