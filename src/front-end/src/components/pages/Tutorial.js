import React from 'react';
import {Link} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import plantLogo from '../../plant-logo.png';
import Navbar from '../Navbar';
import auth from '../Auth';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  main: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(3, 0, 0),
  },
  // Change these attributes according to our images
  img: {
    height: 255,
    maxWidth: 400,
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
}));

function getSteps() {
  return ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Done'];
}

// Change for our tutorial
const tutorialSteps = [
  // Display local image
  {
    label: 'Tutorial Start',
    imgPath: plantLogo,
  },

  // Display image from URL
  {
    label: 'Add a plant',
    imgPath:
      'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'View all plants',
    imgPath:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    label: 'View plant detail',
    imgPath:
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'Tutorial Done',
    imgPath: plantLogo,
  },
];

function Tutorial(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      {auth.isAuthenticated && <Navbar />}
      <Container component="main" maxWidth="xs" className={classes.white}>
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h4">
            Tutorial
          </Typography>
          <Grid item xs>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
          <Grid className={classes.main}>
            <div>
              <Grid>
                <Typography
                  component="h1"
                  variant="h5"
                >
                  {tutorialSteps[activeStep].label}
                </Typography>
                <img
                  className={classes.img}
                  src={tutorialSteps[activeStep].imgPath}
                  alt={tutorialSteps[activeStep].label}
                />
              </Grid>
            </div>
            {activeStep === steps.length - 1 ? (
              <div className="button-container">
                <Button
                  variant="contained"
                  fullWidth
                  className={classes.button}
                  color="primary"
                  onClick={handleNext}
                  to='/home'
                  component={Link}
                >
                  GET STARTED
                </Button>
              </div>) : (
              <div className="button-container">
                <Button
                  variant="contained"
                  fullWidth
                  className={classes.button}
                  color="primary"
                  onClick={handleNext}
                >
                  NEXT
                </Button>
              </div>)}
            <div className="button-container">
              <Button
                variant="contained"
                fullWidth
                className={classes.button}
                color="primary"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                BACK
              </Button>
            </div>
          </Grid>
        </div>
      </Container>
    </>
  );
}

export default Tutorial;
