const sqlite3 = require('sqlite3').verbose();

// Pad naar de SQLite-database
const dbPath = 'test.sqlite';

// Maak een nieuwe databaseverbinding
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Fout bij het maken van de databaseverbinding:', err.message);
    } else {
        console.log('Databaseverbinding tot stand gebracht.');

        // SQL-statement voor het aanmaken van de tabel voor reserveringen
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

        // Voer het SQL-statement uit om de tabel voor reserveringen aan te maken
        db.run(createReservationsTable, (err) => {
            if (err) {
                console.error('Fout bij het aanmaken van de tabel voor reserveringen:', err.message);
            } else {
                console.log('Tabel voor reserveringen aangemaakt.');
            }

            // Sluit de databaseverbinding wanneer je klaar bent
            db.close((err) => {
                if (err) {
                    console.error('Fout bij het sluiten van de databaseverbinding:', err.message);
                } else {
                    console.log('Databaseverbinding gesloten.');
                }
            });
        });
    }
});
