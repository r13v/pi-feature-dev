export function trimText(value) {
  return String(value).trim();
}

export function parsePort(text) {
  const port = Number(text);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid port: ${text}`);
  }
  return port;
}
