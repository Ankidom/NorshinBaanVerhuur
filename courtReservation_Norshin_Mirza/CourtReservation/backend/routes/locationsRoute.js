const express = require('express');
const locationController = require('../controllers/locationsController');
const router = express.Router();

router.get('/', locationController.getLocations);

module.exports = router;
