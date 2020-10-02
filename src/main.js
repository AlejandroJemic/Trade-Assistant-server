import {
  router
} from './router';

import {
  runBitmexWSocketClient
} from "./bitmex/bitmex.WSocket-client";
import {
  runRetransmiter
} from "./bitmex/bitmex.re-transmiter";

import {
  getInspectApis
} from "./bitmex/bitmex.api-provider"

var app = require('express')();


// #region GLOBALS

global.PORT = process.env.PORT || 3000;
global.Actualdata;
global.apiKeyID = 'qd5kyzuwgThbolZKHEMpvFv7';
global.apiKeySecret = 'M79Q8zsrfRtynF3XKYRHWvwVQfNyseezXRGrYuHVBsn0b4l9';

// #endregion


// #region BITMEX

runBitmexWSocketClient();
runRetransmiter();

getInspectApis();

// #endregion 


// #region REST API

// handle api routes
app.use('/', router);
app.listen(global.PORT, () => {
  console.log(`bitmex rest api is runing on por ${global.PORT}`);
});

// #endregion