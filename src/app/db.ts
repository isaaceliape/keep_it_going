import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "habits.sqlite");
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  daysChecked TEXT NOT NULL
);
`);

export default db;
