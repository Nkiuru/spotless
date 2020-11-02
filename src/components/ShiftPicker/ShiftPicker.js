import {Grid, MenuItem, Typography} from "@material-ui/core";
import styles from "./ShiftPicker.module.scss";
import {Field} from "formik";
import {Select} from "formik-material-ui";
import React from "react";


const ShiftPicker = () => {
  return (
    <Grid item xs className={styles.row}>
      <div>
        <Typography variant={"body1"}>Shift start</Typography>
        <div className={styles.row}>
          <Field component={Select} name="startHour">
            {[...Array(24).keys()].map((number) => {
              const num = number.toString().padStart(2, '0')
              return <MenuItem key={number} value={num}>{num}</MenuItem>;
            })}
          </Field>
          <Typography variant={"h6"}>:</Typography>
          <Field component={Select} name="startMinutes">
            {['00', 15, 30, 45].map((number) => {
              return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
            })}
          </Field>
        </div>
      </div>
      <Typography variant={"h4"} style={{margin: '0 16px'}}>-</Typography>
      <div>
        <Typography variant={"body1"}>Shift end</Typography>
        <div className={styles.row}>
          <Field component={Select} name="endHour">
            {[...Array(23).keys()].map((number) => {
              return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
            })}
          </Field>
          <Typography variant={"body1"}>:</Typography>
          <Field component={Select} name="endMinutes">
            {['00', 15, 30, 45].map((number) => {
              return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
            })}
          </Field>
        </div>
      </div>
    </Grid>
  )
}

export default ShiftPicker;