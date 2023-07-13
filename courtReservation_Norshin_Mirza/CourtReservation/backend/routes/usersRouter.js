const express = require('express');
const userController = require('../controllers/usersController');

const router = express.Router();

// Endpoint voor het ophalen van alle gebruikers
router.get('/', userController.getUsers);

// Endpoint voor het toevoegen van een nieuwe gebruiker
router.post('/', userController.createUser);
router.post('/check-email', userController.checkUserEmail);

module.exports = router;
