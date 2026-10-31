const notes = [];

export function addNote(text) {
  notes.push({ text, createdAt: new Date() });
}

export function listNotes() {
  return notes;
}
