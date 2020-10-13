import {
  router
} from './router';


import {
  getInspectApis
} from './bitmex/bitmex.api-provider';

import {
  runBitmexWSocketClient
} from "./bitmex/bitmex.WSocket-client";
import {
  runRetransmiter
} from "./bitmex/bitmex.re-transmiter";

var app = require('express')();

var localStorage;
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./_LocalStorage');
}

// #region GLOBALS

global.PORT = process.env.PORT || 3000;
global.Actualdata;
global.apiKeyID = 'qd5kyzuwgThbolZKHEMpvFv7';
global.apiKeySecret = 'M79Q8zsrfRtynF3XKYRHWvwVQfNyseezXRGrYuHVBsn0b4l9';
global.orders;
global.positions;

// #endregion

var orders = localStorage.getItem('orders');
if (typeof orders !== "undefined" && orders !== null){
  console.log('read orders from server local storage')
  global.orders = JSON.parse(orders);
}
var positions = localStorage.getItem('positions');
if (typeof positions !== "undefined" && positions !== null){
  console.log('read positions from server local storage')
  global.positions = JSON.parse(positions);
}

// #region BITMEX

runBitmexWSocketClient();
runRetransmiter();

// getInspectApis();
// #endregion 


// #region REST API

// handle api routes
app.use('/', router);
app.listen(global.PORT, () => {
  console.log(`bitmex rest api is runing on por ${global.PORT}`);
});

// #endregion