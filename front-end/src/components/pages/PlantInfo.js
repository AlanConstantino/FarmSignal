import React, {useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {useLocation} from 'react-router-dom';
import Navbar from '../Navbar';
import auth from '../Auth';
import {makeStyles} from '@material-ui/core/styles';
import BarChartIcon from '@material-ui/icons/BarChart';
import ImageIcon from '@material-ui/icons/Image';
import ReorderIcon from '@material-ui/icons/Reorder';
import SettingsIcon from '@material-ui/icons/Settings';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DataTab from '../Tabs/DataTab';
import ImageTab from '../Tabs/ImageTab';
import SettingsTab from '../Tabs/SettingsTab';
import ChartsTab from '../Tabs/ChartsTab';
import TabPanel from '../TabPanel';

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
  button: {
    float: 'right',
  },
}));

// Main page component
function PlantInfo() {
  const classes = useStyles();

  // fetch data with plant id from back-end to get things like
  // plant name, last calibrated, moisture percent, etc.
  const pid = (useLocation()).pathname.slice(12);

  // state for data tab
  const [plantName, setPlantName] = useState('');
  const [plantSpecies, setPlantSpecies] = useState('');
  const [humidity, setHumidity] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [moisturePercent, setMoisturePercent] = useState(0);
  const [timeLastWatered, setTimeLastWatered] = useState('');
  const [timeLastCalibrated, setTimeLastCalibrated] = useState('');
  const [rawSoilMoisture, setRawSoilMoisture] = useState(0);
  const [plantImage, setPlantImage] = useState('');

  // state for settings tab
  const [notifications, setNotifications] = useState(false);

  // state for graphs
  const [temperatureGraphData, setTemperatureGraphData] = useState({});
  const [humidityGraphData, setHumidityGraphData] = useState({});

  const [tabValue, setTabValue] = useState(1);
  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  // API call to gather the plant name and species
  useEffect(() => {
    const uid = localStorage.getItem('uid');

    // eslint-disable-next-line
    const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${uid}/plants/${pid}`;
    const options = {
      method: 'GET',
      headers: {
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
        .then(async (data) => {
          const plant = await data[0];

          if ('plant_name' in plant) {
            setPlantName(plant['plant_name']);
          }

          if ('plant_species' in plant) {
            setPlantSpecies(plant['plant_species']);
          }

          if ('plant_img1' in plant) {
            setPlantImage(plant['plant_img1']);
          }

          if ('notifications' in plant) {
            setNotifications((plant['notifications'] === 1) ? true : false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }, [pid]);

  // API call to gather the plant data like humidity, temperature, etc.
  useEffect(() => {
    const uid = localStorage.getItem('uid');

    // eslint-disable-next-line
    const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${uid}/plants/${pid}/readings`;
    const options = {
      method: 'GET',
      headers: {
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
        .then((plantData) => {
          // if array is empty, error out early
          if (plantData.length === 0) {
            throw new Error('No plant readings (empty array).');
          }
          // setting state from fetch response with the most recent plant data
          const recentReading = plantData[plantData.length - 1];
          setHumidity(recentReading['humidity_data']);
          setTemperature(recentReading['temperature_data']);
          setMoisturePercent(recentReading['moisture_percent']);
          setTimeLastCalibrated(recentReading['last_calibrated']);
          setTimeLastWatered(recentReading['last_watered']);
          setRawSoilMoisture(recentReading['raw_soil_capacitance']);

          // labels will be the same for both temperature and humidity graphs
          const labels = [];
          const humidityDataset = [{
            label: '°C',
            data: [],
            fill: false,
            backgroundColor: 'rgba(96, 134, 255, 1)',
            borderColor: 'rgba(163, 185, 255, 1)',
          }];
          const temperatureDataset = [{
            label: '°C',
            data: [],
            fill: false,
            backgroundColor: 'rgba(96, 134, 255, 1)',
            borderColor: 'rgba(163, 185, 255, 1)',
          }];

          const recentData =[];
          // 5 recent readings
          plantData.forEach((plant, index) => {
            if (index < 5) {
              recentData.push(plantData[index]);
            }
          });

          // Display the 5 most recent data
          plantData.forEach((plant, index) => {
            if (index < 5) {
              labels.push(plant['date_data']);
              humidityDataset[0]['data'].push(plant['humidity_data']);
              temperatureDataset[0]['data'].push(plant['temperature_data']);
            }
          });

          // iterate over ALL the data and store them
          // plantData.forEach((plant) => {
          //   labels.push(plant['date_data']);
          //   humidityDataset[0]['data'].push(plant['humidity_data']);
          //   temperatureDataset[0]['data'].push(plant['temperature_data']);
          // });

          // setting state for graphs
          setTemperatureGraphData({labels, datasets: temperatureDataset});
          setHumidityGraphData({labels, datasets: humidityDataset});
        })
        .catch((err) => {
          console.log(err);
        });
  }, [pid]);

  return (
    <>
      {auth.isAuthenticated() && <Navbar />}
      <Container maxWidth="md" container={true} style={{padding: '2rem 1rem'}}>
        <Typography align="center" variant="h4" style={{marginBottom: '1rem'}}>
          {plantName}
        </Typography>

        <Typography align="center" variant="h6" style={{marginBottom: '1rem'}}>
          {plantSpecies}
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered={true}
          variant="fullWidth"
          style={{marginBottom: '1rem'}}
        >
          <Tab label="Image" icon={<ImageIcon />} />
          <Tab label="Charts" icon={<BarChartIcon />} />
          <Tab label="Data" icon={<ReorderIcon />} />
          <Tab label="Settings" icon={<SettingsIcon />} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <ImageTab
            plantImage={plantImage}
            setPlantImage={setPlantImage}
            pid={pid}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ChartsTab
            setHumidity={setHumidityGraphData}
            setTemperature={setTemperatureGraphData}
            soilMoisture={moisturePercent}
            humidity={humidity}
            temperature={temperature}
            temperatureGraphData={temperatureGraphData}
            humidityGraphData={humidityGraphData}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <DataTab
            plantName={plantName}
            plantSpecies={plantSpecies}
            timeLastCalibrated={timeLastCalibrated}
            timeLastWatered={timeLastWatered}
            soilMoisturePercent={moisturePercent}
            temperature={temperature}
            humidity={humidity}
            rawSoilMoisture={rawSoilMoisture}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <SettingsTab
            notificationState={notifications}
            pid={pid}
            classes={classes}
            name={plantName}
            species={plantSpecies}
            setPlantName={setPlantName}
            setPlantSpecies={setPlantSpecies}
            setNotifications={setNotifications}
          />
        </TabPanel>
      </Container>
    </>
  );
}

export default PlantInfo;
