import React, {useEffect, useState} from 'react';
import PageContainer from "../../containers/PageContainer";
import {Button, Typography} from "@material-ui/core";
import styles from "./AdminPage.module.scss";
import Slider from "@material-ui/core/Slider";

const AdminPage = () => {
  const [simSpeed, setSimSpeed] = useState(10);

  useEffect(() => {
    //TODO: get simulation speed
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
      value: 1,
      label: '1'
    });
    return mark;
  }

  const updateSimSpeed = async () => {
    //await setSimulation(simSpeed);
  }

  return (
    <PageContainer style={{textAlign: 'start'}}>
      <Typography variant={"h5"}>Simulator</Typography>
      <div className={styles.slider}>
        <div className={styles.row}>
          <Typography id="discrete-slider" gutterBottom>
            Simulation speed
          </Typography>
          <Button variant={"text"} color={"primary"} onClick={updateSimSpeed}>
            Set
          </Button>
        </div>
        <Slider
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={null}
          min={1}
          marks={generateMarks()}
          value={simSpeed}
        />
      </div>
    </PageContainer>
  )
}

export default AdminPage;