import type { Stash } from "../types";

export interface ContextReader {
  getCurrentContext(): Promise<string>;
}

export interface SwitchOptions {
  /** Si es true, el switcher abre Raycast (pop list) cuando el switch está completo */
  withPopCallback?: boolean;
}

export interface ContextSwitcher {
  switchTo(destination: string, options?: SwitchOptions): Promise<void>;
}

export interface StashStorage {
  save(context: string, text: string): void;
  list(context: string): Stash[];
  delete(id: number): void;
  count(context: string): number;
}
