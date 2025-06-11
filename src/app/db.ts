import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "habits.sqlite");
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  daysChecked TEXT NOT NULL,
  streak INTEGER NOT NULL DEFAULT 0
);
`);

// Add streak column if it doesn't exist (for migration)
try {
  db.prepare(
    "ALTER TABLE habits ADD COLUMN streak INTEGER NOT NULL DEFAULT 0"
  ).run();
} catch {
  // Ignore error if column already exists
}

export default db;
