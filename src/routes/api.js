const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/search', searchController.search);
router.get('/data', searchController.getAllData);
router.get('/stats', searchController.getStats);

module.exports = router;
