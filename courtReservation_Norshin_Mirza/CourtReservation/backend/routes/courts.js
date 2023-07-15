const express = require('express');
const router = express.Router();
const courtsController = require('../controllers/courtsController');

router.get('/', courtsController.getAllCourts);
router.get('/:id', courtsController.getCourtById);
router.post('/', courtsController.addCourt);
router.put('/:id', courtsController.updateCourt);
router.delete('/:id', courtsController.deleteCourt);

module.exports = router;
