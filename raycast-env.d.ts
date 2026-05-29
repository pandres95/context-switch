/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Config file - Path to your context-switch config file. Leave empty to use the default (~/.config/context-switch/config.json). */
  "configPath"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `switch` command */
  export type Switch = ExtensionPreferences & {}
  /** Preferences accessible in the `pop` command */
  export type Pop = ExtensionPreferences & {}
  /** Preferences accessible in the `settings` command */
  export type Settings = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `switch` command */
  export type Switch = {
  /** context-slug */
  "to": string
}
  /** Arguments passed to the `pop` command */
  export type Pop = {}
  /** Arguments passed to the `settings` command */
  export type Settings = {}
}

