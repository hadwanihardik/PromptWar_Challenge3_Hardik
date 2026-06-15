/**
 * badges.js
 * Badge definitions for the CarbonSathi gamification system.
 * Badges are unlocked based on challenge completions and total points.
 */

const BADGES = [
  // ─── STARTER BADGES ────────────────────────────────────────────────────────
  {
    id: "badge_first_step",
    name: "First Step",
    description: "Completed your first eco challenge.",
    icon: "🌱",
    unlockCondition: { type: "challenges_completed", count: 1 },
    color: "#4caf50",
  },
  {
    id: "badge_eco_curious",
    name: "Eco Curious",
    description: "Completed your first carbon footprint calculation.",
    icon: "🔍",
    unlockCondition: { type: "calculations_done", count: 1 },
    color: "#2196f3",
  },

  // ─── CHALLENGE MILESTONE BADGES ────────────────────────────────────────────
  {
    id: "badge_green_starter",
    name: "Green Starter",
    description: "Completed 5 eco challenges.",
    icon: "🌿",
    unlockCondition: { type: "challenges_completed", count: 5 },
    color: "#66bb6a",
  },
  {
    id: "badge_eco_warrior",
    name: "Eco Warrior",
    description: "Completed 10 eco challenges.",
    icon: "⚔️",
    unlockCondition: { type: "challenges_completed", count: 10 },
    color: "#1b5e20",
  },
  {
    id: "badge_champion",
    name: "Climate Champion",
    description: "Completed 20 eco challenges.",
    icon: "🏆",
    unlockCondition: { type: "challenges_completed", count: 20 },
    color: "#ffd700",
  },

  // ─── POINTS BADGES ─────────────────────────────────────────────────────────
  {
    id: "badge_100_points",
    name: "Century Saver",
    description: "Earned 100 green points.",
    icon: "💯",
    unlockCondition: { type: "points", count: 100 },
    color: "#ff9800",
  },
  {
    id: "badge_500_points",
    name: "Power Saver",
    description: "Earned 500 green points.",
    icon: "⚡",
    unlockCondition: { type: "points", count: 500 },
    color: "#ff5722",
  },
  {
    id: "badge_1000_points",
    name: "Planet Protector",
    description: "Earned 1,000 green points.",
    icon: "🌍",
    unlockCondition: { type: "points", count: 1000 },
    color: "#3f51b5",
  },

  // ─── CO2 SAVED BADGES ──────────────────────────────────────────────────────
  {
    id: "badge_10kg_saved",
    name: "Carbon Cutter",
    description: "Saved 10 kg CO₂ through challenges.",
    icon: "✂️",
    unlockCondition: { type: "co2_saved_kg", count: 10 },
    color: "#009688",
  },
  {
    id: "badge_50kg_saved",
    name: "Carbon Hero",
    description: "Saved 50 kg CO₂ through challenges.",
    icon: "🦸",
    unlockCondition: { type: "co2_saved_kg", count: 50 },
    color: "#673ab7",
  },
  {
    id: "badge_100kg_saved",
    name: "Carbon Legend",
    description: "Saved 100 kg CO₂ through challenges.",
    icon: "🌟",
    unlockCondition: { type: "co2_saved_kg", count: 100 },
    color: "#e91e63",
  },

  // ─── CATEGORY SPECIALIST BADGES ────────────────────────────────────────────
  {
    id: "badge_transport_star",
    name: "Transport Star",
    description: "Completed 5 transport challenges.",
    icon: "🚌",
    unlockCondition: {
      type: "category_challenges",
      category: "transport",
      count: 5,
    },
    color: "#0288d1",
  },
  {
    id: "badge_energy_saver",
    name: "Energy Saver",
    description: "Completed 5 energy challenges.",
    icon: "⚡",
    unlockCondition: {
      type: "category_challenges",
      category: "energy",
      count: 5,
    },
    color: "#f9a825",
  },
  {
    id: "badge_food_footprint",
    name: "Food Footprint Reducer",
    description: "Completed 5 food challenges.",
    icon: "🥗",
    unlockCondition: {
      type: "category_challenges",
      category: "food",
      count: 5,
    },
    color: "#388e3c",
  },
];

export { BADGES };
export default BADGES;
