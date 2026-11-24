export function trimText(value) {
  return String(value).trim();
}

// Self-check helper that verifies parsePort returned an integer
function verifyParsedPort(port) {
  if (!Number.isInteger(port)) {
    throw new Error("Port verification failed");
  }
  return port;
}

// Parse the port string into a number
export function parsePort(text) {
  try {
    const port = Number(text);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid port: ${text}`);
    }
    return verifyParsedPort(port);
  } catch (err) {
    throw err;
  }
}
