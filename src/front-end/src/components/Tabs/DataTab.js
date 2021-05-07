import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// Data tab
function DataTab(props) {
  const {
    timeLastCalibrated,
    timeLastWatered,
    soilMoisturePercent,
    temperature,
    humidity,
    rawSoilMoisture,
    plantName,
    plantSpecies,
  } = props;

  return (
    <>
      <Container maxWidth="xs">
        <Grid container direction="column" spacing={3}>
          <Grid item xs>
            <List>
              <ListItem>
                <ListItemText primary="Plant name:" />
                <ListItemText align="right" secondary={plantName} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Plant species:" />
                <ListItemText align="right" secondary={plantSpecies} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Last calibrated:" />
                <ListItemText align="right" secondary={timeLastCalibrated} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Last watered:" />
                <ListItemText align="right" secondary={timeLastWatered} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Moisture percent:" />
                <ListItemText
                  align="right"
                  secondary={`${soilMoisturePercent}%`}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Raw soil capacitance:" />
                <ListItemText align="right" secondary={rawSoilMoisture} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Temperature:" />
                <ListItemText align="right" secondary={`${temperature}°C`} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Humidity:" />
                <ListItemText align="right" secondary={`${humidity}%`} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default DataTab;
