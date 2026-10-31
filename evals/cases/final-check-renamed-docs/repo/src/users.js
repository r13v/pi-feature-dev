const USERS = { 1: { id: 1, name: "Ada" } };

export function fetchUser(id) {
  return USERS[id] ?? null;
}
