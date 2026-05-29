import { execSync } from "child_process";
import type { ContextReader } from "../types";

export class ShortcutsReader implements ContextReader {
  constructor(private readonly shortcutName = "Brain Stash: Get Context") {}

  async getCurrentContext(): Promise<string> {
    try {
      return execSync(`shortcuts run "${this.shortcutName}"`, { timeout: 3000 })
        .toString()
        .trim();
    } catch {
      return "personal";
    }
  }
}
