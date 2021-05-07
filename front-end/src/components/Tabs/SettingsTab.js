import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Switch from '@material-ui/core/Switch';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import {Link} from 'react-router-dom';
import {Formik, Form, Field} from 'formik';
import {TextField} from 'formik-material-ui';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import Typography from '@material-ui/core/Typography';

// settings tab
function SettingsTab(props) {
  const pid = props.pid;
  const classes = props.classes;
  const plantName = props.name;
  const plantSpecies = props.species;
  const setPlantName = props.setPlantName;
  const setPlantSpecies = props.setPlantSpecies;
  const notificationState = props.notificationState;
  const setNotifications = props.setNotifications;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSwitchChange = () => {
    setNotifications(!notificationState);
    const payload = {};
    payload.notifications = (!notificationState) ? 1 : 0;

    let formBody = [];
    for (const property in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, property)) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(payload[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
    }
    formBody = formBody.join('&');

    // eslint-disable-next-line
    const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${localStorage.getItem('uid')}/plants/${pid}`;
    const options = {
      method: 'PUT',
      headers: {
        // eslint-disable-next-line max-len
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      credentials: 'include',
      body: formBody,
      // body: formData,
    };

    fetch(url, options)
        .then(async (res) => {
          if (res.status !== 200) {
            throw await res.json();
          } else {
            return res.json();
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleDelete = (pid) => {
    // delete plant data from database
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    // eslint-disable-next-line
    const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${uid}/plants/${pid}`;
    const options = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    };
    fetch(url, options)
        .then(async (res) => {
          if (res.status !== 200) {
            throw await res.json();
          } else {
            console.log('Successfully removed plant.');
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  return (
    <>
      <Container maxWidth="xs">
        <Grid container direction="column" spacing={3}>
          <Grid item xs>
            <List>
              <ListItem>
                <ListItemIcon>
                  {(
                    notificationState === true ?
                      <NotificationsIcon /> :
                      <NotificationsOffIcon />
                  )}
                </ ListItemIcon>
                <ListItemText primary="Notifications" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationState}
                    onChange={handleSwitchChange}
                    edge="end"
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <Divider />
          </Grid>
          <Grid item xs>
            <Typography align="left" variant="subtitle1">
              Update Plant Info
            </Typography>
          </Grid>
          <Grid item xs>
            <Formik
              initialValues={{
                plantName: '',
                plantSpecies: '',
              }}
              validate={(values) => {
                const errors = {};
                const plantRegex = /^[^-\s][a-zA-Z0-9_\s-]+$/;

                if (values.plantName && !plantRegex.test(values.plantName)) {
                  errors.plantName = 'Invalid plant name';
                }
                // eslint-disable-next-line max-len
                if (values.plantSpecies && !plantRegex.test(values.plantSpecies)) {
                  errors.plantSpecies = 'Invalid plant species';
                }

                const bothFormFieldsEmpty = (
                  values.plantName === '' &&
                  values.plantSpecies === ''
                );
                if (bothFormFieldsEmpty) {
                  errors.plantName = 'At least one field has to be filled out.';
                  errors.plantSpecies = (
                    'At least one field has to be filled out.'
                  );
                }

                return errors;
              }}
              onSubmit={(values, {resetForm}) => {
                // eslint-disable-next-line
                const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${localStorage.getItem('uid')}/plants/${pid}`;

                const payload = {
                  'plant_name': values.plantName,
                  'plant_species': values.plantSpecies,
                };

                let formBody = [];
                for (const property in payload) {
                  if (Object.prototype.hasOwnProperty.call(payload, property)) {
                    const encodedKey = encodeURIComponent(property);
                    const encodedValue = encodeURIComponent(payload[property]);
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
                        throw await res.text();
                      } else {
                        return res.text();
                      }
                    })
                    .then((data) => {
                      console.log('success');
                      setPlantName(payload['plant_name']);
                      setPlantSpecies(payload['plant_species']);
                    })
                    .catch((err) => {
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
                  name="plantName"
                  type="text"
                  label={plantName}
                  placeholder="Name"
                  fullWidth
                  variant="outlined"
                />
                <Field
                  component={TextField}
                  name="plantSpecies"
                  type="text"
                  label={plantSpecies}
                  placeholder="Species"
                  fullWidth
                  variant="outlined"
                  className={classes.fieldItem}
                />
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  fullWidth
                  className={classes.fieldItem}
                >
                  Update
                </Button>
              </Form>
            </Formik>
          </Grid>
          <Grid item xs>
            <Divider />
          </Grid>
          <Grid item xs>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleClickOpen}
            >
              Delete
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
            >
              <DialogTitle>
                Are you sure you want to delete this plant?
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  You won't be able to undo this.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  component={Link}
                  to={'/home'}
                  onClick={() => handleDelete(pid)}
                  color="secondary"
                >
                  Delete
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default SettingsTab;
