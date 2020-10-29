import * as Yup from "yup";
import {editCleaner} from "../../utils/api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Typography
} from "@material-ui/core";
import {Field, Form, Formik} from "formik";
import {Select, TextField} from "formik-material-ui";
import styles from "./CleanerDetailsPage.module.scss";
import React from "react";

const validationSchema = Yup.object({
  name: Yup.string().required()
});

const EditCleanerDialog = ({cleaner, open, setOpen, onSave}) => {
  const handleClose = () => {
    setOpen(false);
  }
  const start = cleaner['shift_start'].split(':');
  const end = cleaner['shift_end'].split(':');

  const initialValues = {
    name: cleaner.name,
    startHour: start.length > 0 ? start[0] : '',
    endHour: end.length > 0 ? end[0] : '',
    startMinutes: start.length > 0 ? start[1] : '',
    endMinutes: end.length > 0 ? end[1] : ''
  }

  const handleSubmit = async (vars, {setSubmitting}) => {
    const edited = vars;
    edited['_id'] = cleaner['_id'];
    edited['shift_start'] = `${vars.startHour.padStart(2, '0')}:${vars.startMinutes.padStart(2, '0')}`;
    edited['shift_end'] = `${vars.endHour.padStart(2, '0')}:${vars.endMinutes.padStart(2, '0')}`;
    const res = await editCleaner(edited);
    console.log(res);
    setSubmitting(false);
    setOpen(false);
    onSave();
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit cleaner</DialogTitle>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {({isSubmitting, resetForm, values}) => (
          <Form>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    name="name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs className={styles.row}>
                  <div>
                    <Typography variant={"body1"}>Shift start</Typography>
                    <div className={styles.row}>
                      <Field component={Select}
                             inputProps={{menuprops: {classes: {paper: styles.menu}}}}
                             name="startHour">
                        {[...Array(24).keys()].map((number) => {
                          const num = number.toString().padStart(2, '0')
                          return <MenuItem key={number} value={num}>{num}</MenuItem>;
                        })}
                      </Field>
                      <Typography variant={"h6"}>:</Typography>
                      <Field component={Select}
                             inputProps={{menuprops: {classes: {paper: styles.menu}}}}
                             name="startMinutes">
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
                      <Field component={Select}
                             inputProps={{menuprops: {classes: {paper: styles.menu}}}}

                             name="endHour">
                        {[...Array(23).keys()].map((number) => {
                          return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
                        })}
                      </Field>
                      <Typography variant={"body1"}>:</Typography>
                      <Field component={Select}
                             inputProps={{menuprops: {classes: {paper: styles.menu}}}}
                             name="endMinutes">
                        {['00', 15, 30, 45].map((number) => {
                          return <MenuItem key={number} value={number.toString()}>{number}</MenuItem>;
                        })}
                      </Field>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default EditCleanerDialog;
