import { serializeInvoice } from "./store.js";

export function buildInvoice(id, items, currency) {
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error(`Invalid currency: ${currency}`);
  }
  const totalCents = items.reduce((sum, item) => sum + item.cents, 0);
  const record = { id, totalCents, currency };
  return { record, persisted: serializeInvoice(record) };
}
