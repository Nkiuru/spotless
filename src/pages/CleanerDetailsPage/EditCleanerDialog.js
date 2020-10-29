import * as Yup from "yup";
import {editCleaner} from "../../utils/api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import React from "react";
import ShiftPicker from "../../components/ShiftPicker/ShiftPicker";

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
                <ShiftPicker/>
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
