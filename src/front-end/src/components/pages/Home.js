import React from 'react';
import Container from '@material-ui/core/Container';
import DisplayPlants from '../Plant';
import Navbar from '../Navbar';
import auth from '../Auth';

function Home() {
  return (
    <>
      {auth.isAuthenticated() && <Navbar />}
      <Container>
        <h1>Home Page </h1>
        <DisplayPlants />
      </Container>
    </>
  );
}

export default Home;
