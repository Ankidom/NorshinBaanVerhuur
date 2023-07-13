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

        // SQL-statements voor het aanmaken van de tabellen
        const createReservationsTable = `
            CREATE TABLE IF NOT EXISTS reservations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                naam TEXT NOT NULL,
                sport TEXT NOT NULL,
                baan TEXT NOT NULL,
                extra_ballen INTEGER DEFAULT 0,
                extra_racket INTEGER DEFAULT 0,
                datum DATE NOT NULL,
                tijd TEXT NOT NULL
            );
        `;

        const createCourtsTable = `
            CREATE TABLE IF NOT EXISTS courts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                naam TEXT NOT NULL,
                locatie TEXT NOT NULL,
                type TEXT NOT NULL,
                FOREIGN KEY (locatie) REFERENCES locations (naam) ON DELETE CASCADE
            );
        `;

        const createLocationsTable = `
            CREATE TABLE IF NOT EXISTS locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                naam TEXT NOT NULL,
                adres TEXT NOT NULL,
                stad TEXT NOT NULL,
                postcode TEXT NOT NULL
            );
        `;

        // Voer de SQL-statements uit om de tabellen aan te maken
        db.serialize(() => {
            db.run(createReservationsTable, (err) => {
                if (err) {
                    console.error('Fout bij het aanmaken van de tabel voor reserveringen:', err.message);
                } else {
                    console.log('Tabel voor reserveringen aangemaakt.');
                }
            });

            db.run(createCourtsTable, (err) => {
                if (err) {
                    console.error('Fout bij het aanmaken van de tabel voor banen:', err.message);
                } else {
                    console.log('Tabel voor banen aangemaakt.');
                }
            });

            db.run(createLocationsTable, (err) => {
                if (err) {
                    console.error('Fout bij het aanmaken van de tabel voor locaties:', err.message);
                } else {
                    console.log('Tabel voor locaties aangemaakt.');
                }
            });
        });
    }
});

module.exports = db;