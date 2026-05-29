import { showToast, Toast, popToRoot } from "@raycast/api";
import { useState, useEffect } from "react";
import { reader, switcher, storage } from "../plugins";
import { getContextLabel } from "../config";
import type { Context } from "../types";
import NoteForm from "./NoteForm";

interface Props {
  destination: Context;
  preloadedCurrentId?: string;
}

export default function SwitchContext({ destination, preloadedCurrentId }: Props) {
  const [currentId, setCurrentId] = useState<string | null>(
    preloadedCurrentId ?? null,
  );
  const isSameContext = currentId === destination.id;
  const fromLabel = currentId !== null ? getContextLabel(currentId) : "…";

  useEffect(() => {
    if (preloadedCurrentId) return;
    reader.getCurrentContext().then(setCurrentId);
  }, [preloadedCurrentId]);

  async function handleSubmit(values: { text: string }) {
    if (currentId === null) return;
    const text = values.text.trim();

    if (isSameContext) {
      if (text) {
        storage.save(currentId, text);
        await showToast({
          style: Toast.Style.Success,
          title: "Note saved",
          message: `→ [${destination.label}]`,
        });
      }
      popToRoot();
      return;
    }

    if (text) storage.save(currentId, text);

    const hasNotes = storage.count(destination.id) > 0;
    await switcher.switchTo(destination.id, { withPopCallback: hasNotes });

    await showToast({
      style: Toast.Style.Success,
      title: `Switching to [${destination.label}]`,
      message: text ? `Saved in [${fromLabel}]` : undefined,
    });
    popToRoot();
  }

  return (
    <NoteForm
      navigationTitle={
        currentId === null
          ? "Switch…"
          : isSameContext
            ? `[${destination.label}] — dump`
            : `[${fromLabel}] → [${destination.label}]`
      }
      description={
        currentId === null
          ? "Detecting context…"
          : isSameContext
            ? `In [${destination.label}]. Dump a note or press ⌘↩ to close.`
            : `In [${fromLabel}]. Going to [${destination.label}].`
      }
      placeholder={
        isSameContext
          ? "Quick note, task switch, raw dump… press ⌘↩ to save."
          : "Optional — press ⌘↩ to skip the dump and switch directly…"
      }
      actionTitle={isSameContext ? "Save note" : `Go to ${destination.label}`}
      isLoading={currentId === null}
      onSubmit={handleSubmit}
    />
  );
}
