import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { StashStorage } from "../types";
import type { Stash } from "../../types";

const STASH_DIR = join(homedir(), ".brain_stash");
export const DEFAULT_JSON_PATH = join(STASH_DIR, "stash.json");

interface StashFile {
  stashes: Stash[];
  nextId: number;
}

export class JsonStorage implements StashStorage {
  private readonly filePath: string;

  constructor(filePath = DEFAULT_JSON_PATH) {
    this.filePath = filePath;
    if (!existsSync(STASH_DIR)) mkdirSync(STASH_DIR, { recursive: true });
    if (!existsSync(this.filePath)) this.write({ stashes: [], nextId: 1 });
  }

  private read(): StashFile {
    try {
      return JSON.parse(readFileSync(this.filePath, "utf8"));
    } catch {
      return { stashes: [], nextId: 1 };
    }
  }

  private write(data: StashFile): void {
    writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf8");
  }

  save(context: string, text: string): void {
    const data = this.read();
    data.stashes.push({
      id: data.nextId++,
      timestamp: new Date().toISOString(),
      context,
      text,
    });
    this.write(data);
  }

  list(context: string): Stash[] {
    return this.read()
      .stashes.filter((s) => s.context === context)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp) || b.id - a.id);
  }

  delete(id: number): void {
    const data = this.read();
    data.stashes = data.stashes.filter((s) => s.id !== id);
    this.write(data);
  }

  count(context: string): number {
    return this.read().stashes.filter((s) => s.context === context).length;
  }
}
