import { buildInvoice } from "./billing.js";

export function handleCreateInvoice(req) {
  const { record } = buildInvoice(req.id, req.items);
  return { status: 201, body: record };
}
