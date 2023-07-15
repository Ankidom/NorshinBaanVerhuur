const db = require('../database/db');

exports.getAllCourts = (req, res) => {
    const sql = 'SELECT * FROM courts';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
};

exports.getCourtById = (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM courts WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
};
// Functie om een nieuwe baan toe te voegen
exports.addCourt = (req, res) => {
    const { type, location } = req.body;
    const sql = 'INSERT INTO courts (type, location) VALUES (?, ?)';
    db.run(sql, [type, location], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Nieuwe baan succesvol toegevoegd', id: this.lastID });
    });
};

// Functie om een baan bij te werken
exports.updateCourt = (req, res) => {
    const { type, location } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE courts SET type = ?, location = ? WHERE id = ?';
    db.run(sql, [type, location, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: `Baan ${id} succesvol bijgewerkt` });
    });
};

// Functie om een baan te verwijderen
exports.deleteCourt = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM courts WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: `Baan ${id} succesvol verwijderd` });
    });
};