import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import $ from 'jquery';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
// import { persistor, store } from './components/redux/store';
// import { PersistGate } from 'redux-persist/integration/react';

import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
       {/* <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </PersistGate>
    </Provider> */}
  </React.StrictMode>,
  document.getElementById("root")
);
