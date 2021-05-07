import {useState} from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import {TextField} from 'formik-material-ui';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Formik, Form, Field} from 'formik';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(15),
  },
  form: {
    marginTop: theme.spacing(4),
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

function PasswordRecovery(props) {
  const classes = useStyles();
  const [status, setStatus] = useState(false);

  return (
    <Container component="main" maxWidth="xs">
      <Container component="main"
        maxWidth="xs"
        className={classes.container}
      >
        <Typography component="h1" variant="h4">
            Recover Password
        </Typography>
        <Typography
          variant="subtitle1"
          className={classes.form}
        >
          Don't worry, it happens to the best of us
        </Typography>
        <Formik
          initialValues={{
            username: '',
          }}
          validate={(values) => {
            const errors = {};

            if (!values.username) {
              errors.username = 'Please enter a user name.';
            }

            return errors;
          }}
          onSubmit={(values, {resetForm}) => {
            // eslint-disable-next-line max-len
            const url = `${process.env.REACT_APP_BASE_API_URL}/api/passwordreset`;

            const json = {
              username: values.username,
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
                // eslint-disable-next-line max-len
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              },
              credentials: 'include',
              body: formBody,
            };

            fetch(url, options)
                .then(async (res) => {
                  if (res.status !== 200) {
                    throw await res.json();
                  }
                  props.history.push('/sent-password-recovery');
                })
                .catch((err) => {
                  // eslint-disable-next-line max-len
                  setStatus('That username does not exist!');
                  console.log(err);
                  resetForm();
                });
          }}
        >
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Field
                  style={{marginTop: '1rem'}}
                  component={TextField}
                  name="username"
                  type="username"
                  label="Username"
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <div className="error">
              <Typography className={classes.error}>
                {status}
              </Typography>
            </div>
            <Button
              style={{marginTop: '1rem'}}
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
            >
              Email Recovery Link
            </Button>
          </Form>
        </Formik>
      </Container>
    </Container>
  );
}

export default PasswordRecovery;
