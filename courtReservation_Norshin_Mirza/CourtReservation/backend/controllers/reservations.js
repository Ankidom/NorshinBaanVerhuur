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
    const {user_email, court_id, date, time} = req.body;

    // Controleer of het tijdslot beschikbaar is
    const checkSlotAvailabilityQuery = 'SELECT * FROM available_slots WHERE court_id = ? AND date = ? AND time = ?';
    const checkSlotAvailabilityParams = [court_id, date, time];

    db.get(checkSlotAvailabilityQuery, checkSlotAvailabilityParams, (err, row) => {
        if (err) {
            console.error('Fout bij het controleren van de beschikbaarheid van het tijdslot:', err);
            res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
        } else if (!row || !row.available) {
            res.status(400).json({error: 'Het geselecteerde tijdslot is niet beschikbaar.'});
        } else {
            // Het tijdslot is beschikbaar, ga verder met het aanmaken van de reservering
            const insertReservationQuery = 'INSERT INTO reservations (user_email, court_id, date, time) VALUES (?, ?, ?, ?)';

            db.run(
                insertReservationQuery,
                [user_email, court_id, date, time],
                function (err) {
                    if (err) {
                        console.error('Fout bij het aanmaken van de reservering:', err.message);
                        res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
                    } else {
                        const reservationId = this.lastID;

                        // Markeer het tijdslot als niet beschikbaar
                        const markSlotAsUnavailableQuery = 'UPDATE available_slots SET available = 0 WHERE court_id = ? AND date = ? AND time = ?';
                        const markSlotAsUnavailableParams = [court_id, date, time];

                        db.run(markSlotAsUnavailableQuery, markSlotAsUnavailableParams, function(err) {
                            if (err) {
                                console.error('Fout bij het markeren van het tijdslot als niet beschikbaar:', err.message);
                                res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
                            } else {
                                res.status(201).json({
                                    id: reservationId,
                                    user_email,
                                    court_id,
                                    date,
                                    time,
                                });
                            }
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
    const {user_email, extra_ballen, extra_racket, datum, tijd} = req.body;
    console.log('Ontvangen gegevens:', {user_email, extra_ballen, extra_racket, datum, tijd});


    const updateReservationQuery =
        'UPDATE reservations SET user_email = ?, extra_ballen = ?, extra_racket = ?, datum = ?, tijd = ? WHERE id = ?';

    db.run(
        updateReservationQuery,
        [user_email, extra_ballen, extra_racket, datum, tijd, id],
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
