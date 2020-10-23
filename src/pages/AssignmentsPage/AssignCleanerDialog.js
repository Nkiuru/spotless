import React, {useEffect, useState} from "react";
import {assignRoomsToCleaner, getCleaners} from "../../utils/api";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import CleanerSelect from "../../components/CleanerSelect";

export const AssignCleanerDialog = ({open, setOpen, selected, setSnackOpen, onClose}) => {
  const [cleaner, setCleaner] = useState(null);

  const handleClose = () => {
    onClose();
    setOpen(false);
  }

  const handleSubmit = async () => {
    await assignRoomsToCleaner(selected, cleaner['_id'])
    console.log(cleaner);
    setSnackOpen(true);
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick={true}>
      <DialogTitle id="form-dialog-title">Select a cleaner</DialogTitle>
      <DialogContent>
        <CleanerSelect onChange={(event, newValue) => {
          setCleaner(newValue)
        }}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={cleaner === ''}>
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}
