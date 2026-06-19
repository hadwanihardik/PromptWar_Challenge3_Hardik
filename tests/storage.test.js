import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  loadState,
  saveState,
  resetState,
  updateStateKey,
  updatePreferences,
} from "../assets/js/storage.js";

describe("Storage Module", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should return default state when nothing is saved", () => {
    const state = loadState();
    expect(state).toBeDefined();
    expect(state.totalPoints).toBe(0);
    expect(state.footprint).toBeNull();
  });

  it("should save and load state correctly", () => {
    const state = loadState();
    state.totalPoints = 100;
    saveState(state);

    const loaded = loadState();
    expect(loaded.totalPoints).toBe(100);
  });

  it("should handle corrupt JSON gracefully by returning defaults", () => {
    localStorage.setItem("carbonwise_v1", "{ invalid json");
    const state = loadState();
    expect(state.totalPoints).toBe(0); // Default value
  });

  it("should reset state completely", () => {
    updateStateKey("totalPoints", 500);
    resetState();
    const state = loadState();
    expect(state.totalPoints).toBe(0);
  });

  it("should merge preferences without dropping existing values", () => {
    updatePreferences({ theme: "dark" });
    updatePreferences({ language: "hi" });

    const state = loadState();
    expect(state.preferences).toMatchObject({
      difficulty: "easy",
      theme: "dark",
      language: "hi",
    });
  });
});
