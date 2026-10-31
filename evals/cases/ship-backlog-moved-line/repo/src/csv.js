export const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
