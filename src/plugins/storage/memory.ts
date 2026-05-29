import type { StashStorage } from "../types";
import type { Stash } from "../../types";

export class MemoryStorage implements StashStorage {
  private stashes: Stash[] = [];
  private nextId = 1;

  save(context: string, text: string): void {
    this.stashes.push({
      id: this.nextId++,
      timestamp: new Date().toISOString(),
      context,
      text,
    });
  }

  list(context: string): Stash[] {
    return this.stashes
      .filter((s) => s.context === context)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  delete(id: number): void {
    this.stashes = this.stashes.filter((s) => s.id !== id);
  }

  count(context: string): number {
    return this.stashes.filter((s) => s.context === context).length;
  }
}
