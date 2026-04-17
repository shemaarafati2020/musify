const { Router } = require('express');
const { optionalAuth } = require('../middleware/auth');
const searchController = require('../controllers/searchController');

const router = Router();

router.get('/', optionalAuth, searchController.search);

module.exports = router;
