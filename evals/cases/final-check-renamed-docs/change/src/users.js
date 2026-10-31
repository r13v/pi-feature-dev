const USERS = { 1: { id: 1, name: "Ada" } };

export function loadUser(id) {
  return USERS[id] ?? null;
}
