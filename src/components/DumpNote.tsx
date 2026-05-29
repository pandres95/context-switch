import { showToast, Toast, useNavigation } from "@raycast/api";
import { useState, useEffect } from "react";
import { reader, storage } from "../plugins";
import { getContextLabel } from "../config";
import NoteForm from "./NoteForm";
import PopList from "./PopList";

interface Props {
  preloadedCurrentId?: string;
}

export default function DumpNote({ preloadedCurrentId }: Props = {}) {
  const [currentId, setCurrentId] = useState<string | null>(
    preloadedCurrentId ?? null,
  );
  const label = currentId !== null ? getContextLabel(currentId) : "…";
  const { push } = useNavigation();

  useEffect(() => {
    if (preloadedCurrentId) return;
    reader.getCurrentContext().then(setCurrentId);
  }, [preloadedCurrentId]);

  async function handleSubmit(values: { text: string }) {
    if (currentId === null) return;
    const text = values.text.trim();
    if (text) {
      storage.save(currentId, text);
      await showToast({
        style: Toast.Style.Success,
        title: "Note saved",
        message: `→ [${label}]`,
      });
    }
    push(<PopList context={currentId} />);
  }

  return (
    <NoteForm
      navigationTitle={currentId === null ? "Dump" : `[${label}] — dump`}
      description={
        currentId === null
          ? "Detecting context…"
          : `In [${label}]. Note stays here — no context switch.`
      }
      placeholder="Quick note, task switch, raw dump… press ⌘↩ to save."
      actionTitle="Save note"
      isLoading={currentId === null}
      onSubmit={handleSubmit}
    />
  );
}
