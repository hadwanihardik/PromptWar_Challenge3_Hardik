import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addGoal, getGoalsProgress, removeGoal } from "../assets/js/goals.js";
import { loadState, updateStateKey } from "../assets/js/storage.js";

describe("Goal tracking", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-19T10:00:00.000Z"));
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it("adds and removes user goals in local state", () => {
    addGoal("Save 20 kg CO2", 20, "co2_saved");

    const [goal] = loadState().goals;
    expect(goal).toMatchObject({
      id: "goal_1781863200000",
      title: "Save 20 kg CO2",
      targetValue: 20,
      metric: "co2_saved",
      createdAt: "2026-06-19T10:00:00.000Z",
    });

    removeGoal(goal.id);
    expect(loadState().goals).toEqual([]);
  });

  it("calculates progress for points, CO2, and challenge goals", () => {
    updateStateKey("goals", [
      { id: "g1", title: "Points", targetValue: 100, metric: "points" },
      { id: "g2", title: "CO2", targetValue: 20, metric: "co2_saved" },
      {
        id: "g3",
        title: "Challenges",
        targetValue: 2,
        metric: "challenges",
      },
    ]);
    updateStateKey("totalPoints", 75);
    updateStateKey("totalCo2SavedKg", 25);
    updateStateKey("completedChallenges", ["a", "b"]);

    expect(getGoalsProgress()).toEqual([
      expect.objectContaining({
        id: "g1",
        currentValue: 75,
        percentage: 75,
        isCompleted: false,
      }),
      expect.objectContaining({
        id: "g2",
        currentValue: 25,
        percentage: 100,
        isCompleted: true,
      }),
      expect.objectContaining({
        id: "g3",
        currentValue: 2,
        percentage: 100,
        isCompleted: true,
      }),
    ]);
  });
});
