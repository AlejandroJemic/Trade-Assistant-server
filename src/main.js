import {
  router
} from './router';

import {
  runBitmexWSocketClient
} from "./bitmex/bitmex.WSocket-client";
import {
  runRetransmiter
} from "./bitmex/bitmex.re-transmiter";

var app = require('express')();


// #region GLOBALS

global.PORT = process.env.PORT || 3000;
global.Actualdata;
global.apiKeyID = 'qd5kyzuwgThbolZKHEMpvFv7';
global.apiKeySecret = 'M79Q8zsrfRtynF3XKYRHWvwVQfNyseezXRGrYuHVBsn0b4l9';
global.orders;
global.positions;

// #endregion


// #region BITMEX

runBitmexWSocketClient();
runRetransmiter();

// #endregion 


// #region REST API

// handle api routes
app.use('/', router);
app.listen(global.PORT, () => {
  console.log(`bitmex rest api is runing on por ${global.PORT}`);
});

// #endregion