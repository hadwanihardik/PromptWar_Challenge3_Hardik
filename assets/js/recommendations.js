/**
 * recommendations.js
 * Personalized recommendation engine for CarbonSathi.
 * Logic is deterministic and pure — no DOM access, no side effects.
 *
 * Design:
 *  - Detects top emission category from footprint result
 *  - Filters tips by category, difficulty, and completed status
 *  - Returns ranked, actionable recommendations
 */

import ECO_TIPS from "./data/ecoTips.js";

/**
 * Returns the category with the highest emission from a footprint result.
 * @param {Object} categories - { transport, energy, food, shopping, waste } in kgCO2e
 * @returns {string} Top category key
 */
const getTopCategory = (categories = {}) => {
  if (!categories || typeof categories !== "object") return "transport";
  const entries = Object.entries(categories).filter(
    ([, v]) => typeof v === "number",
  );
  if (entries.length === 0) return "transport";
  return entries.sort((a, b) => b[1] - a[1])[0][0];
};

/**
 * Returns top-N personalized recommendations for a user.
 * Filters out tips already associated with completed challenge IDs.
 *
 * @param {Object} options
 * @param {Object} options.categories - Category emission scores
 * @param {string} options.difficulty - Preferred difficulty: 'easy'|'medium'|'hard'|'any'
 * @param {string[]} options.completedTipIds - IDs of tips/actions already actioned
 * @param {number} options.count - Number of recommendations to return (default 3)
 * @returns {Object[]} Array of tip objects
 */
const getTopRecommendations = ({
  categories = {},
  difficulty = "easy",
  completedTipIds = [],
  count = 3,
} = {}) => {
  const topCategory = getTopCategory(categories);

  // Sort categories by emission (descending)
  const sortedCategories = Object.entries(categories)
    .filter(([, v]) => typeof v === "number")
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  const recommendations = [];
  const seen = new Set();

  // Collect tips from highest-emission categories first
  for (const category of sortedCategories) {
    if (recommendations.length >= count) break;
    const categoryTips = ECO_TIPS[category] || [];

    const filtered = categoryTips.filter((tip) => {
      if (seen.has(tip.id)) return false;
      if (completedTipIds.includes(tip.id)) return false;
      if (difficulty !== "any" && tip.difficulty !== difficulty) return false;
      return true;
    });

    // Sort by estimated saving (highest impact first)
    filtered.sort(
      (a, b) => b.estimatedSavingKgPerMonth - a.estimatedSavingKgPerMonth,
    );

    for (const tip of filtered) {
      if (recommendations.length >= count) break;
      seen.add(tip.id);
      recommendations.push({
        ...tip,
        isPrimaryCategory: category === topCategory,
      });
    }
  }

  // If we still need more (e.g., difficulty filter too narrow), relax difficulty
  if (recommendations.length < count && difficulty !== "any") {
    for (const category of sortedCategories) {
      if (recommendations.length >= count) break;
      const categoryTips = ECO_TIPS[category] || [];
      const fallback = categoryTips.filter(
        (tip) => !seen.has(tip.id) && !completedTipIds.includes(tip.id),
      );
      fallback.sort(
        (a, b) => b.estimatedSavingKgPerMonth - a.estimatedSavingKgPerMonth,
      );
      for (const tip of fallback) {
        if (recommendations.length >= count) break;
        seen.add(tip.id);
        recommendations.push({
          ...tip,
          isPrimaryCategory: category === topCategory,
        });
      }
    }
  }

  return recommendations;
};

/**
 * Returns a human-readable eco profile label based on the top category.
 * @param {string} topCategory - Category key
 * @returns {Object} { label, description, icon }
 */
const getEcoProfile = (topCategory) => {
  const profiles = {
    transport: {
      label: "Commuter Optimizer",
      description:
        "Your biggest opportunity is in transport. Small shifts like carpooling or public transport days can make a big difference.",
      icon: "🚗",
    },
    energy: {
      label: "Energy Saver",
      description:
        "Home energy use is your top impact area. Smart appliance habits and renewable energy can dramatically cut your footprint.",
      icon: "⚡",
    },
    food: {
      label: "Food Footprint Reducer",
      description:
        "Food choices are your highest emission area. Moving toward more plant-based meals has the biggest impact.",
      icon: "🥗",
    },
    shopping: {
      label: "Conscious Consumer",
      description:
        "Shopping habits are your main area for improvement. Buying less, repairing more, and choosing second-hand helps most.",
      icon: "🛍️",
    },
    waste: {
      label: "Waste Warrior",
      description:
        "Improving your waste habits through recycling and composting can meaningfully cut your monthly emissions.",
      icon: "♻️",
    },
  };
  return profiles[topCategory] || profiles.transport;
};

/**
 * Returns all tips for a specific category, sorted by impact.
 * @param {string} category - Category key
 * @param {string[]} completedTipIds - Already completed tip IDs to exclude
 * @returns {Object[]} Sorted tips array
 */
const getTipsByCategory = (category, completedTipIds = []) => {
  const tips = ECO_TIPS[category] || [];
  return tips
    .filter((tip) => !completedTipIds.includes(tip.id))
    .sort((a, b) => b.estimatedSavingKgPerMonth - a.estimatedSavingKgPerMonth);
};

export {
  getTopCategory,
  getTopRecommendations,
  getEcoProfile,
  getTipsByCategory,
};
