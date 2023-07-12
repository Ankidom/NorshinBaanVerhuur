const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Pad naar de SQLite-database
const dbPath = path.join(__dirname, '..', 'db.sqlite');

// Maak een nieuwe databaseverbinding
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Fout bij het maken van de databaseverbinding:', err.message);
    } else {
        console.log('Databaseverbinding tot stand gebracht.');
    }
});

module.exports = db;
