// Two workers add 1 to a shared counter. Each worker reads the counter,
// then writes the value it read plus 1.

export const title = "Two workers add to one counter";

export const initial = { count: 0, worker: ["idle", "idle"], read: [0, 0] };

export const events = [0, 1].flatMap((w) => [
  { type: "read", w },
  { type: "write", w },
]);

export function step(s, e) {
  const worker = [...s.worker];
  const read = [...s.read];
  if (e.type === "read" && worker[e.w] === "idle") {
    worker[e.w] = "has read";
    read[e.w] = s.count;
    return { ...s, worker, read };
  }
  if (e.type === "write" && worker[e.w] === "has read") {
    worker[e.w] = "done";
    return { ...s, count: read[e.w] + 1, worker };
  }
  return s;
}

export const rules = {
  "When both workers are done, the counter is 2": (s) =>
    !s.worker.every((w) => w === "done") || s.count === 2,
};

export const done = (s) => s.worker.every((w) => w === "done");

export const label = (s) =>
  `${s.worker.map((w, i) => `W${i + 1} ${w}`).join(", ")}, count ${s.count}`;

// A write ends in a count that no label before it shows, so name the count.
export const arrow = (e, from, to) =>
  e.type === "read"
    ? `worker ${e.w + 1} reads`
    : `worker ${e.w + 1} writes ${to.count}`;
