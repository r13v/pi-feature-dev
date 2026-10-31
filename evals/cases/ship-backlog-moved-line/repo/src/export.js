// CSV export of account events.
import { escape } from "./csv.js";

const HEADER = ["time", "event", "amount"];

function row(e) {
  return [e.time, e.event, e.amount].map(escape).join(",");
}

export function toCsv(events) {
  const lines = events.map((e) => row({
    ...e,
    time: new Date(e.time).toISOString(),
  }));
  return [HEADER.join(","), ...lines].join("\n");
}
