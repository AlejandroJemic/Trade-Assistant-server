import express from 'express';

import {
  getMargin
} from './bitmex/bitmex.api-provider';

var localStorage;
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./_LocalStorage');
}


function deleteOrder(orderId){
  try {
    var orders = localStorage.getItem('orders');
    if (typeof orders !== "undefined" && orders !== null){
      global.orders = JSON.parse(orders).filter((order) => { return order.orderID !== orderId; });
      localStorage.setItem('orders', JSON.stringify(global.orders));
      return {
        ok: true,
        data: {
          message: `order ${orderId} deleted`
        }
      };
    }
  } catch (err) {
    return {
      ok: false,
      data: {
        message: err
      }
    };
  }
}

export const router = express.Router();

// server alive
router.get('/ping', (req, res) => {
  console.log('GET /');
  res.json({
    msg: `bitmex rest api is  runing on port ${global.PORT}`,
  });
});

// get quote
router.get('/quote', (req, res) => {
  console.log('GET /quote');
  res.json(global.Actualdata);
});

// get margin
router.get('/margin', (req, res) => {
  console.log('GET /margin ');
  getMargin().then((m) => {
    // console.log(m)
    res.json(m);
  });
});

router.get('/deleteOrder/:orderId', function (req, res) {
  console.log('GET /deleteOrder ' + req.params.orderId);
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  res.json( deleteOrder(req.params.orderId) );
})



router.get('/favicon.ico', (req, res) => res.status(204));

// block all not handled routes
router.all('/*', function (req, res) {
  console.log('bloqued ', req.originalUrl);
  res.status(403).send({
    msg: `Access Forbidden to ${req.originalUrl}`,
  });
});