export function money(cents) {
  // Intl keeps the narrow no-break space that the printer driver expects.
  return new Intl.NumberFormat("de-DE", { style: "currency",
    currency: "EUR" }).format(cents / 100);
}
