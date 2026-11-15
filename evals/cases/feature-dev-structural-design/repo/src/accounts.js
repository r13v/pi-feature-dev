import { db } from "./db.js";
export function debit(id, amount, conn = db) { conn.query("debit", id, amount); }
export function credit(id, amount, conn = db) { conn.query("credit", id, amount); }
