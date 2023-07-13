const db = require('../database/db');

// Functie voor het ophalen van alle gebruikers
const getUsers = (req, res) => {
    const query = 'SELECT * FROM users';

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Fout bij het ophalen van gebruikers:', err);
            res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
        } else {
            res.json(rows);
        }
    });
};

// Functie voor het toevoegen van een nieuwe gebruiker
const createUser = (req, res) => {
    const { username, email } = req.body;

    const insertUserQuery = 'INSERT INTO users (username, email) VALUES (?, ?)';

    db.run(insertUserQuery, [username, email], function (err) {
        if (err) {
            console.error('Fout bij het toevoegen van de gebruiker:', err.message);
            res.status(500).json({ error: 'Er is een interne serverfout opgetreden.' });
        } else {
            const userId = this.lastID;
            res.status(201).json({ id: userId, username, email });
        }
    });
};

module.exports = {
    getUsers,
    createUser,
};
