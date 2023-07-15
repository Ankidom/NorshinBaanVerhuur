const db = require('../database/db');

const getCourts = (req, res) => {
    const query = 'SELECT * FROM courts';

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Fout bij het ophalen van banen:', err);
            res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
        } else {
            res.json(rows);
        }
    });
};

const getCourtById = (req, res) => {
    const {id} = req.params;

    const query = 'SELECT * FROM courts WHERE id = ?';
    const params = [id];

    db.get(query, params, (err, row) => {
        if (err) {
            console.error('Fout bij het ophalen van de baan:', err);
            res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
        } else if (!row) {
            res.status(404).json({error: 'Baan niet gevonden.'});
        } else {
            res.json(row);
        }
    });
};

const createCourt = (req, res) => {
    const {type, location} = req.body;

    const insertCourtQuery = 'INSERT INTO courts (court_type, location) VALUES (?, ?)';

    db.run(insertCourtQuery, [type, location], function(err) {
        if (err) {
            console.error('Fout bij het toevoegen van de baan:', err.message);
            res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
        } else {
            const courtId = this.lastID;
            res.status(201).json({id: courtId, type, location});
        }
    });
};

const updateCourt = (req, res) => {
    const {id} = req.params;
    const {type, location} = req.body;

    const updateCourtQuery = 'UPDATE courts SET court_type = ?, location = ? WHERE id = ?';

    db.run(updateCourtQuery, [type, location, id], function(err) {
        if (err) {
            console.error('Fout bij het bijwerken van de baan:', err.message);
            res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
        } else {
            res.sendStatus(204);
        }
    });
};

const deleteCourt = (req, res) => {
    const {id} = req.params;

    const deleteCourtQuery = 'DELETE FROM courts WHERE id = ?';

    db.run(deleteCourtQuery, [id], function(err) {
        if (err) {
            console.error('Fout bij het verwijderen van de baan:', err.message);
            res.status(500).json({error: 'Er is een interne serverfout opgetreden.'});
        } else {
            res.sendStatus(204);
        }
    });
};

module.exports = {
    getCourts,
    getCourtById,
    createCourt,
    updateCourt,
    deleteCourt,
};
