import { ActionPanel, Action, Form } from "@raycast/api";

interface Props {
  navigationTitle: string;
  description: string;
  placeholder: string;
  actionTitle: string;
  isLoading: boolean;
  onSubmit: (values: { text: string }) => void;
}

export default function NoteForm({
  navigationTitle,
  description,
  placeholder,
  actionTitle,
  isLoading,
  onSubmit,
}: Props) {
  return (
    <Form
      navigationTitle={navigationTitle}
      isLoading={isLoading}
      actions={
        <ActionPanel>
          {!isLoading && (
            <Action.SubmitForm title={actionTitle} onSubmit={onSubmit} />
          )}
        </ActionPanel>
      }
    >
      <Form.Description title="Context" text={description} />
      <Form.TextArea
        id="text"
        title="What's on your mind?"
        placeholder={placeholder}
        autoFocus
      />
    </Form>
  );
}
