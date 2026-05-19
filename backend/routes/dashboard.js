const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

router.get('/summary', verifyToken, DashboardController.getSummary);

module.exports = router;
