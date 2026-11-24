export function serializeInvoice(invoice) {
  return JSON.stringify({ id: invoice.id, totalCents: invoice.totalCents });
}
