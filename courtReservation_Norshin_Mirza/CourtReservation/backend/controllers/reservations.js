const sqlite3 = require('sqlite3').verbose();

// Pad naar de SQLite-database
const dbPad = 'database/db.sqlite';

// Functie voor het ophalen van alle reserveringen
const getReservations = (req, res) => {
    // Maak een nieuwe databaseverbinding
    const db = new sqlite3.Database(dbPad, (err) => {
        if (err) {
            console.error('Fout bij het maken van de databaseverbinding:', err.message);
            res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
        } else {
            // Query om alle reserveringen op te halen
            const query = 'SELECT * FROM reservations';

            // Voer de query uit
            db.all(query, (err, rows) => {
                if (err) {
                    console.error('Fout bij het ophalen van reserveringen:', err);
                    res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
                } else {
                    res.json(rows);
                }

                // Sluit de databaseverbinding
                db.close();
            });
        }
    });
};

// Functie voor het ophalen van reserveringen per datum
const getReservationsByDate = (req, res) => {
    const { datum } = req.query;

    // Maak een nieuwe databaseverbinding
    const db = new sqlite3.Database(dbPad, (err) => {
        if (err) {
            console.error('Fout bij het maken van de databaseverbinding:', err.message);
            res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
        } else {
            // Query om reserveringen voor de opgegeven datum op te halen
            const query = 'SELECT * FROM reservations WHERE datum = ?';
            const params = [datum];

            // Voer de query uit
            db.all(query, params, (err, rows) => {
                if (err) {
                    console.error('Fout bij het ophalen van reserveringen per datum:', err);
                    res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
                } else {
                    res.json(rows);
                }

                // Sluit de databaseverbinding
                db.close();
            });
        }
    });
};

// Functie voor het maken van een reservering
const createReservation = (req, res) => {
    const { naam, sport, baan, extra_ballen, extra_racket, datum, tijd } = req.body;

    // Maak een nieuwe databaseverbinding
    const db = new sqlite3.Database(dbPad, (err) => {
        if (err) {
            console.error('Fout bij het maken van de databaseverbinding:', err.message);
            res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
        } else {
            // SQL-statement voor het toevoegen van een reservering
            const insertReservationQuery =
                'INSERT INTO reservations (naam, sport, baan, extra_ballen, extra_racket, datum, tijd) VALUES (?, ?, ?, ?, ?, ?, ?)';

            // Voer het SQL-statement uit om de reservering toe te voegen
            db.run(
                insertReservationQuery,
                [naam, sport, baan, extra_ballen, extra_racket, datum, tijd],
                function (err) {
                    if (err) {
                        console.error('Fout bij het toevoegen van de reservering:', err.message);
                        res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
                    } else {
                        const reservationId = this.lastID;
                        res.status(201).json({ id: reservationId, naam, sport, baan, extra_ballen, extra_racket, datum, tijd });
                    }

                    // Sluit de databaseverbinding
                    db.close();
                }
            );
        }
    });
};

// Functie voor het verwijderen van een reservering
const deleteReservation = (req, res) => {
    const { id } = req.params;

    // Maak een nieuwe databaseverbinding
    const db = new sqlite3.Database(dbPad, (err) => {
        if (err) {
            console.error('Fout bij het maken van de databaseverbinding:', err.message);
            res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
        } else {
            // SQL-statement voor het verwijderen van de reservering
            const deleteReservationQuery = 'DELETE FROM reservations WHERE id = ?';

            // Voer het SQL-statement uit om de reservering te verwijderen
            db.run(deleteReservationQuery, [id], function (err) {
                if (err) {
                    console.error('Fout bij het verwijderen van de reservering:', err.message);
                    res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
                } else {
                    res.sendStatus(204); // Succesvol verwijderd, stuur een lege response met status 204 (No Content)
                }

                // Sluit de databaseverbinding
                db.close();
            });
        }
    });
};

// Functie voor het ophalen van een specifieke reservering
const getReservationById = (req, res) => {
    const { id } = req.params;

    // Maak een nieuwe databaseverbinding
    const db = new sqlite3.Database(dbPad, (err) => {
        if (err) {
            console.error('Fout bij het maken van de databaseverbinding:', err.message);
            res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
        } else {
            // Query om de reservering met het opgegeven ID op te halen
            const query = 'SELECT * FROM reservations WHERE id = ?';
            const params = [id];

            // Voer de query uit
            db.get(query, params, (err, row) => {
                if (err) {
                    console.error('Fout bij het ophalen van de reservering:', err);
                    res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
                } else if (!row) {
                    res.status(404).json({ error: 'Reservering niet gevonden.' });
                } else {
                    res.json(row);
                }

                // Sluit de databaseverbinding
                db.close();
            });
        }
    });
};

// Functie voor het bijwerken van een reservering
const updateReservation = (req, res) => {
    const { id } = req.params;
    const { naam, sport, baan, extra_ballen, extra_racket, datum, tijd } = req.body;

    // Maak een nieuwe databaseverbinding
    const db = new sqlite3.Database(dbPad, (err) => {
        if (err) {
            console.error('Fout bij het maken van de databaseverbinding:', err.message);
            res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
        } else {
            // SQL-statement voor het bijwerken van de reservering
            const updateReservationQuery =
                'UPDATE reservations SET naam = ?, sport = ?, baan = ?, extra_ballen = ?, extra_racket = ?, datum = ?, tijd = ? WHERE id = ?';

            // Voer het SQL-statement uit om de reservering bij te werken
            db.run(
                updateReservationQuery,
                [naam, sport, baan, extra_ballen, extra_racket, datum, tijd, id],
                function (err) {
                    if (err) {
                        console.error('Fout bij het bijwerken van de reservering:', err.message);
                        res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
                    } else {
                        res.sendStatus(204); // Succesvol bijgewerkt, stuur een lege response met status 204 (No Content)
                    }

                    // Sluit de databaseverbinding
                    db.close();
                }
            );
        }
    });
};


module.exports = {
    getReservations,
    getReservationsByDate,
    createReservation,
    deleteReservation,
    getReservationById,
    updateReservation,
};
