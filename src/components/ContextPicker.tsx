import { List, ActionPanel, Action, useNavigation, Icon } from "@raycast/api";
import { getContexts } from "../config";
import type { Context } from "../types";
import SwitchContext from "./SwitchContext";

export default function ContextPicker() {
  const { push } = useNavigation();
  const contexts = getContexts();

  return (
    <List navigationTitle="Switch Context — where to?">
      {contexts.length === 0 ? (
        <List.EmptyView
          icon={Icon.Gear}
          title="No contexts configured"
          description="Run 'Context Switch: Settings' to set up your contexts."
        />
      ) : (
        contexts.map((ctx: Context) => (
          <List.Item
            key={ctx.id}
            icon={ctx.icon}
            title={ctx.label}
            subtitle={ctx.id}
            actions={
              <ActionPanel>
                <Action
                  title={`Switch to ${ctx.label}`}
                  onAction={() => push(<SwitchContext destination={ctx} />)}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
