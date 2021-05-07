import React from 'react';
import {Link} from 'react-router-dom';
import plantLogo from '../../plant-logo.png';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function Landing() {
  return (
    <>
      <Container maxWidth="xs" style={{paddingTop: '4rem'}}>
        <Grid container direction="column" spacing={3}
          alignItems="stretch"
        >
          <Grid item xs>
            <Typography align="center" variant="h3">
              Farm Signal
            </Typography>
          </Grid>
          <Grid item xs>
            <Box component="img" src={plantLogo} width="70%" />
          </Grid>
          <Grid item xs>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
              fullWidth
            >
              Log In
            </Button>
          </Grid>
          <Grid item xs>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/signup"
              fullWidth
            >
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Landing;
