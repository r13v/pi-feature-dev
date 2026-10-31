---
worth: yes
where: src/export.js:4
added: 2026-09-02
source: ship 20260902-0900-export, f/export @ 1a2b3c4
---

# Export ignores the time zone of the account

**Idea.** Format the times in the CSV export in the time zone of the account.

**Why it matters.** Accountants in other time zones see events on the wrong
day near midnight, and their daily totals do not match the app.

**Evidence.** `toCsv` formats times with `toISOString()`, so every time is
in UTC.

**Why it was deferred.** The export task did not change formats; the account
settings did not store a time zone yet.
