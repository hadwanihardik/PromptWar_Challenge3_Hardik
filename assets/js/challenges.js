/**
 * challenges.js
 * Logic for managing challenges and badges.
 */

import CHALLENGE_BANK from "./data/challengeBank.js";
import BADGES from "./data/badges.js";
import { loadState, completeChallenge, earnBadge } from "./storage.js";

/**
 * Gets a list of available (uncompleted) challenges.
 * @returns {Object[]}
 */
const getAvailableChallenges = () => {
  const state = loadState();
  return CHALLENGE_BANK.filter(
    (ch) => !state.completedChallenges.includes(ch.id),
  );
};

/**
 * Checks if any new badges should be awarded based on current state.
 * @returns {Object[]} Array of newly earned badges
 */
const checkAndAwardBadges = () => {
  const state = loadState();
  const newlyEarned = [];

  for (const badge of BADGES) {
    if (state.earnedBadges.includes(badge.id)) continue;

    let unlocked = false;
    const cond = badge.unlockCondition;

    if (
      cond.type === "challenges_completed" &&
      state.completedChallenges.length >= cond.count
    ) {
      unlocked = true;
    } else if (
      cond.type === "calculations_done" &&
      state.calculationsCount >= cond.count
    ) {
      unlocked = true;
    } else if (cond.type === "points" && state.totalPoints >= cond.count) {
      unlocked = true;
    } else if (
      cond.type === "co2_saved_kg" &&
      state.totalCo2SavedKg >= cond.count
    ) {
      unlocked = true;
    } else if (cond.type === "category_challenges") {
      const catCount = state.completedChallenges.filter((id) => {
        const ch = CHALLENGE_BANK.find((c) => c.id === id);
        return ch && ch.category === cond.category;
      }).length;
      if (catCount >= cond.count) unlocked = true;
    }

    if (unlocked) {
      earnBadge(badge.id);
      newlyEarned.push(badge);
    }
  }

  return newlyEarned;
};

/**
 * Marks a challenge as done and checks for new badges.
 * @param {string} challengeId
 * @returns {Object} Result object containing success and newlyEarnedBadges
 */
const completeChallengeAction = (challengeId) => {
  const ch = CHALLENGE_BANK.find((c) => c.id === challengeId);
  if (!ch) return { success: false, error: "Challenge not found" };

  completeChallenge(challengeId, ch.points, ch.co2SavedKg);
  const newlyEarnedBadges = checkAndAwardBadges();

  return {
    success: true,
    pointsAwarded: ch.points,
    co2SavedKg: ch.co2SavedKg,
    newlyEarnedBadges,
  };
};

export { getAvailableChallenges, checkAndAwardBadges, completeChallengeAction };
