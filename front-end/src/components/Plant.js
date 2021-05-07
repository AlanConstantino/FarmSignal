import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import './css/Plant.css';

function DisplayPlants() {
  // get user jwt id from localStorage
  const [plantInfo, setPlantInfo] = useState([]);
  const [query, setQuery] = useState('progress');
  useEffect(() => {
    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');
    const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${uid}/plants`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    };
    fetch(url, options)
        .then(async (res) => {
          return res.json();
        })
        .then((data) => {
          setPlantInfo(data);
          setQuery('success');
        });
  }, []);
  return (
    // Outer Grid Container
    <>
      <div>
        {query === 'success' ? (
          <Grid container maxWidth="xs" direction="column" spacing={4}>
            {/* Space the grid container will take based on device width */}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {/* Container that will hold the plant cards.
              Will center them within the parent container */}
              <Grid container justify="center" spacing={3}>
                {plantInfo.map((element, index) =>
                  <Grid
                    container
                    justify="center"
                    item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Card className="card-container">
                      <CardActionArea component={Link}
                        to={`/plant-info/${element.plant_id}`}>
                        {plantInfo[index].plant_img1 ? (
                          <CardMedia
                            component="img"
                            height="200"
                            // eslint-disable-next-line max-len
                            image={`${process.env.REACT_APP_BASE_API_URL}/upload/${plantInfo[index].plant_img1}`}
                            title="plant image"
                          />) : (
                            <CardMedia
                              component="img"
                              alt="No Image"
                              height="200"
                              // eslint-disable-next-line max-len
                              image="https://www.gardenia.net/storage/app/public/uploads/images/detail/shutterstock_1260151384Optimized.jpg"
                              title="plant image"
                            />)}
                        <CardContent>
                          <Typography variant="h5"
                            component="h2">
                            {plantInfo[index].plant_name}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>,
                )}
              </Grid>
            </Grid>
          </Grid>
          ) : (
            <CircularProgress />
          )}
      </div>
    </>
  );
}

export default DisplayPlants;
