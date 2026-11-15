export function outcome(signal, error) {
  if (signal.aborted) return "ok";
  if (error) return "failed";
  return "ok";
}
