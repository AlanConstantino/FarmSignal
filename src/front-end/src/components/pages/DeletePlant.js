import React, {useState, useEffect} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiAlert from '@material-ui/lab/Alert';
import Navbar from '../Navbar';
import auth from '../Auth';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function PlantListItem(props) {
  const name = props.name;
  const species = props.species;
  const handleClick = props.onClick;

  return (
    <>
      <ListItem align="flex-start">
        <ListItemText
          primary={name}
          secondary={'Species: ' + species} />
        <ListItemSecondaryAction onClick={handleClick}>
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </>
  );
}

function DeletePlant() {
  const uid = localStorage.getItem('uid');
  const token = localStorage.getItem('token');
  const [plantData, setPlantData] = useState([]);
  const [deleteError, setDeleteError] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [query, setQuery] = useState('progress');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  useEffect(() => {
    const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${uid}/plants`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
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
          setPlantData(data);
          setQuery('success');
        })
        .catch((err) => {
          console.log(err);
        });
  }, [uid, token]);

  const onDelete = (index, pid, uid, arr) => {
    // delete plant data from database
    const token = localStorage.getItem('token');
    // eslint-disable-next-line
    const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${uid}/plants/${pid}`;
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    };
    fetch(url, options)
        .then(async (res) => {
          if (res.status !== 200) {
            throw await res.json();
          } else {
            // remove item from dom if successfully removed from db
            const copyPlantData = plantData.slice();
            copyPlantData.splice(index, 1);
            setPlantData(copyPlantData);
            console.log('Successfully removed item.');
            setDeleteSuccess(true);
          }
        })
        .catch((err) => {
          setDeleteError(true);
          console.log(err);
        });
  };

  return (
    <>
      {auth.isAuthenticated() && <Navbar />}
      <Container maxWidth="xs" style={{paddingTop: '4rem'}}>
        <Grid container direction="column" spacing={3}>
          <Typography align="center" variant="h4">
            Delete a Plant
          </Typography>
          <div>
            {query === 'success' ? (
              <Grid item>
                <List>
                  {plantData.map((item, index, arr) => {
                    return <PlantListItem
                      key={index}
                      name={item.plant_name}
                      species={item.plant_species}
                      onClick={() => (
                        onDelete(index, item.plant_id, item.user_id, arr)
                      )}
                    />;
                  })}
                </List>
                <Snackbar
                  open={deleteSuccess}
                  autoHideDuration={4000}
                  anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                  <Alert
                    onClose={handleClose}
                    severity="success"
                  >
                      Plant successfully deleted!
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={deleteError}
                  autoHideDuration={4000}
                  anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                  >
                    Error deleting plant!
                  </Alert>
                </Snackbar>
              </Grid>
              ) : (
                <CircularProgress />
              )}
          </div>
        </Grid>
      </Container>
    </>
  );
}

export default DeletePlant;
