import { test } from "node:test";
import assert from "node:assert/strict";
import { total, discount } from "../src/cart.js";

test("total", () => assert.equal(total([{ price: 2, qty: 3 }]), 6));
test("discount", () => assert.equal(discount(100, "TEN"), 90));
test("no discount", () => assert.equal(discount(100, "X"), 100));
