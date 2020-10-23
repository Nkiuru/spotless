import React, {useEffect, useState} from "react";
import {assignRoomsToCleaner, getCleaners} from "../../utils/api";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

export const AssignCleanerDialog = ({open, setOpen, selected, setSnackOpen, onClose}) => {
  const [options, setOptions] = useState([]);
  const [openSelect, setOpenSelect] = useState(false);
  const [cleaner, setCleaner] = useState(null);
  const loading = openSelect && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const clnrs = await getCleaners();

      if (active) {
        setOptions(clnrs);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

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
        <Autocomplete
          open={openSelect}
          onOpen={() => {
            setOpenSelect(true);
          }}
          onClose={() => {
            setOpenSelect(false);
          }}
          style={{width: 300}}
          getOptionLabel={(option) => option.name || ''}
          options={options}
          loading={loading}
          value={cleaner}
          onChange={(event, newValue) => {
            console.log(newValue)
            setCleaner(newValue)
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cleaner"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20}/> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

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
