export function outcome(signal, error) {
  if (signal.aborted) return signal.reason === "cancelled" ? "ok" : "failed";
  return error ? "failed" : "ok";
}
