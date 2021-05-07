import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

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
    color: '#BF0000',
    marginLeft: theme.spacing(1.5),
  },
}));

function ResetPassword(props) {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  useEffect(() => {
    if (!confirmPassword || !newPassword) {
      setConfirmPasswordError('');
    } else {
      if (newPassword !== confirmPassword) {
        setConfirmPasswordError('Passwords must match!');
      } else {
        setConfirmPasswordError('');
      }
    }
  }, [newPassword, confirmPassword]);

  if (success) {
    return <Redirect push to={{
      pathname: '/home',
    }}
    />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="newPassword"
                value={newPassword}
                label="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="password"
                value={confirmPassword}
                label="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <div className="error">
              <body className={classes.error}>
                {confirmPasswordError}
              </body>
            </div>
          </Grid>
          <div className="button-container">
            <Button
              variant="contained"
              fullWidth
              className={classes.button}
              type="submit"
              color="primary"
              disabled={confirmPasswordError}
            >
              RESET
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default ResetPassword;
