const express = require('express');

const healthRouter = require('./health');
const authRouter = require('./auth');
const syncRouter = require('./sync');
const adminRouter = require('./admin');

const router = express.Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/sync', syncRouter);
router.use('/admin', adminRouter);

module.exports = router;
