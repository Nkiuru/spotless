import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {unstable_createMuiStrictModeTheme as createMuiTheme, StylesProvider, ThemeProvider} from '@material-ui/core/styles';
import {blueGrey, lightBlue} from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blueGrey[900],
    },
    secondary: lightBlue
  },
  typography: {
    fontFamily: ['Raleway', 'sans-serif']
  }
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <StylesProvider injectFirst>
          <App/>
        </StylesProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
