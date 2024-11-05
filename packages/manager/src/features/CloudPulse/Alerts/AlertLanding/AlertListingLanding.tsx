import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

// import { AlertDetail } from './AlertDetail';
import { AlertListing } from './AlertListing';

export const AlertListingLanding = () => {
  return (
    <Switch>
      <Route exact path="/monitor/cloudpulse/alerts/definitions">
        <AlertListing />
      </Route>
    </Switch>
  );
};