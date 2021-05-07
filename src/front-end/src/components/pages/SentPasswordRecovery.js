import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

function SentPasswordRecovery() {
  return (
    <>
      <Container maxWidth="xs" style={{paddingTop: '4rem'}}>
        <Grid container direction="column" spacing={3}>
          <Grid item xs>
            <Typography align="center" variant="h3">
                Email Sent
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography align="center" variant="body1">
                Check your email for the recovery link.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default SentPasswordRecovery;
