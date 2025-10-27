// gestor-backend/src/routes/dashboardRoutes.js

const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');
const router = express.Router();

router.get('/kpis', getDashboardData);

module.exports = router;