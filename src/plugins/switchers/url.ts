import { exec } from "child_process";
import type { ContextSwitcher, SwitchOptions } from "../types";

export class URLSwitcher implements ContextSwitcher {
  constructor(private readonly template: string) {}

  async switchTo(destination: string, options?: SwitchOptions): Promise<void> {
    let url = this.template.replace(/\{context\}/g, destination);
    if (options?.withPopCallback) {
      url += (url.includes("?") ? "&" : "?") + "callback=raycast";
    }
    exec(`open '${url}'`);
  }
}
