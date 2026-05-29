import {
  ActionPanel,
  Action,
  Form,
  showToast,
  Toast,
  popToRoot,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { reader, switcher, storage } from "../plugins";
import { getContextLabel } from "../config";
import type { Context } from "../types";

interface Props {
  destination: Context;
}

export default function SwitchContext({ destination }: Props) {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const isSameContext = currentId === destination.id;
  const fromLabel = currentId !== null ? getContextLabel(currentId) : "…";

  useEffect(() => {
    reader.getCurrentContext().then(setCurrentId);
  }, []);

  async function handleSubmit(values: { text: string }) {
    if (currentId === null) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Detecting context…",
        message: "Wait a moment",
      });
      return;
    }

    if (isSameContext) {
      const count = storage.count(destination.id);
      await showToast({
        style: Toast.Style.Success,
        title: `Already in [${destination.label}]`,
        message:
          count > 0
            ? `${count} pending note${count > 1 ? "s" : ""}`
            : "No pending notes",
      });
      popToRoot();
      return;
    }

    const text = values.text.trim();
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

  const navTitle = isSameContext
    ? `[${destination.label}] — already here`
    : `[${fromLabel}] → [${destination.label}]`;

  return (
    <Form
      navigationTitle={navTitle}
      isLoading={currentId === null}
      actions={
        <ActionPanel>
          {currentId !== null && (
            <Action.SubmitForm
              title={
                isSameContext
                  ? `View notes for ${destination.label}`
                  : `Go to ${destination.label}`
              }
              onSubmit={handleSubmit}
            />
          )}
        </ActionPanel>
      }
    >
      <Form.Description
        title="Current context"
        text={
          currentId === null
            ? "Detecting…"
            : isSameContext
              ? `Already in [${destination.label}].`
              : `In [${fromLabel}]. Going to [${destination.label}].`
        }
      />
      {!isSameContext && (
        <Form.TextArea
          id="text"
          title="What's on your mind?"
          placeholder="Optional — press ⌘↩ to skip the dump and switch directly…"
          autoFocus
        />
      )}
    </Form>
  );
}
