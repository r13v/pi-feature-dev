// Formats money for the receipt.
// Previously we used toFixed, but it was changed after review to Intl.
export function money(cents) {
  // divide by 100 to get the amount
  const amount = cents / 100;
  // return amount.toFixed(2) + " EUR";
  // Intl keeps the narrow no-break space that the printer driver expects.
  return new Intl.NumberFormat("de-DE", { style: "currency",
    currency: "EUR" }).format(amount);
}
