// @flow

import React from 'react';
import { Route } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import mainTheme from './themes/main.theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/theme';
import Login from './views/Login';
import MyPlaylists from './views/MyPlaylists';

import './App.css';

injectTapEventPlugin();

const theme = createMuiTheme();

const App = () =>
    <MuiThemeProvider theme={theme}>
        <div className="app">
            <Route exact path="/" component={(props: any) => <Login props={props} />} />
            <Route path="/myplaylists" component={MyPlaylists} />
        </div>
    </MuiThemeProvider>;

export default App;
