const express = require('express');

const router = express.Router();

router.all('*', (req, res) => {
  res.status(501).json({
    code: 501,
    message: 'sync_not_implemented_in_v1_stage_1',
    data: {
      module: 'sync',
      path: req.originalUrl,
      method: req.method,
      stage: 'backend-v1-foundation',
    },
  });
});

module.exports = router;
