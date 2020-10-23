import React, {useState} from "react";
import Card from "@material-ui/core/Card";
import styles from "./RoomDetailsPage.module.scss";
import StatusDot from "../../components/StatusDot";
import PropTypes from 'prop-types';
import {Button, IconButton, Typography} from "@material-ui/core";
import CleanerSelect from "../../components/CleanerSelect";
import moment from "moment";
import {ClearOutlined} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import {assignRoom, unAssignRoom} from "../../utils/api";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";


const RoomCleanerCard = ({room, cleaner, setCleaner}) => {
  const [newCleaner, setNewCleaner] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackText, setSnackText] = useState('');

  const hasCleaner = Object.keys(cleaner).length !== 0;
  console.log(cleaner);
  const getColor = () => {
    if (!hasCleaner) return 'neutral';
    const shiftStart = moment(cleaner['shift_start'], 'HH:mm');
    const shiftEnd = moment(cleaner['shift_end'], 'HH:mm');
    const isBetween = moment().isBetween(shiftStart, shiftEnd);
    return isBetween ? 'good' : 'critical';
  }

  const removeCleanerAssignment = async () => {
    await unAssignRoom(room['_id'], cleaner['_id']);
    setCleaner({});
    setSnackText('Cleaner unassigned');
    setSnackOpen(true);
  }

  const assignNewCleaner = async () => {
    await assignRoom(room['_id'], newCleaner['_id']);
    setCleaner(newCleaner);
    setNewCleaner({});
    setSnackText('Cleaner assigned');
    setSnackOpen(true);
  }

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <Card className={styles.card} style={{height: 'min-content'}}>
      <div className={styles.cardContent}>
        <div className={styles.row}>
          <StatusDot variant={getColor()} size={'tiny'} tooltip={'Cleaner name'}/>
          {hasCleaner ? (
              <>
                <Typography style={{marginLeft: 16}} variant={'h6'}
                            className={styles.semiBold}>{cleaner.name}</Typography>
                <Tooltip title="Remove assignment">
                  <IconButton style={{marginLeft: 'auto'}} size={"small"} onClick={removeCleanerAssignment}>
                    <ClearOutlined/>
                  </IconButton>
                </Tooltip>
              </>
            )
            :
            <CleanerSelect onChange={(event, newValue) => setNewCleaner(newValue)}/>
          }
        </div>
        {newCleaner && Object.keys(newCleaner).length !== 0 && (
          <>
            <Divider className={styles.divider}/>
            <div className={styles.row}>
              <Button onClick={assignNewCleaner} variant={"contained"} color={"secondary"}
                      className={styles.btn}>Assign</Button>
            </div>
          </>
        )}
      </div>
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}
                anchorOrigin={{vertical: "top", horizontal: "center"}}>
        <Alert variant={"filled"} severity="success" onClose={handleSnackClose}>{snackText}</Alert>
      </Snackbar>
    </Card>
  )
}

RoomCleanerCard.propTypes = {
  room: PropTypes.object.isRequired,
  cleaner: PropTypes.object
}

export default RoomCleanerCard;