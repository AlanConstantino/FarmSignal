import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './components/pages/Landing';
import Home from './components/pages/Home';
import Settings from './components/pages/Settings';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Tutorial from './components/pages/Tutorial.js';
import PageNotFound from './components/pages/404';
import SentPasswordRecovery from './components/pages/SentPasswordRecovery';
import PasswordRecovery from './components/pages/PasswordRecovery';
import ResetPassword from './components/pages/ResetPassword';
import DeletePlant from './components/pages/DeletePlant';
import PlantInfo from './components/pages/PlantInfo';
import AddPlant from './components/pages/AddPlant';
import Logout from './components/Logout';

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {apiResponse: ''};
  // }

  // callAPI() {
  //   fetch('http://localhost:9000/testAPI')
  //       .then((res) => res.text())
  //       .then((res) => this.setState({apiResponse: res}));
  // }

  // componentWillMount() {
  //   this.callAPI();
  // }

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
            <Route
              path="/password-recovery"
              exact
              component={PasswordRecovery}
            />
            <Route
              path="/sent-password-recovery"
              exact
              component={SentPasswordRecovery}
            />
            <ProtectedRoute
              path="/reset-password"
              exact
              component={ResetPassword}
            />
            {/* <Route path="/home" exact component={Home} /> */}
            <ProtectedRoute path="/home" exact component={Home} />
            <ProtectedRoute path="/settings" exact component={Settings} />
            <ProtectedRoute path="/add-plant" exact component={AddPlant} />
            <ProtectedRoute path="/tutorial" exact component={Tutorial} />
            <ProtectedRoute path="/delete-plant" exact component={DeletePlant}/>
            <ProtectedRoute path="/plant-info/:id" exact component={PlantInfo}/>
            <ProtectedRoute path="/logout" exact component={Logout}/>
            <Route component={PageNotFound} />
          </Switch>

        </Router>
      </div>
    );
  }
}

export default App;
