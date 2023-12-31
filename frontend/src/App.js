import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import * as sessionActions from "./store/session";
import Navigation from './components/Navigation';
import Spots from './components/Spots';
import SpotDetails from './components/SpotDetails';
import CreateSpotForm from './components/CreateSpotForm';
import ManageSpots from './components/ManageSpots';
import UpdateSpotForm from './components/UpdateSpotForm';
import Reviews from './components/Reviews/Reviews';
import './index.css'

function App() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true))
  }, [dispatch, isLoaded])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
          <Route exact path='/'>
            <Spots />
          </Route>
          <Route path='/spots/current-user'>
            <ManageSpots />
          </Route>
          <Route path='/spots/:spotId/edit'>
            <UpdateSpotForm />
          </Route>
          <Route path='/spots/:spotId/reviews'>
            <Reviews />
          </Route>
          <Route path='/spots/:spotId'>
            <SpotDetails />
          </Route>
          <Route path='/spots'>
            <CreateSpotForm />
          </Route>
        </Switch>}
    </>
  )
}

export default App;
