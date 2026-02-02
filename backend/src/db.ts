import sqlite3 from "sqlite3";

const db = new sqlite3.Database("data.db");

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);
});

export function createUser(username: string, passwordHash: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            [username, passwordHash],
            (err) => (err ? reject(err) : resolve())
        );
    });
}

export function findUserHash(username: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT password_hash FROM users WHERE username = ?",
            [username],
            (err, row: { password_hash?: string } | undefined) => {
                if (err) return reject(err);
                resolve(row?.password_hash ?? null);
            }
        );
    });
}
