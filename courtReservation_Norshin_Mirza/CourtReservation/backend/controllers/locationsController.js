const db = require('../database/db');

const getLocations = (req, res) => {
    const query = 'SELECT * FROM locations';

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Fout bij het ophalen van locaties:', err);
            res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
        } else {
            res.json(rows);
        }
    });
};

module.exports = {
    getLocations,
};
