/**
 * goals.js
 * Logic for user goals.
 */

import { loadState, updateStateKey } from "./storage.js";

/**
 * Adds a new goal to the state.
 * @param {string} title
 * @param {number} targetValue
 * @param {string} metric - 'co2_saved', 'points', 'challenges'
 */
const addGoal = (title, targetValue, metric) => {
  const state = loadState();
  const newGoal = {
    id: `goal_${Date.now()}`,
    title,
    targetValue: Number(targetValue),
    metric,
    createdAt: new Date().toISOString(),
  };
  updateStateKey("goals", [...state.goals, newGoal]);
};

/**
 * Removes a goal by ID.
 * @param {string} goalId
 */
const removeGoal = (goalId) => {
  const state = loadState();
  updateStateKey(
    "goals",
    state.goals.filter((g) => g.id !== goalId),
  );
};

/**
 * Gets progress for all goals.
 * @returns {Object[]} Goals with progress mapped
 */
const getGoalsProgress = () => {
  const state = loadState();
  return state.goals.map((goal) => {
    let currentValue = 0;
    if (goal.metric === "co2_saved") {
      currentValue = state.totalCo2SavedKg;
    } else if (goal.metric === "points") {
      currentValue = state.totalPoints;
    } else if (goal.metric === "challenges") {
      currentValue = state.completedChallenges.length;
    }

    const percentage = Math.min(
      100,
      Math.round((currentValue / goal.targetValue) * 100),
    );

    return {
      ...goal,
      currentValue,
      percentage,
      isCompleted: percentage >= 100,
    };
  });
};

export { addGoal, removeGoal, getGoalsProgress };
