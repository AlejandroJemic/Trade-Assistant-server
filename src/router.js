import express from 'express';

import {
  getMargin, cancelOrder
} from './bitmex/bitmex.api-provider';

var localStorage;
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./_LocalStorage');
}


function deleteOrder(orderId){
  try {
    
      if (!global.deletedOrders.includes(orderId)){
        global.deletedOrders.push(orderId);
        localStorage.setItem('deletedOrders', JSON.stringify(global.deletedOrders));
        console.log('new deletedOrder ' + orderId)
      }
     
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
    console.log('error deleting order: ' + err )
    return {
      ok: false,
      data: {
        message: err
      }
    };
  }
}

function addHeaders(res){
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  return res;
}

export const router = express.Router();

// server alive
router.get('/ping', (req, res) => {
  console.log('GET /ping');
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
  res = addHeaders(res);
  res.json( deleteOrder(req.params.orderId) );
})

router.get('/cancelOrder/:orderId', async function (req, res) {
  console.log('GET /cancelOrder ' + req.params.orderId);
  res = addHeaders(res);
  var returned = await cancelOrder(req.params.orderId)
  res.json( returned );
})



router.get('/favicon.ico', (req, res) => res.status(204));

// block all not handled routes
router.all('/*', function (req, res) {
  console.log('bloqued ', req.originalUrl);
  res.status(403).send({
    msg: `Access Forbidden to ${req.originalUrl}`,
  });
});