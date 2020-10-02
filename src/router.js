import express from 'express';

import {
  getMargin
} from './bitmex/bitmex.api-provider';

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

router.get('/favicon.ico', (req, res) => res.status(204));

// block all not handled routes
router.all('/*', function (req, res) {
  console.log('bloqued ', req.originalUrl);
  res.status(403).send({
    msg: `Access Forbidden to ${req.originalUrl}`,
  });
});