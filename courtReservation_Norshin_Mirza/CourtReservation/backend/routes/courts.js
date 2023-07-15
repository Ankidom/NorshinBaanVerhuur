const express = require('express');
const router = express.Router();
const courtsController = require('../controllers/courtsController');

router.get('/', courtsController.getCourts);
router.get('/:id', courtsController.getCourtById);
router.post('/', courtsController.createCourt);
router.put('/:id', courtsController.updateCourt);
router.delete('/:id', courtsController.deleteCourt);


module.exports = router;
