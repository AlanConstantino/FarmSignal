import React, {useEffect, useState} from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Navbar from '../Navbar';
import auth from '../Auth';
import {Formik, Form, Field} from 'formik';
import {TextField} from 'formik-material-ui';
import {makeStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '4rem',
  },
  fieldItem: {
    marginTop: '1.5rem',
  },
  error: {
    textAlign: 'left',
    paddingLeft: '1.15em',
    paddingTop: '0.4rem',
    color: '#F44336',
    fontSize: '0.75em',
    fontFamily: 'Roboto',
  },
  subtitle: {
    color: 'grey',
  },
  bottom: {
    marginBottom: '3rem',
  },
}));


function Settings() {
  const classes = useStyles();
  const [
    usernameTakenError,
    setUsernameTakenError,
  ] = useState({display: 'none'});
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [userData, setUserData] = useState([]);
  const [hasUpdated, setHasUpdated] = useState(false);

  const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  useEffect(() => {
    // eslint-disable-next-line
    const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${localStorage.getItem('uid')}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    };
    fetch(url, options)
        .then(async (res) => {
          if (res.status !== 200) {
            throw await res.json();
          }
          return res.json();
        })
        .then((data) => {
          setUserData(...data);
        })
        .catch((err) => {
          console.log(err);
        });
    return () => {
      setHasUpdated(false);
    };
  }, [hasUpdated]);

  return (
    <>
      {auth.isAuthenticated && <Navbar />}
      <Container maxWidth="xs" style={{paddingTop: '4rem'}}>
        <Grid container direction="column" spacing={3}>
          <Typography align="center" variant="h4">Settings</Typography>
          <Grid item>
            <Divider />
          </Grid>
          <Snackbar
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            open={openSuccess}
            autoHideDuration={5000}
            onClose={handleSuccessClose}
          >
            <Alert onClose={handleSuccessClose} severity="success">
              Updated successfully!
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            open={openError}
            autoHideDuration={5000}
            onClose={handleSuccessClose}
          >
            <Alert onClose={handleErrorClose} severity="error">
              Error updating!
            </Alert>
          </Snackbar>
          <Grid item className={classes.bottom}>
            <Typography align="left" variant="subtitle1">
              Update Profile
            </Typography>
            <Formik
              initialValues={{
                email: '',
                username: '',
                password: '',
                confirmPassword: '',
              }}
              validate={(values) => {
                const errors = {};

                const fieldIsEmpty = (field) => field === '';
                const allFieldsAreEmpty = (
                  fieldIsEmpty(values.email) &&
                  fieldIsEmpty(values.username) &&
                  fieldIsEmpty(values.password) &&
                  fieldIsEmpty(values.confirmPassword)
                );

                if (allFieldsAreEmpty) {
                  errors.email = 'At least one field has to be filled out.';
                  errors.username = (
                    'At least one field has to be filled out.'
                  );
                  errors.password = (
                    'At least one field has to be filled out.'
                  );
                  return errors;
                }

                // email validation
                const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                if (
                  !fieldIsEmpty(values.email) &&
                  !regex.test(values.email)
                ) {
                  errors.email = 'Invalid email address';
                }

                // username validation
                if (
                  !fieldIsEmpty(values.username) &&
                  values.username.length < 4
                ) {
                  errors.username = 'Username must be at least 4 characters.';
                }

                // password validation
                const regexNumber = /\d/g;
                const regexSpecialChars = /[!@#$%^&*-+=()]/;
                const regexCapitalLetter = /[A-Z]/;

                if (!fieldIsEmpty(values.password)) {
                  if (!regexNumber.test(values.password)) {
                    errors.password = 'Must contain at least 1 number!';
                  } else if (values.password.length <= 8) {
                    errors.password = 'Must be at least 8 characters!';
                  } else if (!regexSpecialChars.test(values.password)) {
                    errors.password = (
                    // eslint-disable-next-line
                      'Must contain at least 1 special character! (!@#$%^&*-+=())'
                    );
                  } else if (!regexCapitalLetter.test(values.password)) {
                    errors.password = 'Must contain at least 1 captial letter!';
                  } else if (values.password.includes(' ')) {
                    errors.password = 'Must not contain spaces.';
                  }
                }

                // confirmationPassword validation
                if ((values.password !== values.confirmPassword)) {
                  errors.confirmPassword = 'Passwords don\'t match';
                }

                return errors;
              }}
              onSubmit={(values, {resetForm}) => {
                // eslint-disable-next-line
                const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${localStorage.getItem('uid')}`;

                const json = {
                  username: values.username,
                  email: values.email,
                  password: values.password,
                };

                let formBody = [];
                for (const property in json) {
                  if (Object.prototype.hasOwnProperty.call(json, property)) {
                    const encodedKey = encodeURIComponent(property);
                    const encodedValue = encodeURIComponent(json[property]);
                    formBody.push(encodedKey + '=' + encodedValue);
                  }
                }
                formBody = formBody.join('&');

                const options = {
                  method: 'PUT',
                  headers: {
                  // eslint-disable-next-line
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  },
                  credentials: 'include',
                  body: formBody,
                };

                fetch(url, options)
                    .then(async (res) => {
                      // if status code is not 200, throw an error, else return
                      // the response text
                      if (res.status !== 200) {
                        throw await res.json();
                      } else {
                        return res.json();
                      }
                    })
                    .then((data) => {
                      if (data.output === 'success') {
                        setUsernameTakenError({display: 'none'});
                        setOpenSuccess(true);
                        setHasUpdated(!hasUpdated);
                      }
                    })
                    .catch((err) => {
                      setOpenError(true);
                      const errorKeyExists = 'error' in err;
                      const duplicateUsernameError = (
                        err.error.includes('user_name_UNIQUE')
                      );

                      // if 'error' key exists in err object and the username
                      // is already in use, display error
                      if (errorKeyExists && duplicateUsernameError) {
                        setUsernameTakenError({display: 'block'});
                      }

                      console.log(err);
                    })
                    // regardless of what happens, reset form
                    .finally(() => {
                      resetForm();
                    });
              }}
            >
              <Form>
                <Field
                  component={TextField}
                  name="email"
                  type="email"
                  label={(
                    userData.hasOwnProperty('email_address') &&
                    userData.email_address
                  )}
                  placeholder="Update Email"
                  fullWidth
                  variant="outlined"
                  className={classes.fieldItem}
                />
                <Field
                  component={TextField}
                  name="username"
                  type="username"
                  placeholder="Update Username"
                  label={(
                    userData.hasOwnProperty('user_name') &&
                    userData.user_name
                  )}
                  fullWidth
                  variant="outlined"
                  helperText="Must have at least 4 characters."
                  className={classes.fieldItem}
                />
                <Typography
                  className={classes.error}
                  style={usernameTakenError}
                  variant="inherit"
                >
                  Username is already taken.
                </Typography>
                <Field
                  component={TextField}
                  name="password"
                  type="password"
                  label="New Password"
                  fullWidth
                  helperText="Must contain at least 1 number, 1 captial,
                    1 special character, and has to be 8 characters long!"
                  variant="outlined"
                  className={classes.fieldItem}
                />
                <Field
                  component={TextField}
                  name="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  fullWidth
                  variant="outlined"
                  helperText="Must match password."
                  className={classes.fieldItem}
                />
                <Button
                  variant="contained"
                  className={classes.fieldItem}
                  type="submit"
                  color="primary"
                  fullWidth
                >
                  Update
                </Button>
              </Form>
            </Formik>
          </Grid>
        </Grid>
      </ Container>
    </>
  );
}

export default Settings;
