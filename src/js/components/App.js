import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';

import Home from "js/components/Home";
import MovieDetails from "js/components/MovieDetails";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import 'styles/css/App.css';

const theme = createMuiTheme({
  palette: {
      primary: {main: '#e50914'},
      secondary: {
          main: '#141414',
          light: '#000000'},
      default: {
        main: "#ffffff",
      }
  },
  typography: {
    fontFamily: [
      'Netflix Sans',
      'sans-serif',
      'Bold'
    ].join(','),
  }
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
        <Switch>
          <Route exact path='/' component={ Home } />
          <Route exact path='/detalhes/:id' component={ MovieDetails } />
        </Switch>
      </MuiThemeProvider>
  );
}

export default withRouter(App);