import {useState} from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import {Formik, Form, Field} from 'formik';
import {TextField} from 'formik-material-ui';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import auth from '../Auth';

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
}));

function Signup(props) {
  const classes = useStyles();
  const [
    usernameTakenError,
    setUsernameTakenError,
  ] = useState({display: 'none'});
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

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

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
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
              Error signing up!
        </Alert>
      </Snackbar>
      <Typography component="h1" variant="h4">
        Sign-up
      </Typography>
      <Formik
        initialValues={{
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
        }}
        validate={(values) => {
          // you can't extract each validation step into it's own function
          // because it'll cause an error for some godforsaken reason so we're
          // left with this mess... fml...
          const errors = {};

          // email validation
          const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
          if (!values.email) {
            errors.email = 'Required';
          } else if (!regex.test(values.email)) {
            errors.email = 'Invalid email address';
          }

          // username validation
          if (!values.username) {
            errors.username = 'Invalid username.';
          } else if (values.username.length < 4) {
            errors.username = 'Username must be at least 4 characters.';
          }

          // password validation
          const regexNumber = /\d/g;
          const regexSpecialChars = /[!@#$%^&*-+=()]/;
          const regexCapitalLetter = /[A-Z]/;
          if (!values.password) {
            errors.password = 'Required';
          } else if (!regexNumber.test(values.password)) {
            errors.password = 'Must contain at least 1 number!';
          } else if (values.password.length <= 8) {
            errors.password = 'Must be at least 8 characters!';
          } else if (!regexSpecialChars.test(values.password)) {
            errors.password = (
              'Must contain at least 1 special character! (!@#$%^&*-+=())'
            );
          } else if (!regexCapitalLetter.test(values.password)) {
            errors.password = 'Must contain at least 1 captial letter!';
          } else if (values.password.includes(' ')) {
            errors.password = 'Must not contain spaces.';
          }

          // confirmationPassword validation
          if (!values.confirmPassword) {
            errors.confirmPassword = 'Required';
          } else if (values.password !== values.confirmPassword) {
            errors.confirmPassword = 'Passwords don\'t match';
          }

          return errors;
        }}
        onSubmit={(values, {resetForm}) => {
          const url = `${process.env.REACT_APP_BASE_API_URL}/api/register`;

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
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            credentials: 'include',
            body: formBody,
          };

          fetch(url, options)
              .then(async (res) => {
                // if status code is not 200, throw error with server response
                if (res.status !== 200) {
                  throw await res.json();
                }
                // hide the username is already in use error
                setUsernameTakenError({display: 'none'});
                // if no error, return json
                return res.json();
              })
              .then((data) => {
                // login user and store data in localStorage
                auth.login(() => {
                  setOpenSuccess(true);
                  localStorage.setItem('uid', data.UserID);
                  localStorage.setItem('token', data.token);
                  localStorage.setItem('isLoggedIn', true);
                  props.history.push('/home');
                });
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
              .finally(() => {
                // regardless of what happens, reset form
                resetForm();
              });
        }}
      >
        <Form>
          <Field
            component={TextField}
            name="email"
            type="email"
            label="Email"
            required
            fullWidth
            variant="outlined"
            className={classes.fieldItem}
          />
          <Field
            component={TextField}
            name="username"
            type="username"
            label="Username"
            helperText="Must have at least 4 characters."
            required
            fullWidth
            variant="outlined"
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
            label="Password"
            helperText="Must contain at least 1 number, 1 captial,
              1 special character, and has to be 8 characters long!"
            required
            fullWidth
            variant="outlined"
            className={classes.fieldItem}
          />
          <Field
            component={TextField}
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            helperText="Must match password."
            required
            fullWidth
            variant="outlined"
            className={classes.fieldItem}
          />
          <Button
            variant="contained"
            className={classes.fieldItem}
            type="submit"
            color="primary"
            fullWidth
          >
            Submit
          </Button>
        </Form>
      </Formik>
    </Container>
  );
}

export default Signup;
