import React, {useEffect, useState} from 'react';
import PageContainer from "../../containers/PageContainer";
import {Button, Divider, Typography} from "@material-ui/core";
import styles from "./AdminPage.module.scss";
import Slider from "@material-ui/core/Slider";
import {createRoom, getSimulatorSettings, resetSimulation, setSimulation} from "../../utils/api";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Card from "@material-ui/core/Card";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel";
import {ROOM_TYPES} from "../../utils/constants";

const AdminPage = () => {
  const [simSpeed, setSimSpeed] = useState(10);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [snackText, setSnackText] = useState('Simulation speed updated');

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };
  useEffect(() => {
    getSimulatorSettings()
      .then((settings) => {
        setSimSpeed(settings['simulator_speed']);
        setLoading(false);
      })
  }, [])
  const valuetext = (value) => {
    return `${value}x`;
  }

  const generateMarks = () => {
    const mark = [];
    for (let i = 5; i <= 100; i += 5) {
      mark.push({
        value: i,
        label: i
      });
    }
    mark.unshift({
      value: 0.1,
      label: '0.1'
    }, {
      value: 0.5,
    }, {
      value: 1,
    });

    return mark;
  }

  const updateSimSpeed = () => {
    setSimulation(simSpeed)
      .then(() => {
        setSnackText('Simulation speed updated');
        setSnackOpen(true);
      }).catch(() => setSnackOpen(true));
  }
  const handleChange = (event, newValue) => {
    setSimSpeed(newValue);
  };

  const handleInputChange = (event) => {
    setSimSpeed(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (simSpeed < 0.1) {
      setSimSpeed(0);
    } else if (simSpeed > 1000) {
      setSimSpeed(1000);
    }
  };

  const handleConfirmClose = () => {
    setSnackText('Simulation reset');
    setOpen(false);
  };

  const generate = async () => {
    return;
    setGenerating(true);
    const hospitalId = "5fb5226d3d8e1d45045cfc3f";
    const roomType = ROOM_TYPES.WAITING_ROOM.key;
    const roomName = 'B20';
    const building = 1;
    const floor = 1;
    let start = 0;
    const end = 0;
    for (start;start <= end; start++) {
      const name = roomName + start;
      await createRoom(hospitalId, name, roomType, building, floor);
      await new Promise(r => setTimeout(r, 1000));
      setProgress(start);
    }
    setGenerating(false);
  }

  return (
    <PageContainer style={{textAlign: 'start'}}>
      <Typography variant={"h5"}>Simulator</Typography>
      {loading ? <CircularProgress style={{margin: "auto"}}/> :
        <Grid container>
          <Grid container className={styles.slider}>
            <Grid item xs>
              <div className={styles.row}>
                <Typography id="discrete-slider" gutterBottom>
                  Simulation speed
                </Typography>
                <Button variant={"text"} color={"primary"} onClick={updateSimSpeed}>
                  Set
                </Button>
              </div>
            </Grid>
            <Grid container spacing={2} direction={"row"}>
              <Grid item style={{flex: 1}}>
                <Slider
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={null}
                  min={0.1}
                  marks={generateMarks()}
                  onChange={handleChange}
                  value={simSpeed}
                />
              </Grid>
              <Grid item>
                <Input
                  style={{width: 42}}
                  value={simSpeed}
                  margin="dense"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                    step: 5,
                    min: 0,
                    max: 1000,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{display: "flex", marginLeft: 32}} xs>
            <Card className={styles.card}>
              <div className={styles.cardContent}>
                <Typography variant={"h6"} className={styles.semiBold}>Simulator actions</Typography>
                <Divider className={styles.divider} light={true}/>
                <Button onClick={() => {
                  setOpen(true);
                }} variant={"contained"} color={"secondary"}>Reset simulated rooms</Button>
                <Button disabled={generating} onClick={() => {
                  generate();
                }} variant={"contained"} color={"primary"} style={{float: "right"}}>Generate rooms</Button>
              </div>
            </Card>
          </Grid>
        </Grid>
      }
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}
                anchorOrigin={{vertical: "top", horizontal: "center"}}>
        <Alert variant={"filled"} severity="success" onClose={handleSnackClose}>
          {snackText}
        </Alert>
      </Snackbar>
      {generating && <CircularProgressWithLabel value={progress} style={{margin: "auto"}}/>}
      <Dialog
        open={open}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Reset simulated rooms</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to reset the rooms?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={async () => {
            handleConfirmClose();
            resetSimulation().then(() => setSnackOpen(true)).catch(() => setSnackOpen(true));
          }} color="primary" autoFocus>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default AdminPage;