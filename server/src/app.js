const cors = require('cors');
const express = require('express');

const routes = require('./routes');
const { env } = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: env.corsOrigin === '*' ? true : env.corsOrigin,
  })
);
app.use(express.json({ limit: '1mb' }));

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'not_found',
    data: {
      path: req.originalUrl,
      method: req.method,
    },
  });
});

app.use(errorHandler);

module.exports = app;
