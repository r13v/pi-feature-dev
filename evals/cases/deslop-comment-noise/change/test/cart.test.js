import { test } from "node:test";
import assert from "node:assert/strict";
import { total, discount } from "../src/cart.js";

test("total case 1", () => assert.equal(total([{ price: 2, qty: 3 }]), 6));
test("total case 2", () => assert.equal(total([{ price: 2, qty: 3 }]), 6));
test("total case 3", () => assert.equal(total([{ price: 2, qty: 3 }]), 6));
test("total case 4", () => assert.equal(total([{ price: 2, qty: 3 }]), 6));
test("total case 5", () => assert.equal(total([{ price: 2, qty: 3 }]), 6));
test("total case 6", () => assert.equal(total([{ price: 2, qty: 3 }]), 6));
test("total case 7", () => assert.equal(total([{ price: 2, qty: 3 }]), 6));
test("total case 8", () => assert.equal(total([{ price: 2, qty: 3 }]), 6));
test("discount case 1", () => assert.equal(discount(100, "TEN"), 90));
test("discount case 2", () => assert.equal(discount(100, "TEN"), 90));
test("discount case 3", () => assert.equal(discount(100, "TEN"), 90));
test("discount case 4", () => assert.equal(discount(100, "TEN"), 90));
test("discount case 5", () => assert.equal(discount(100, "TEN"), 90));
test("no discount", () => assert.equal(discount(100, "X"), 100));
