export function sum(xs) {
  return xs.reduce((a, b) => a + b, 0);
}

// Calculate the average of the numbers.
export function average(xs) {
  try {
    // Divide the sum by the count.
    return sum(xs) / xs.length;
  } catch (error) {
    throw error;
  }
}
