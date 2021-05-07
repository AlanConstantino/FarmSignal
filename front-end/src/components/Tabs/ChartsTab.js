import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import LiquidFillGauge from 'react-liquid-gauge';
import {Line} from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useLocation} from 'react-router-dom';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

// Charts tab
function ChartsTab(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [allPlantData, setAllPlantData] = useState(0);
  const pid = (useLocation()).pathname.slice(12);
  const [recentPlantData, setRecentPlantData] = useState(0);

  // state for graphs
  const [temperatureGraphData, setTemperatureGraphData] = useState({});
  const [humidityGraphData, setHumidityGraphData] = useState({});


  const {
    soilMoisture,
    temperature,
    humidity,
    setTemperature,
    setHumidity,
  } = props;

  // chart options will be the same for both humidity and temperature graphs
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

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
          setAllPlantData(plantData);

          // labels will be the same for both temperature and humidity graphs
          const labels = [];
          const humidityDataset = [{
            label: '%',
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

          let test = 0;
          if (plantData.length > 5) {
            test = plantData.length-5;
          }
          for (let i =test; i<plantData.length; i++) {
            labels.push(plantData[i]['date_data']);
            humidityDataset[0]['data'].push(plantData[i]['humidity_data']);
            // eslint-disable-next-line max-len
            temperatureDataset[0]['data'].push(plantData[i]['temperature_data']);
            recentData.push(plantData[i]);
          }

          // setting state for graphs
          setTemperatureGraphData({labels, datasets: temperatureDataset});
          setHumidityGraphData({labels, datasets: humidityDataset});
          setRecentPlantData(recentData);
        })
        .catch((err) => {
          console.log(err);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);


  function allTime() {
    const labels = [];

    const humidityDataset = [{
      label: '%',
      data: [],
      fill: false,
    }];

    const temperatureDataset = [{
      label: '°C',
      data: [],
      fill: false,
    }];

    allPlantData.forEach((plant) => {
      labels.push(plant['date_data']);
      humidityDataset[0]['data'].push(plant['humidity_data']);
      temperatureDataset[0]['data'].push(plant['temperature_data']);
    });
    setTemperatureGraphData({labels, datasets: temperatureDataset});
    setHumidityGraphData({labels, datasets: humidityDataset});
    setAnchorEl(null);
  }

  function mostRecent() {
    const labels =[];
    const humidityDataset = [{
      label: '%',
      data: [],
      fill: false,
    }];

    const temperatureDataset = [{
      label: '°C',
      data: [],
      fill: false,
    }];

    recentPlantData.forEach((plant) => {
      labels.push(plant['date_data']);
      humidityDataset[0]['data'].push(plant['humidity_data']);
      temperatureDataset[0]['data'].push(plant['temperature_data']);
    });

    setTemperatureGraphData({labels, datasets: temperatureDataset});
    setHumidityGraphData({labels, datasets: humidityDataset});
    setAnchorEl(null);
  }

  return (
    <>
      <div style={{marginBottom: '1.5rem'}}>
        <Typography align="centered" variant="subtitle1">
          Soil Moisture ({soilMoisture}%)
        </Typography>
        <Paper elevation={3} style={{padding: '1rem'}}>
          <LiquidFillGauge
            width={200}
            height={200}
            value={soilMoisture}
            riseAnimation
            waveAnimation
            waveFrequency={2}
            waveAmplitude={1}
            waveStyle={{fill: 'rgba(163, 185, 255, 1)'}}
            circleStyle={{fill: 'rgba(96, 134, 255, 1)'}}
            style={{margin: '0 auto'}}
          />
        </Paper>
      </div>

      <div style={{display: 'flex'}}>
        {/* button to change the graph data */}
        <Button aria-controls="simple-menu" aria-haspopup="true"
          onClick={handleClick} style={{marginLeft: 'auto'}}>
          Filter
          <ArrowDropDownIcon></ArrowDropDownIcon>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={allTime}>All Time</MenuItem>
          <MenuItem onClick={mostRecent}>Most Recent</MenuItem>
        </Menu>

      </div>


      <div style={{marginBottom: '1.5rem'}}>
        <Typography align="centered" variant="subtitle1">
          Temperature ({temperature}°C)
        </Typography>
        <Paper elevation={3} style={{padding: '1rem'}}>
          <Line data={temperatureGraphData} options={options} />
        </Paper>
      </div>

      <div style={{marginBottom: '1.5rem'}}>
        <Typography align="centered" variant="subtitle1">
          Humidity ({humidity}%)
        </Typography>
        <Paper elevation={3} style={{padding: '1rem'}}>
          <Line data={humidityGraphData} options={options} />
        </Paper>
      </div>
    </>
  );
}

export default ChartsTab;
