import { exec } from "child_process";
import type { ContextSwitcher, SwitchOptions } from "../types";

export class HammerspoonSwitcher implements ContextSwitcher {
  async switchTo(destination: string, options?: SwitchOptions): Promise<void> {
    const callback = options?.withPopCallback ? "&callback=raycast" : "";
    exec(`open 'hammerspoon://switch-context?to=${destination}${callback}'`);
  }
}
