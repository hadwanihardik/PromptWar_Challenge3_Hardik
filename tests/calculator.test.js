import { describe, it, expect } from "vitest";
import {
  normalizeInput,
  calculateTransport,
  calculateEnergy,
  calculateTotal,
} from "../assets/js/calculator.js";

describe("Calculator Input Normalization", () => {
  it("should return 0 for negative values", () => {
    expect(normalizeInput(-5)).toBe(0);
  });

  it("should return 0 for non-numeric strings", () => {
    expect(normalizeInput("abc")).toBe(0);
  });

  it("should parse valid strings to numbers", () => {
    expect(normalizeInput("15.5")).toBe(15.5);
  });

  it("should cap values at the provided max", () => {
    expect(normalizeInput(1000, 500)).toBe(500);
  });
});

describe("Transport Calculations", () => {
  it("should calculate zero emissions for zero distance", () => {
    const result = calculateTransport({ dailyDistanceKm: 0 });
    expect(result).toBe(0);
  });

  it("should calculate correctly for a standard petrol car", () => {
    const result = calculateTransport({
      dailyDistanceKm: 10,
      commuteDaysPerMonth: 20,
      vehicleType: "carPetrol",
    });
    // 10km * 2 ways * 20 days * 0.192 = 76.8
    expect(result).toBeCloseTo(76.8);
  });

  it("walking should produce zero emissions", () => {
    const result = calculateTransport({
      dailyDistanceKm: 10,
      vehicleType: "walking",
    });
    expect(result).toBe(0);
  });
});

describe("Energy Calculations", () => {
  it("should reduce emissions if renewable flag is true", () => {
    const standard = calculateEnergy({ monthlyKwh: 100, hasRenewable: false });
    const renewable = calculateEnergy({ monthlyKwh: 100, hasRenewable: true });
    expect(renewable).toBeLessThan(standard);
  });
});

describe("Total Calculation", () => {
  it("should sum up all categories correctly", () => {
    const result = calculateTotal({
      transport: { dailyDistanceKm: 10, vehicleType: "carPetrol" }, // ~84.48
      energy: { monthlyKwh: 100 }, // 82
      food: { dietType: "vegan", foodWaste: "none" }, // 55
      shopping: { newClothingItemsPerMonth: 1 }, // 15
      waste: { recyclingLevel: "good" }, // 10
    });

    expect(result.monthlyTotal).toBeGreaterThan(0);
    expect(result.yearlyTotal).toBe(result.monthlyTotal * 12);
    expect(result.categories).toHaveProperty("transport");
    expect(result.categories).toHaveProperty("energy");
    expect(result.topCategory).toBeDefined();
    expect(result.ecoScore).toBeGreaterThanOrEqual(0);
    expect(result.ecoScore).toBeLessThanOrEqual(100);
  });
});
