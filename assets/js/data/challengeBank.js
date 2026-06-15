/**
 * challengeBank.js
 * Pre-defined eco challenge definitions for the CarbonSathi challenges section.
 * Each challenge has a unique ID, category, difficulty, point value, and estimated CO₂ saved.
 */

const CHALLENGE_BANK = [
  // ─── TRANSPORT ─────────────────────────────────────────────────────────────
  {
    id: "ch_t1",
    category: "transport",
    title: "Go Car-Free for a Day",
    description:
      "Spend an entire day without using a personal car. Use public transport, cycle, or walk.",
    difficulty: "easy",
    points: 50,
    co2SavedKg: 2.5,
    icon: "🚌",
    duration: "daily",
  },
  {
    id: "ch_t2",
    category: "transport",
    title: "Cycle to Work This Week",
    description:
      "Cycle to your workplace at least 3 times this week instead of driving.",
    difficulty: "medium",
    points: 120,
    co2SavedKg: 8,
    icon: "🚲",
    duration: "weekly",
  },
  {
    id: "ch_t3",
    category: "transport",
    title: "Carpool for 5 Days",
    description:
      "Share your commute with at least one colleague or neighbour for 5 consecutive working days.",
    difficulty: "medium",
    points: 100,
    co2SavedKg: 6,
    icon: "🤝",
    duration: "weekly",
  },
  {
    id: "ch_t4",
    category: "transport",
    title: "Use Only Public Transport This Week",
    description:
      "Avoid personal motorized vehicles for all local trips this week.",
    difficulty: "hard",
    points: 200,
    co2SavedKg: 15,
    icon: "🏙️",
    duration: "weekly",
  },

  // ─── ENERGY ────────────────────────────────────────────────────────────────
  {
    id: "ch_e1",
    category: "energy",
    title: "Unplug Before Bed",
    description: "Unplug all non-essential electronics every night for a week.",
    difficulty: "easy",
    points: 40,
    co2SavedKg: 1.5,
    icon: "🔌",
    duration: "weekly",
  },
  {
    id: "ch_e2",
    category: "energy",
    title: "AC at 24°C for a Week",
    description:
      "Set your air conditioner to 24°C or higher for an entire week.",
    difficulty: "easy",
    points: 60,
    co2SavedKg: 3,
    icon: "❄️",
    duration: "weekly",
  },
  {
    id: "ch_e3",
    category: "energy",
    title: "Switch Off Lights in Empty Rooms",
    description:
      "Consciously turn off lights every time you leave a room for one week.",
    difficulty: "easy",
    points: 30,
    co2SavedKg: 1,
    icon: "💡",
    duration: "weekly",
  },
  {
    id: "ch_e4",
    category: "energy",
    title: "Air-Dry Laundry for a Month",
    description:
      "Skip the tumble dryer and air-dry all your laundry for one month.",
    difficulty: "medium",
    points: 150,
    co2SavedKg: 12,
    icon: "👕",
    duration: "monthly",
  },

  // ─── FOOD ──────────────────────────────────────────────────────────────────
  {
    id: "ch_f1",
    category: "food",
    title: "Meatless Monday",
    description: "Eat no meat for one full day today.",
    difficulty: "easy",
    points: 40,
    co2SavedKg: 1.5,
    icon: "🥗",
    duration: "daily",
  },
  {
    id: "ch_f2",
    category: "food",
    title: "Zero Food Waste Week",
    description:
      "Plan meals carefully so that no food goes into the bin this entire week.",
    difficulty: "medium",
    points: 130,
    co2SavedKg: 6,
    icon: "♻️",
    duration: "weekly",
  },
  {
    id: "ch_f3",
    category: "food",
    title: "Cook from Scratch 5 Times",
    description:
      "Prepare 5 meals from whole ingredients, avoiding packaged and processed food.",
    difficulty: "medium",
    points: 100,
    co2SavedKg: 4,
    icon: "🍳",
    duration: "weekly",
  },
  {
    id: "ch_f4",
    category: "food",
    title: "Start Composting",
    description:
      "Begin composting your kitchen scraps today. Set up a bin or use a community composting point.",
    difficulty: "hard",
    points: 200,
    co2SavedKg: 10,
    icon: "🌱",
    duration: "once",
  },

  // ─── SHOPPING ──────────────────────────────────────────────────────────────
  {
    id: "ch_s1",
    category: "shopping",
    title: "Carry a Reusable Bag Today",
    description:
      "Use only reusable bags for all shopping today. Refuse plastic bags.",
    difficulty: "easy",
    points: 20,
    co2SavedKg: 0.3,
    icon: "👜",
    duration: "daily",
  },
  {
    id: "ch_s2",
    category: "shopping",
    title: "Repair One Item This Week",
    description:
      "Fix something that is broken — a garment, appliance, or device — instead of replacing it.",
    difficulty: "medium",
    points: 80,
    co2SavedKg: 10,
    icon: "🔧",
    duration: "weekly",
  },
  {
    id: "ch_s3",
    category: "shopping",
    title: "Zero New Clothes This Month",
    description:
      "Commit to buying no new clothing items for 30 days. Borrow, swap, or go without.",
    difficulty: "hard",
    points: 250,
    co2SavedKg: 30,
    icon: "👗",
    duration: "monthly",
  },
  {
    id: "ch_s4",
    category: "shopping",
    title: "Carry a Reusable Water Bottle",
    description:
      "Use a reusable water bottle for all your drinks today instead of buying single-use plastic.",
    difficulty: "easy",
    points: 25,
    co2SavedKg: 0.5,
    icon: "💧",
    duration: "daily",
  },

  // ─── WASTE ─────────────────────────────────────────────────────────────────
  {
    id: "ch_w1",
    category: "waste",
    title: "Segregate Waste for a Week",
    description: "Separate dry and wet waste correctly every day for 7 days.",
    difficulty: "easy",
    points: 60,
    co2SavedKg: 3,
    icon: "🗑️",
    duration: "weekly",
  },
  {
    id: "ch_w2",
    category: "waste",
    title: "Plastic-Free Day",
    description: "Go an entire day without using any single-use plastics.",
    difficulty: "medium",
    points: 70,
    co2SavedKg: 1,
    icon: "🚫",
    duration: "daily",
  },
  {
    id: "ch_w3",
    category: "waste",
    title: "Find a Recycling Drop-Off Point",
    description:
      "Locate your nearest e-waste or plastics recycling collection point and drop off one item.",
    difficulty: "medium",
    points: 90,
    co2SavedKg: 5,
    icon: "📍",
    duration: "once",
  },
];

export { CHALLENGE_BANK };
export default CHALLENGE_BANK;
