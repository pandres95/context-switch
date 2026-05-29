import { FileReader } from "./readers/file";
import { URLSwitcher } from "./switchers/url";
import { JsonStorage } from "./storage/json";
import { getSwitcherTemplate, getReaderFilePath } from "../config";
import type { ContextReader, ContextSwitcher, StashStorage } from "./types";

// ─── Active plugins — swap implementations here ──────────────────────────────
//
// Readers:   FileReader (default, reads path from Preferences)
//            ShortcutsReader (agnostic, needs "Brain Stash: Get Context" shortcut)
// Switchers: URLSwitcher (default, template from Preferences)
//            ScriptSwitcher (~/.local/bin/ctx-*)
// Storage:   JsonStorage (default) | SqliteStorage (native, not bundleable by esbuild)

export const reader: ContextReader = new FileReader(getReaderFilePath());
export const switcher: ContextSwitcher = new URLSwitcher(getSwitcherTemplate());
export const storage: StashStorage = new JsonStorage();
