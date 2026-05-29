import type { StashStorage } from "../types";
import type { Stash } from "../../types";

// Minimal interface satisfied by both better-sqlite3 and bun:sqlite
export interface SqliteStatement {
  run(...params: unknown[]): unknown;
  all(...params: unknown[]): unknown[];
  get(...params: unknown[]): unknown;
}

export interface SqliteDb {
  exec(sql: string): void;
  prepare(sql: string): SqliteStatement;
  close(): void;
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS stashes (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
    context   TEXT    NOT NULL,
    text      TEXT    NOT NULL
  )
`;

export class SqliteStorage implements StashStorage {
  constructor(private readonly db: SqliteDb) {
    this.db.exec(SCHEMA);
  }

  save(context: string, text: string): void {
    this.db
      .prepare("INSERT INTO stashes (context, text) VALUES (?, ?)")
      .run(context, text);
  }

  list(context: string): Stash[] {
    return this.db
      .prepare(
        "SELECT * FROM stashes WHERE context = ? ORDER BY timestamp DESC, id DESC",
      )
      .all(context) as Stash[];
  }

  delete(id: number): void {
    this.db.prepare("DELETE FROM stashes WHERE id = ?").run(id);
  }

  count(context: string): number {
    const row = this.db
      .prepare("SELECT COUNT(*) as n FROM stashes WHERE context = ?")
      .get(context) as { n: number };
    return row.n;
  }

  close(): void {
    this.db.close();
  }
}
