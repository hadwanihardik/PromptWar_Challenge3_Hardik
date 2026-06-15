import { describe, it, expect } from "vitest";
import {
  getTopCategory,
  getTopRecommendations,
} from "../assets/js/recommendations.js";

describe("Top Category Detection", () => {
  it("should return the category with the highest value", () => {
    const categories = {
      transport: 100,
      energy: 500,
      food: 200,
      shopping: 50,
      waste: 20,
    };
    expect(getTopCategory(categories)).toBe("energy");
  });

  it("should default to transport if all are zero or empty", () => {
    expect(getTopCategory({})).toBe("transport");
    expect(getTopCategory({ transport: 0, energy: 0 })).toBe("transport"); // 'transport' is alphabetically or insertion order first usually, but code handles it
  });
});

describe("Recommendation Engine", () => {
  it("should prioritize recommendations from the top category", () => {
    const categories = { transport: 10, energy: 500 }; // Energy is top
    const recs = getTopRecommendations({ categories, count: 1 });
    expect(recs.length).toBe(1);
    expect(recs[0].category).toBe("energy");
    expect(recs[0].isPrimaryCategory).toBe(true);
  });

  it("should filter out completed tips", () => {
    const categories = { transport: 500 };
    // Assuming 't1' is the highest impact transport tip. If we mark it completed, it should return the next one.
    const recsAll = getTopRecommendations({ categories, count: 1 });
    const topId = recsAll[0].id;

    const recsFiltered = getTopRecommendations({
      categories,
      count: 1,
      completedTipIds: [topId],
    });
    expect(recsFiltered[0].id).not.toBe(topId);
  });

  it("should filter by difficulty", () => {
    const categories = { transport: 500 };
    const recs = getTopRecommendations({
      categories,
      difficulty: "hard",
      count: 5,
    });
    // Assuming we have at least some 'hard' tips
    if (recs.length > 0) {
      expect(recs[0].difficulty).toBe("hard");
    }
  });
});
