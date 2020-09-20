import express from 'express';
import {
  router
} from './router';

import {
  runBitmexWSocketClient,
  runRetransmiter
} from './bitmex.server';

const app = express();

global.PORT = process.env.PORT || 3000;
global.Actualdata;

runBitmexWSocketClient();
runRetransmiter();
// handle api routes
app.use('/', router);

app.listen(global.PORT, () => {
  console.log(`Server is listening on port ${global.PORT}`);
});