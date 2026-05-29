import { exec } from "child_process";
import { join } from "path";
import { homedir } from "os";
import type { ContextSwitcher } from "../types";

export class ScriptSwitcher implements ContextSwitcher {
  constructor(private readonly scriptsDir = join(homedir(), ".local", "bin")) {}

  async switchTo(destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = join(this.scriptsDir, `ctx-${destination}`);
      exec(script, (err) => (err ? reject(err) : resolve()));
    });
  }
}
