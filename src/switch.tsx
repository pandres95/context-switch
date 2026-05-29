import { LaunchProps } from "@raycast/api";
import { getContexts } from "./config";
import type { Context } from "./types";
import SwitchContext from "./components/SwitchContext";
import ContextPicker from "./components/ContextPicker";

interface Args {
  to?: string; // current argument name
  destination?: string; // legacy — backward compat with old quicklinks
}

function parseDestination(args: Args | undefined): Context | undefined {
  const raw = args?.to?.trim() ?? args?.destination?.trim();
  if (!raw) return undefined;
  return getContexts().find((c) => c.id === raw);
}

// Invocado sin argumento → ContextPicker.
// Invocado con ?arguments={"to":"slug"} vía Quicklink → SwitchContext directo.
export default function SwitchCommand({
  arguments: args,
}: LaunchProps<{ arguments: Args }>) {
  const context = parseDestination(args);
  return context ? <SwitchContext destination={context} /> : <ContextPicker />;
}
