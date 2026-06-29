const express = require('express');

const { checkDatabase } = require('../db');

const router = express.Router();
const SERVICE_NAME = 'ganjue-training-backend-v1';

router.get('/', async (req, res, next) => {
  try {
    const database = await checkDatabase();

    return res.json({
      code: 0,
      message: 'ok',
      data: {
        status: 'ok',
        service: SERVICE_NAME,
        timestamp: new Date().toISOString(),
        uptime: Number(process.uptime().toFixed(3)),
        database,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
