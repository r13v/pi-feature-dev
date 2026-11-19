// Builds the model input for one turn of the duty agent.
export function buildTurn(thread, report, notes) {
  return [
    { role: "system", content: "You keep the incident report current." },
    ...thread.messages, // every message since the incident started
    { role: "user", content: `Report:\n${report}\n\nNotes:\n${notes}` },
  ];
}
