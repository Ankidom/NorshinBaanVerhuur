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

        // Schakel foreign key constraints in
        db.run('PRAGMA foreign_keys = ON;', (err) => {
            if (err) {
                console.error('Fout bij het inschakelen van foreign key constraints:', err.message);
            } else {
                console.log('Foreign key constraints ingeschakeld.');

                // SQL-statements voor het aanmaken van de tabellen
                const createReservationsTable = `
                    CREATE TABLE IF NOT EXISTS reservations (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_email TEXT NOT NULL,
                        sport TEXT NOT NULL,
                        baan TEXT NOT NULL,
                        extra_ballen INTEGER DEFAULT 0,
                        extra_racket INTEGER DEFAULT 0,
                        datum DATE NOT NULL,
                        tijd TEXT NOT NULL,
                        FOREIGN KEY (user_email) REFERENCES users(email)
                    );
                `;

                const createUsersTable = `
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE
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

                    db.run(createUsersTable, (err) => {
                        if (err) {
                            console.error('Fout bij het aanmaken van de tabel voor gebruikers:', err.message);
                        } else {
                            console.log('Tabel voor gebruikers aangemaakt.');
                        }
                    });
                });
            }
        });
    }
});

module.exports = db;
