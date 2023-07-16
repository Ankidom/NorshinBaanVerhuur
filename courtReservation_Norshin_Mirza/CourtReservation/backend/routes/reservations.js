const express = require('express');
const router = express.Router();
const {
    getReservations,
    createReservation,
    getReservationsByDate,
    deleteReservation,
    getReservationById,
    updateReservation
} = require('../controllers/reservations');

// GET-route voor het ophalen van alle reserveringen
router.get('/', getReservations);

// GET-route voor het ophalen van reserveringen per datum
router.get('/byDate', getReservationsByDate);

// POST-route voor het maken van een reservering
router.post('/', createReservation);

// DELETE-route voor het verwijderen van een reservering
router.delete('/:id', deleteReservation);

// Route voor het ophalen van een specifieke reservering
router.get('/:id', getReservationById);

// PUT-route voor het bijwerken van een reservering
router.put('/:id', updateReservation);

module.exports = router;
