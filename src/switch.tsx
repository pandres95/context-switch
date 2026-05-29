import { useState, useEffect } from "react";
import { LaunchProps } from "@raycast/api";
import { getContexts } from "./config";
import { reader } from "./plugins";
import type { Context } from "./types";
import SwitchContext from "./components/SwitchContext";
import ContextPicker from "./components/ContextPicker";
import DumpNote from "./components/DumpNote";
import NoteForm from "./components/NoteForm";

interface Args {
  to?: string;
  destination?: string; // legacy — backward compat with old quicklinks
}

function parseDestination(args: Args | undefined): Context | undefined {
  const raw = args?.to?.trim() ?? args?.destination?.trim();
  if (!raw) return undefined;
  return getContexts().find((c) => c.id === raw);
}

// Detects current context once and routes:
//   same context  → DumpNote   (note without switch)
//   diff context  → SwitchContext (stash + switch)
function SmartSwitch({ destination }: { destination: Context }) {
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    reader.getCurrentContext().then(setCurrentId);
  }, []);

  if (currentId === null) {
    return (
      <NoteForm
        navigationTitle="…"
        description="Detecting context…"
        placeholder=""
        actionTitle="…"
        isLoading={true}
        onSubmit={() => {
          /* noop while loading */
        }}
      />
    );
  }

  if (currentId === destination.id) {
    return <DumpNote preloadedCurrentId={currentId} />;
  }

  return <SwitchContext destination={destination} preloadedCurrentId={currentId} />;
}

// No argument → ContextPicker
// ?arguments={"to":"slug"} via Quicklink → SmartSwitch
export default function SwitchCommand({
  arguments: args,
}: LaunchProps<{ arguments: Args }>) {
  const destination = parseDestination(args);
  return destination ? <SmartSwitch destination={destination} /> : <ContextPicker />;
}
