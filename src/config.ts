import { getPreferenceValues } from "@raycast/api";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { homedir } from "os";
import { dirname } from "path";
import type { Context } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReaderConfig {
  type: "file" | "shell" | "shortcuts";
  path?: string; // for type: "file"
  command?: string; // for type: "shell"
  shortcutName?: string; // for type: "shortcuts"
}

export interface SwitcherConfig {
  type: "url" | "shell";
  template: string; // {context} placeholder
}

export interface Config {
  contexts: Context[];
  plugins: {
    reader: ReaderConfig;
    switcher: SwitcherConfig;
  };
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG_PATH = "~/.config/context-switch/config.json";

const DEFAULT_CONFIG: Config = {
  contexts: [],
  plugins: {
    reader: { type: "file", path: "~/.brain_stash/current_context" },
    switcher: {
      type: "url",
      template: "hammerspoon://switch-context?to={context}",
    },
  },
};

// ─── Utilities ────────────────────────────────────────────────────────────────

export function resolvePath(p: string): string {
  return p.replace(/^~/, homedir());
}

export function slugify(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Config I/O ───────────────────────────────────────────────────────────────

export function getConfigPath(): string {
  const prefs = getPreferenceValues<{ configPath?: string }>();
  const p = prefs.configPath?.trim();
  return p ? resolvePath(p) : resolvePath(DEFAULT_CONFIG_PATH);
}

export function readConfig(): Config {
  try {
    const configPath = getConfigPath();
    if (existsSync(configPath)) {
      const raw = JSON.parse(readFileSync(configPath, "utf8"));
      return {
        contexts: raw.contexts ?? DEFAULT_CONFIG.contexts,
        plugins: {
          reader: raw.plugins?.reader ?? DEFAULT_CONFIG.plugins.reader,
          switcher: raw.plugins?.switcher ?? DEFAULT_CONFIG.plugins.switcher,
        },
      };
    }
  } catch {
    // fall through
  }
  return DEFAULT_CONFIG;
}

export function writeConfig(config: Config): void {
  const configPath = getConfigPath();
  const dir = dirname(configPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
}

// ─── Helpers consumed by plugins/index.ts and components ──────────────────────

export function getContexts(): Context[] {
  return readConfig().contexts;
}

export function getContextLabel(id: string): string {
  return getContexts().find((c) => c.id === id)?.label ?? id;
}

export function getSwitcherTemplate(): string {
  return readConfig().plugins.switcher.template;
}

export function getReaderFilePath(): string {
  const reader = readConfig().plugins.reader;
  return resolvePath(reader.path ?? "~/.brain_stash/current_context");
}
