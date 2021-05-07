/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable max-len */
import React, {useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import {Formik, Form, Field} from 'formik';
import {TextField} from 'formik-material-ui';
import {makeStyles} from '@material-ui/core/styles';
import '../../components/css/AddPlant.css';
import Navbar from '../Navbar';
import auth from '../Auth';
import {DropzoneArea} from 'material-ui-dropzone';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '1rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
  inside: {
    marginTop: '1rem',
    paddingLeft: '0rem',
    paddingRight: '0rem',
  },
}));

// Array of step names
function getSteps() {
  return ['Name Your Plant', 'Upload An Image', 'Finish'];
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function useGetStepContent(stepIndex, setActiveStep, props) {
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const uid = localStorage.getItem('uid');
  const [imageFile, setImageFile] = useState([]);
  const [pid, setPlantId] = useState('');
  const [plantName, setPlantName] = useState('');
  const [plantSpecies, setPlantSpecies] = useState('');
  const [changed, setChanged] = useState(false);
  const [src, setSrc] = useState('');

  const classes = useStyles();

  // Handle close of snackbar
  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
    setOpenSuccess(false);
  };

  // When a picture is put into DropZoneArea
  const handleChange = (imageFile) => {
    // Saving files to state for further use and closing Modal.
    if (imageFile[0] === undefined) {
      setChanged(true);
    } else {
      setImageFile(imageFile[0]);
      setChanged(false);
    }
  };

  // When skip button is pressed on step 2
  const onSkip = () => {
    // Set image source to default source image if skipped
    setSrc('https://www.gardenia.net/storage/app/public/uploads/images/detail/shutterstock_1260151384Optimized.jpg');
    setActiveStep(2);
  };

  // When next button is pressed on step 2
  const onNext = () => {
  // Set image source to the uploaded image
    setSrc(URL.createObjectURL(imageFile));
    setActiveStep(2);
  };

  const doNothing = () => {
    setActiveStep(0);
    setOpenSuccess(true);
  };

  // Upload Image
  const onUpload = (errors) => {
    const token = localStorage.getItem('token');
    const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${uid}/plants/${pid}/upload`;

    const formData = new FormData();
    // Prepend user id to name of file
    formData.append('sampleFile', imageFile, `${uid}_` + imageFile.name);

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      credentials: 'include',
    };

    fetch(url, options)
        .then((res) => {
          if (res.redirected) {
            setActiveStep(0);
            setOpenSuccess(true);
            setActiveStep(0);
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
          setOpenError(true);
        })
        .finally(() => {
          // Revoke the data uris to avoid memory leaks
          URL.revokeObjectURL(imageFile);
        });
  };

  // Delete plant that was added in first step and reset plant image
  const handleReset = () => {
    const token = localStorage.getItem('token');
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
            // Revoke the data uris to avoid memory leaks
            URL.revokeObjectURL(imageFile);
            setImageFile([]);
            setActiveStep(0);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  switch (stepIndex) {
    // Add plant with name and species
    case 0:
      return (
        <>
          <Container component="main" maxWidth="xs" className={classes.inside}>
            <Container component="main"
              maxWidth="xs"
              className={classes.inside}
            >
              <div>
                <Snackbar
                  open={openSuccess}
                  autoHideDuration={4000}
                  anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                  <Alert
                    onClose={handleClose}
                    severity="success"
                  >
                    Plant successfully added!
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={openError}
                  autoHideDuration={4000}
                  anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                  >
                    Error! Plant not added!
                  </Alert>
                </Snackbar>
              </div>
              <Formik
                initialValues={{
                  plant_name: '',
                  plant_species: '',
                }}
                validate={(values) => {
                  const errors = {};
                  const plantRegex = /[a-zA-Z]/;

                  if (!values.plant_name) {
                    errors.plant_name = 'Please enter a plant name.';
                  } else if (!plantRegex.test(values.plant_name)) {
                    errors.plant_name = 'Invalid plant name';
                  }

                  if (!values.plant_species) {
                    errors.plant_species = 'Please enter a plant species.';
                  } else if (!plantRegex.test(values.plant_species)) {
                    errors.plant_species = 'Invalid plant species';
                  }

                  return errors;
                }}
                // Add new plant return plant id
                onSubmit={(values) => {
                  const user = localStorage.getItem('uid');
                  const authToken = localStorage.getItem('token');
                  setPlantName(values.plant_name);
                  setPlantSpecies(values.plant_species);

                  const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${user}/plants`;

                  const json = {
                    plant_name: values.plant_name,
                    plant_species: values.plant_species,
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
                      'Authorization': 'Bearer ' + authToken,
                    },
                    credentials: 'include',
                    body: formBody,
                  };

                  fetch(url, options)
                      .then(async (res) => {
                        if (res.status !== 200) {
                          throw await res.json();
                        } else {
                          return res.json();
                        }
                      })
                      .then((data) => {
                        if (data.plantId) {
                          // Set plant id for this plant
                          setPlantId(data.plantId);
                          setOpenError(false);
                          setOpenSuccess(false);
                          // Go to step 2
                          setActiveStep(1);
                        }
                      })
                      .catch((err) => {
                        setOpenError(true);
                        console.log(err);
                      });
                }}
              >
                <Form>
                  <Field
                    style={{marginBottom: '1rem'}}
                    component={TextField}
                    name="plant_name"
                    type="text"
                    label="Name"
                    required
                    fullWidth
                    variant="outlined"
                  />
                  <Field
                    component={TextField}
                    name="plant_species"
                    type="text"
                    label="Species"
                    required
                    fullWidth
                    variant="outlined"
                  />
                  <Button
                    style={{marginTop: '1rem'}}
                    size="large"
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Confirm
                  </Button>
                </Form>
              </Formik>
            </Container>
          </Container>
        </>
      );

    // Upload image
    case 1:
      return (
        <>
          <Container
            maxWidth="xs"
            className={classes.inside}
          >
            <div>
              <DropzoneArea
                onChange={(imageFile) => handleChange(imageFile)}
                onDelete={(deleteFileObj) => {
                  console.log('onDelete', deleteFileObj);
                }}
                filesLimit={1}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                maxFileSize={5000000}
              />
            </div>
            {changed ? (
              <Button
                className={classes.inside}
                size="large"
                fullWidth
                variant="contained"
                color="primary"
                onClick={onSkip}
              >
                Skip
              </Button>) : (
              <Button
                className={classes.inside}
                size="large"
                fullWidth
                variant="contained"
                color="primary"
                onClick={onNext}
              >
                Next
              </Button>)}
          </Container>
        </>
      );

    // Confirm plant name, plant species and image
    case 2:
      return (
        <>
          <Container
            maxWidth="xs"
            className={classes.inside}
          >
            <div>
              <Paper
                component="img"
                src={src}
                width="100%"
                maxWidth="15rem"
                elevation={3}
              />
              <Card style={{marginBottom: '1rem'}}>
                <CardContent>
                  <Typography>
                    Plant Name: {plantName}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Typography>
                    Plant Species: {plantSpecies}
                  </Typography>
                </CardContent>
              </Card>
              {changed ? (
                <Button
                  size="large"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={doNothing}
                >
                  Confirm
                </Button>) : (
                  <Button
                    size="large"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={onUpload}
                  >
                    Confirm
                  </Button>)}
              <Button
                style={{marginTop: '1rem'}}
                size="large"
                fullWidth
                color="secondary"
                variant="contained"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </Container>
        </>
      );
    default:
      return 'Unknown stepIndex';
  }
}

function HorizontaLabelPositionBelowStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep -1);
  };

  return (
    <>
      {auth.isAuthenticated() && <Navbar />}
      <Container maxWidth="sm">
        <div>
          <h1>Add Plant</h1>
          <Container component="main"
            maxWidth="xs"
            className={classes.container}
          >
            <Stepper activeStep={activeStep}
              alternativeLabel
              style={{marginBottom: '1rem'}}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              {/* Step 1 */}
              {activeStep === steps.length -3 && (
                <div>
                  <div>
                    {useGetStepContent(activeStep, setActiveStep)}
                  </div>
                </div>
              )}
              {/* Step 2 */}
              {activeStep === steps.length -2 && (
                <div>
                  <div>
                    {useGetStepContent(activeStep, setActiveStep)}
                  </div>
                </div>
              )}
              {/* Step 3 */}
              {activeStep === steps.length -1 && (
                <div>
                  <div>
                    {useGetStepContent(activeStep, setActiveStep)}
                  </div>
                  <div>
                    <Button style={{marginTop: '1rem', marginBottom: '2rem'}}
                      size="large"
                      fullWidth
                      onClick={handleBack}
                      variant="contained"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </div>
      </Container>
    </>
  );
}

export default HorizontaLabelPositionBelowStepper;
