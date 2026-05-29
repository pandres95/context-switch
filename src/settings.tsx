import {
  List,
  ActionPanel,
  Action,
  Icon,
  Color,
  openExtensionPreferences,
} from "@raycast/api";
import { getContexts } from "./config";
import type { Context } from "./types";
import pkg from "../package.json";

function buildDeeplink(contextId: string): string {
  const args = encodeURIComponent(JSON.stringify({ to: contextId }));
  return `raycast://extensions/${pkg.author}/${pkg.name}/switch?arguments=${args}`;
}

export default function SettingsCommand() {
  const contexts = getContexts();

  return (
    <List navigationTitle="Context Switch — Settings">
      {contexts.length === 0 ? (
        <List.EmptyView
          icon={{ source: Icon.Gear, tintColor: Color.SecondaryText }}
          title="No contexts configured"
          description="Open Preferences to add your contexts."
          actions={
            <ActionPanel>
              <Action
                title="Open Preferences"
                icon={Icon.Gear}
                onAction={openExtensionPreferences}
              />
            </ActionPanel>
          }
        />
      ) : (
        <>
          <List.Section title="Contexts — create a Quicklink for each">
            {contexts.map((ctx: Context) => {
              const deeplink = buildDeeplink(ctx.id);
              return (
                <List.Item
                  key={ctx.id}
                  icon={ctx.icon}
                  title={ctx.label}
                  subtitle={ctx.id}
                  accessories={[{ text: "⏎ to create Quicklink" }]}
                  actions={
                    <ActionPanel>
                      <Action.CreateQuicklink
                        quicklink={{
                          name: `Context Switch: ${ctx.label}`,
                          link: deeplink,
                        }}
                      />
                      <Action
                        title="Open Preferences"
                        icon={Icon.Gear}
                        onAction={openExtensionPreferences}
                      />
                    </ActionPanel>
                  }
                />
              );
            })}
          </List.Section>

          <List.Section title="Next step — assign hotkeys">
            <List.Item
              icon={{ source: Icon.Keyboard, tintColor: Color.Blue }}
              title="Assign hotkeys to your Quicklinks"
              subtitle="Raycast Settings → Extensions → Quicklinks"
              actions={
                <ActionPanel>
                  <Action
                    title="Open Preferences"
                    icon={Icon.Gear}
                    onAction={openExtensionPreferences}
                  />
                </ActionPanel>
              }
            />
          </List.Section>
        </>
      )}
    </List>
  );
}
