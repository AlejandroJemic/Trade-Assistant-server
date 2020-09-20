import { json } from 'express';

const BitMEXClient = require('bitmex-realtime-api');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

export const runBitmexWSocketClient = function () {
  // See 'options' reference below
  const client = new BitMEXClient({
    testnet: false,
  });
  client.on('error', console.error);
  client.on('open', () => console.log('Connection opened.'));
  client.on('close', () => console.log('Connection closed.'));
  client.on('initialize', () =>
    console.log('Client initialized, data is flowing.')
  );

  client.addStream('XBTUSD', 'quote', function (data, symbol, tableName) {
    //     console.log(
    //         `Got update for ${tableName}:${symbol}. Current state:\n${JSON.stringify(
    //     data
    //   ).slice(0, 100)}...`
    //     );
    // Do something with the table data...
    global.Actualdata = data[data.length - 1];
  });
};
var prev = global.Actualdata;
export const runRetransmiter = function () {
  io.on('connection', (socket) => {
    console.log('a user connected');

    setInterval(function () {
      if (JSON.stringify(global.Actualdata) !== JSON.stringify(prev)) {
        // console.log('sending dataupdate');
        socket.emit('dataupdate', global.Actualdata);
        prev = global.Actualdata;
      } else {
        // console.log('no updates')
      }
    }, 2000);

    socket.on('disconnect', () => {
      // console.log('user disconnected');
    });
  });

  http.listen(4000, () => {
    console.log('wsio listening on *:4000');
  });
};
