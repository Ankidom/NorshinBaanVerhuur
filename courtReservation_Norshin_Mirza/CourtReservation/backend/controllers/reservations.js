const db = require('../database/db');
const userController = require('./usersController');

// Functie voor het ophalen van alle reserveringen
const getReservations = (req, res) => {
    const query = 'SELECT * FROM reservations';

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Fout bij het ophalen van reserveringen:', err);
            res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
        } else {
            res.json(rows);
        }
    });
};

// Functie voor het ophalen van reserveringen per datum
const getReservationsByDate = (req, res) => {
    const {datum} = req.query;

    const query = 'SELECT * FROM reservations WHERE datum = ?';
    const params = [datum];

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Fout bij het ophalen van reserveringen per datum:', err);
            res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
        } else {
            res.json(rows);
        }
    });
};

const createReservation = (req, res) => {
    const {user_email, sport, baan, extra_ballen, extra_racket, datum, tijd} = req.body;

    // Controleer of de gebruiker bestaat op basis van de e-mail
    userController.checkUserEmail(user_email, (err, userExists) => {
        if (err) {
            console.error('Fout bij het controleren van de e-mail:', err);
            res.status(500).json({message: 'Er is een interne serverfout opgetreden.'});
        } else if (!userExists) {
            res.status(400).json({message: 'Gebruiker met opgegeven e-mail bestaat niet.'});
        } else {
            // Gebruiker bestaat, voeg de reservering toe aan de database
            const insertReservationQuery =
                'INSERT INTO reservations (user_email, sport, baan, extra_ballen, extra_racket, datum, tijd) VALUES (?, ?, ?, ?, ?, ?, ?)';

            db.run(
                insertReservationQuery,
                [user_email, sport, baan, extra_ballen, extra_racket, datum, tijd],
                function (err) {
                    if (err) {
                        console.error('Fout bij het toevoegen van de reservering:', err.message);
                        res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
                    } else {
                        const reservationId = this.lastID;
                        res.status(201).json({
                            id: reservationId,
                            user_email,
                            sport,
                            baan,
                            extra_ballen,
                            extra_racket,
                            datum,
                            tijd,
                        });
                    }
                }
            );
        }
    });
};
// Functie voor het verwijderen van een reservering
const deleteReservation = (req, res) => {
    const {id} = req.params;

    const deleteReservationQuery = 'DELETE FROM reservations WHERE id = ?';

    db.run(deleteReservationQuery, [id], function (err) {
        if (err) {
            console.error('Fout bij het verwijderen van de reservering:', err.message);
            res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
        } else {
            res.sendStatus(204);
        }
    });
};

// Functie voor het ophalen van een specifieke reservering
const getReservationById = (req, res) => {
    const {id} = req.params;

    const query = 'SELECT * FROM reservations WHERE id = ?';
    const params = [id];

    db.get(query, params, (err, row) => {
        if (err) {
            console.error('Fout bij het ophalen van de reservering:', err);
            res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
        } else if (!row) {
            res.status(404).json({error: 'Reservering niet gevonden.'});
        } else {
            res.json(row);
        }
    });
};

// Functie voor het bijwerken van een reservering
const updateReservation = (req, res) => {
    const {id} = req.params;
    const {naam, sport, baan, extra_ballen, extra_racket, datum, tijd} = req.body;

    const updateReservationQuery =
        'UPDATE reservations SET naam = ?, sport = ?, baan = ?, extra_ballen = ?, extra_racket = ?, datum = ?, tijd = ? WHERE id = ?';

    db.run(
        updateReservationQuery,
        [naam, sport, baan, extra_ballen, extra_racket, datum, tijd, id],
        function (err) {
            if (err) {
                console.error('Fout bij het bijwerken van de reservering:', err.message);
                res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
            } else {
                res.sendStatus(204);
            }
        }
    );
};

module.exports = {
    getReservations,
    getReservationsByDate,
    createReservation,
    deleteReservation,
    getReservationById,
    updateReservation,
};
