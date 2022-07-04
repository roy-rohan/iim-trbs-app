import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import eventReducer from "./store/reducers/event";
import workshopReducer from "./store/reducers/workshop";
import informalEventReducer from "./store/reducers/informalEvent";
import speakerReducer from "./store/reducers/speaker";
import connexionReducer from "./store/reducers/connexion";
import strategizerReducer from "./store/reducers/strategizer";
import sponserReducer from "./store/reducers/sponser";
import memberReducer from "./store/reducers/member";
import authReducer from "./store/reducers/auth";
import messageReducer from "./store/reducers/messenger";
import contactPerson from "./store/reducers/contactPerson";
import certificateReducer from "./store/reducers/certificate";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#851a23",
    },
    secondary: {
      main: "#f44336",
    },
  },
  spacing: (factor) => `${0.25 * factor}rem`,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  event: eventReducer,
  workshop: workshopReducer,
  informalEvent: informalEventReducer,
  speaker: speakerReducer,
  connexion: connexionReducer,
  sponser: sponserReducer,
  strategizer: strategizerReducer,
  auth: authReducer,
  messenger: messageReducer,
  contactPerson: contactPerson,
  member: memberReducer,
  certificate: certificateReducer
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App></App>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
