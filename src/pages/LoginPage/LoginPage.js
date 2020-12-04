import React from 'react';
import PageContainer from "../../containers/PageContainer";
import {TextField} from "formik-material-ui";
import {Formik, Form, Field} from "formik";
import {Button, Grid, Typography} from "@material-ui/core";
import * as Yup from "yup";
import {authenticate} from "../../utils/api";
import {useHistory} from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import styles from './LoginPage.module.scss';
import logo from "../../assets/web_logo.png";

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

const LoginPage = () => {
  const history = useHistory();

  const initialValues = {
    username: '',
    password: ''
  }

  const handleSubmit = (vars, {setSubmitting}) => {
    console.log(vars)
    authenticate(vars.username, vars.password);
    history.push('/dashboard');
  }

  return (
    <PageContainer noToolbar>
      <Grid container direction={"row"} spacing={2} className={styles.content}>
        <Grid item xs={12}>
          <img src={logo} alt="LeviTeZer" className={styles.img}/>
        </Grid>
        <Grid item xs={12}>
          <Paper variant={"elevation"} className={styles.form}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
              {({isSubmitting, resetForm, values}) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant={"h4"}>Login to Spotless</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        component={TextField}
                        autoFocus
                        variant={"outlined"}
                        margin="dense"
                        id="name"
                        label="Username"
                        type="text"
                        name="username"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        component={TextField}
                        variant={"outlined"}
                        margin="dense"
                        id="name"
                        label="Password"
                        type="password"
                        name="password"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Button type="submit" color="primary" variant={"contained"} className={styles.btn}>Sign in</Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default LoginPage;