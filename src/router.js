import express from 'express';

export const router = express.Router();

// server alive
router.get('/ping', (req, res) => {
  console.log('GET /');
  res.json({
    msg: `server runing on ${global.PORT}`,
  });
});

// get quote
router.get('/quote', (req, res) => {
  console.log('GET /');
  res.json(global.Actualdata);
});

// block all not handled routes
router.all('/*', function (req, res) {
  console.log('bloqued ', req.originalUrl);
  res.status(403).send({
    msg: `Access Forbidden to ${req.originalUrl}`,
  });
});
