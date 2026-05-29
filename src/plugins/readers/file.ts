import { readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { ContextReader } from "../types";

export const DEFAULT_CONTEXT_FILE = join(
  homedir(),
  ".brain_stash",
  "current_context",
);

export class FileReader implements ContextReader {
  constructor(private readonly filePath = DEFAULT_CONTEXT_FILE) {}

  async getCurrentContext(): Promise<string> {
    try {
      return readFileSync(this.filePath, "utf8").trim();
    } catch {
      return "personal";
    }
  }
}
