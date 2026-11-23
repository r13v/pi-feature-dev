# Accepted export specification
Outcome: add a paged CSV exporter to an existing report library.
Design: src/page.js exports page(rows, offset, limit), returning a slice.
src/csv.js exports csv(rows), joining numeric columns with commas and rows with newlines.
No external packages, persistence, CLI or deploy. Tests: empty rows, pagination
boundaries and a two-row CSV. The implementation approach is already selected.
