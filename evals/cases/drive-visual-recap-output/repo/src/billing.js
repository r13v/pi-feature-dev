import { serializeInvoice } from "./store.js";

export function buildInvoice(id, items) {
  const totalCents = items.reduce((sum, item) => sum + item.cents, 0);
  const record = { id, totalCents };
  return { record, persisted: serializeInvoice(record) };
}
