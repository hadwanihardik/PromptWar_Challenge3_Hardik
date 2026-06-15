/**
 * storage.js
 * localStorage helper for CarbonSathi.
 * All persistence is local-first. No sensitive data is stored.
 * Uses safe JSON parsing with fallbacks to prevent app crashes on corrupt data.
 */

const STORAGE_KEY = "carbonwise_v1";

/** Returns a fresh default app state when no saved data exists. */
const getDefaultState = () => ({
  footprint: null, // Last calculated footprint result
  completedChallenges: [], // Array of completed challenge IDs
  totalPoints: 0, // Accumulated green points
  totalCo2SavedKg: 0, // Total CO₂ saved via challenges
  earnedBadges: [], // Array of earned badge IDs
  goals: [], // User-defined goals array
  calculationsCount: 0, // Number of times user has calculated
  streakDays: 0, // Current daily streak
  lastActiveDate: null, // ISO date string of last activity
  preferences: {
    difficulty: "easy", // Preferred challenge/tip difficulty
    theme: "light", // UI theme preference
    language: "en", // Language preference
  },
  history: [], // Array of past footprint snapshots (last 12)
});

/**
 * Loads the full app state from localStorage.
 * Returns default state if nothing is saved or data is corrupt.
 * @returns {Object} App state object
 */
const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle missing keys from old versions
    return { ...getDefaultState(), ...parsed };
  } catch (_err) {
    // Corrupt JSON — return safe defaults
    return getDefaultState();
  }
};

/**
 * Saves the full app state to localStorage.
 * @param {Object} state - Complete app state to persist
 */
const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_err) {
    // Storage may be full or unavailable — fail silently
    console.warn("CarbonSathi: Could not save state to localStorage.");
  }
};

/**
 * Resets all app data back to defaults and clears localStorage.
 * @returns {Object} Fresh default state
 */
const resetState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_err) {
    console.warn("CarbonSathi: Could not clear localStorage.");
  }
  return getDefaultState();
};

/**
 * Updates a specific top-level key in the saved state.
 * @param {string} key - Top-level state key
 * @param {*} value - New value for that key
 * @returns {Object} Updated full state
 */
const updateStateKey = (key, value) => {
  const current = loadState();
  const updated = { ...current, [key]: value };
  saveState(updated);
  return updated;
};

/**
 * Saves a new footprint result, maintaining a rolling history of last 12 entries.
 * @param {Object} footprintResult - Result from Calculator.calculateTotal()
 * @returns {Object} Updated full state
 */
const saveFootprintResult = (footprintResult) => {
  const current = loadState();
  const history = [...(current.history || [])];

  // Keep history to last 12 entries (12 months)
  if (history.length >= 12) {
    history.shift();
  }
  history.push({
    ...footprintResult,
    savedAt: new Date().toISOString(),
  });

  const updated = {
    ...current,
    footprint: footprintResult,
    history,
    calculationsCount: (current.calculationsCount || 0) + 1,
    lastActiveDate: new Date().toISOString(),
  };
  saveState(updated);
  return updated;
};

/**
 * Marks a challenge as completed and updates points and CO₂ totals.
 * @param {string} challengeId - Challenge ID from CHALLENGE_BANK
 * @param {number} points - Points to award
 * @param {number} co2SavedKg - CO₂ saved to record
 * @returns {Object} Updated full state
 */
const completeChallenge = (challengeId, points, co2SavedKg) => {
  const current = loadState();
  if (current.completedChallenges.includes(challengeId)) {
    return current; // Already completed — no duplicate recording
  }
  const updated = {
    ...current,
    completedChallenges: [...current.completedChallenges, challengeId],
    totalPoints: current.totalPoints + points,
    totalCo2SavedKg: current.totalCo2SavedKg + co2SavedKg,
    lastActiveDate: new Date().toISOString(),
  };
  saveState(updated);
  return updated;
};

/**
 * Adds an earned badge to state (idempotent — won't duplicate).
 * @param {string} badgeId - Badge ID from BADGES
 * @returns {Object} Updated full state
 */
const earnBadge = (badgeId) => {
  const current = loadState();
  if (current.earnedBadges.includes(badgeId)) return current;
  const updated = {
    ...current,
    earnedBadges: [...current.earnedBadges, badgeId],
  };
  saveState(updated);
  return updated;
};

export {
  getDefaultState,
  loadState,
  saveState,
  resetState,
  updateStateKey,
  saveFootprintResult,
  completeChallenge,
  earnBadge,
};
