// Builds the model input for one turn of the support assistant.
export function buildTurn(conversation, summary, notes) {
  return [
    { role: "system", content: "You keep the ticket summary current." },
    ...conversation.messages, // every message since the conversation started
    { role: "user", content: `Summary:\n${summary}\n\nNotes:\n${notes}` },
  ];
}
