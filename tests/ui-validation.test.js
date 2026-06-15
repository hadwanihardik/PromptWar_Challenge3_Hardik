import { describe, it, expect } from "vitest";
import { normalizeInput } from "../assets/js/calculator.js";

describe("UI Input Validation Logic (normalizeInput)", () => {
  it("should treat empty strings as 0", () => {
    expect(normalizeInput("")).toBe(0);
  });

  it("should treat whitespace as 0", () => {
    expect(normalizeInput("   ")).toBe(0);
  });

  it("should reject non-numeric inputs", () => {
    expect(normalizeInput("abc")).toBe(0);
    expect(normalizeInput("12abc")).toBe(12); // parseFloat behavior, which is fine
  });

  it("should reject negative inputs", () => {
    expect(normalizeInput(-10)).toBe(0);
    expect(normalizeInput("-50")).toBe(0);
  });

  it("should respect the maximum cap", () => {
    expect(normalizeInput(1000, 500)).toBe(500);
    expect(normalizeInput("1000", 500)).toBe(500);
  });
});
