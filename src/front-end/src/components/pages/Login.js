import React from 'react';
import {Link} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {Formik} from 'formik';
import auth from '../Auth';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(3, 0, 0),
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

function Login(props) {
  const classes = useStyles();
  const initialValues = {
    username: '',
    password: '',
    loginError: '',
  };

  const submitForm = (values, errors) => {
    const url = `${process.env.REACT_APP_BASE_API_URL}/api/login`;

    const json = {
      username: values.username,
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
          if (res.status !== 200) {
            console.log('not successful');
            throw await res.json();
          }
          return res.json();
        })
        .then((data) => {
          // console.log(data);
          auth.login(() => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('uid', data.UserID);
            localStorage.setItem('isLoggedIn', true);
            props.history.push('/home');
          });
        })
        .catch((err) => {
          errors.setStatus('The username or password you entered is incorrect');
          console.log(err);
        });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitForm}
    >
      {(formik) => {
        const {
          values,
          status,
          handleChange,
          handleSubmit,
        } = formik;
        return (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Typography component="h1" variant="h4">
                Log in
              </Typography>
              <form onSubmit={handleSubmit} className={classes.form}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      type="text"
                      name="username"
                      onChange={handleChange}
                      value={values.username}
                      label="User Name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      type="password"
                      name="password"
                      onChange={handleChange}
                      value={values.password}
                      label="Password"
                      helperText= {
                        <Link to="/password-recovery">
                          Forgot Password?
                        </Link>
                      }
                    />
                  </Grid>
                </Grid>
                <div className="error">
                  <Typography className={classes.error}>
                    {status}
                  </Typography>
                </div>
                <div className="button-container">
                  <Button
                    variant="contained"
                    fullWidth
                    className={classes.button}
                    type="submit"
                    color="primary"
                  >
                    LOG IN
                  </Button>
                </div>
              </form>
            </div>
          </Container>
        );
      }}
    </Formik>
  );
}

export default Login;
