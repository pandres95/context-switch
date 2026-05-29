import {
  ActionPanel,
  Action,
  List,
  Icon,
  Color,
  showToast,
  Toast,
  Clipboard,
  popToRoot,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { storage, switcher } from "../plugins";
import { getContextLabel } from "../config";
import type { Stash } from "../types";

interface SwitchAction {
  destinationId: string;
  destinationLabel: string;
}

interface Props {
  context: string | null;
  switchAction?: SwitchAction;
}

export default function PopList({ context, switchAction }: Props) {
  const label = context !== null ? getContextLabel(context) : "…";
  const [stashes, setStashes] = useState<Stash[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (context === null) return;
    setStashes(storage.list(context));
    setIsLoading(false);
  }, [context]);

  async function handlePop(stash: Stash) {
    await Clipboard.copy(stash.text);
    storage.delete(stash.id);
    setStashes(storage.list(context!));
    await showToast({
      style: Toast.Style.Success,
      title: "Popped to clipboard",
      message:
        stash.text.length > 60 ? stash.text.slice(0, 60) + "…" : stash.text,
    });
  }

  async function handleCopy(stash: Stash) {
    await Clipboard.copy(stash.text);
    await showToast({ style: Toast.Style.Success, title: "Copied" });
  }

  async function handleDelete(stash: Stash) {
    storage.delete(stash.id);
    setStashes(storage.list(context!));
    await showToast({ style: Toast.Style.Success, title: "Deleted" });
  }

  async function handleSwitch() {
    if (!switchAction) return;
    await switcher.switchTo(switchAction.destinationId);
    popToRoot();
  }

  const navTitle = switchAction
    ? `Notes in [${label}] — before going to [${switchAction.destinationLabel}]`
    : `Pop — [${label}]`;

  return (
    <List
      navigationTitle={navTitle}
      isLoading={isLoading}
      searchBarPlaceholder="Search your stashes…"
    >
      {!isLoading && stashes.length === 0 ? (
        <List.EmptyView
          icon={{ source: Icon.Text, tintColor: Color.SecondaryText }}
          title={`No stashes in [${label}]`}
          description={
            switchAction
              ? `Press ⌘↩ to go to [${switchAction.destinationLabel}].`
              : "Use Context Switch to save what's on your mind before switching."
          }
          actions={
            switchAction ? (
              <ActionPanel>
                <Action
                  title={`Go to ${switchAction.destinationLabel}`}
                  icon={Icon.ArrowRight}
                  onAction={handleSwitch}
                />
              </ActionPanel>
            ) : undefined
          }
        />
      ) : (
        stashes.map((s) => (
          <List.Item
            key={s.id}
            icon={{ source: Icon.Clipboard, tintColor: Color.Blue }}
            title={s.text}
            subtitle={new Date(s.timestamp).toLocaleString("en", {
              dateStyle: "short",
              timeStyle: "short",
            })}
            actions={
              <ActionPanel>
                {switchAction && (
                  <Action
                    title={`Go to ${switchAction.destinationLabel}`}
                    icon={Icon.ArrowRight}
                    onAction={handleSwitch}
                  />
                )}
                <Action
                  title="Pop (copy & Delete)"
                  icon={Icon.Clipboard}
                  onAction={() => handlePop(s)}
                />
                <Action
                  title="Copy Only"
                  icon={Icon.CopyClipboard}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                  onAction={() => handleCopy(s)}
                />
                <Action
                  title="Delete"
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                  onAction={() => handleDelete(s)}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
