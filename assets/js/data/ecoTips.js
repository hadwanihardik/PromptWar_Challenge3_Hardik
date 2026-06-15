/**
 * ecoTips.js
 * Categorized eco tips and action recommendations for the CarbonSathi recommendation engine.
 * Each tip includes a difficulty level, estimated impact, and explanation.
 */

const ECO_TIPS = {
  transport: [
    {
      id: "t1",
      title: "Switch to public transport once a week",
      description:
        "Taking the bus or metro just once a week instead of your car can save significant CO₂.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 8,
      tags: ["commute", "public-transport"],
      category: "transport",
    },
    {
      id: "t2",
      title: "Carpool with a colleague",
      description:
        "Sharing your commute with one other person halves your per-trip transport emissions.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 12,
      tags: ["carpool", "commute"],
      category: "transport",
    },
    {
      id: "t3",
      title: "Cycle or walk for trips under 3 km",
      description:
        "Short trips have disproportionately high emissions per km. Walking or cycling eliminates them.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 6,
      tags: ["cycling", "walking"],
      category: "transport",
    },
    {
      id: "t4",
      title: "Batch errands into one trip",
      description:
        "Combining multiple errands into a single journey reduces cold-start emissions and total distance.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 4,
      tags: ["errands", "efficiency"],
      category: "transport",
    },
    {
      id: "t5",
      title: "Switch to an electric or hybrid vehicle",
      description:
        "EVs produce ~70% less operational emissions than petrol cars on average.",
      difficulty: "hard",
      estimatedSavingKgPerMonth: 50,
      tags: ["ev", "vehicle"],
      category: "transport",
    },
    {
      id: "t6",
      title: "Work from home one more day per week",
      description:
        "Each WFH day eliminates a round-trip commute and its associated emissions.",
      difficulty: "medium",
      estimatedSavingKgPerMonth: 10,
      tags: ["wfh", "commute"],
      category: "transport",
    },
    {
      id: "t7",
      title: "Avoid one domestic flight this year",
      description:
        "A single domestic flight can generate 120+ kg CO₂. Train or bus alternatives are far lower.",
      difficulty: "medium",
      estimatedSavingKgPerMonth: 10,
      tags: ["flight", "travel"],
      category: "transport",
    },
  ],

  energy: [
    {
      id: "e1",
      title: "Set AC to 24°C instead of 18°C",
      description:
        "Each degree increase in AC setpoint saves ~6% electricity. 24°C is comfortable and efficient.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 8,
      tags: ["ac", "electricity"],
      category: "energy",
    },
    {
      id: "e2",
      title: "Unplug devices on standby",
      description:
        'Standby power ("vampire power") can account for 5–10% of home electricity use.',
      difficulty: "easy",
      estimatedSavingKgPerMonth: 4,
      tags: ["standby", "electricity"],
      category: "energy",
    },
    {
      id: "e3",
      title: "Switch to LED bulbs",
      description:
        "LED bulbs use 75% less energy than incandescent and last much longer.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 3,
      tags: ["lighting", "led"],
      category: "energy",
    },
    {
      id: "e4",
      title: "Use natural light during the day",
      description:
        "Open curtains and rearrange workspaces to maximize daylight — free and zero-emission.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 2,
      tags: ["lighting", "natural"],
      category: "energy",
    },
    {
      id: "e5",
      title: "Wash clothes in cold water",
      description:
        "90% of a washing machine's energy is used heating water. Cold washes clean just as well.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 5,
      tags: ["laundry", "electricity"],
      category: "energy",
    },
    {
      id: "e6",
      title: "Install a solar rooftop panel",
      description:
        "Even a 1 kW rooftop solar system can offset 80–120 kg CO₂ per month in India.",
      difficulty: "hard",
      estimatedSavingKgPerMonth: 80,
      tags: ["solar", "renewable"],
      category: "energy",
    },
    {
      id: "e7",
      title: "Use a smart power strip",
      description:
        "Smart strips automatically cut power to devices when not in use, reducing standby losses.",
      difficulty: "medium",
      estimatedSavingKgPerMonth: 5,
      tags: ["standby", "efficiency"],
      category: "energy",
    },
  ],

  food: [
    {
      id: "f1",
      title: "Have one plant-based meal per day",
      description:
        "Replacing one meat meal with a plant-based alternative can save 1–3 kg CO₂ per day.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 15,
      tags: ["plant-based", "diet"],
      category: "food",
    },
    {
      id: "f2",
      title: "Reduce beef and lamb consumption",
      description:
        "Beef produces ~20× more CO₂ than chicken and ~100× more than lentils per gram of protein.",
      difficulty: "medium",
      estimatedSavingKgPerMonth: 20,
      tags: ["meat", "beef"],
      category: "food",
    },
    {
      id: "f3",
      title: "Buy local and seasonal produce",
      description:
        "Local food has lower transportation emissions and supports regional farming.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 5,
      tags: ["local", "seasonal"],
      category: "food",
    },
    {
      id: "f4",
      title: "Reduce food waste by planning meals",
      description:
        "Food waste in landfills generates methane — a potent greenhouse gas. Plan ahead to use everything.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 10,
      tags: ["food-waste", "planning"],
      category: "food",
    },
    {
      id: "f5",
      title: "Start composting food scraps",
      description:
        "Home composting diverts organic waste from landfills, reducing methane emissions.",
      difficulty: "medium",
      estimatedSavingKgPerMonth: 8,
      tags: ["composting", "waste"],
      category: "food",
    },
    {
      id: "f6",
      title: "Choose dairy alternatives occasionally",
      description:
        "Oat milk produces ~6× fewer emissions than cow's milk. Even occasional swaps help.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 5,
      tags: ["dairy", "alternatives"],
      category: "food",
    },
  ],

  shopping: [
    {
      id: "s1",
      title: "Repair instead of replace",
      description:
        "Repairing clothes, electronics, and appliances avoids the high manufacturing emissions of new items.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 10,
      tags: ["repair", "reuse"],
      category: "shopping",
    },
    {
      id: "s2",
      title: "Buy second-hand clothing",
      description:
        "Second-hand garments use ~82% less water and produce 90% less CO₂ than new fast fashion.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 12,
      tags: ["second-hand", "clothing"],
      category: "shopping",
    },
    {
      id: "s3",
      title: "Delay electronics upgrades by one year",
      description:
        "The manufacturing phase of electronics is 70–80% of their lifetime carbon. Use them longer.",
      difficulty: "medium",
      estimatedSavingKgPerMonth: 25,
      tags: ["electronics", "lifespan"],
      category: "shopping",
    },
    {
      id: "s4",
      title: "Choose quality over quantity",
      description:
        "Buying fewer, higher-quality items that last longer reduces cumulative manufacturing emissions.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 8,
      tags: ["quality", "mindful"],
      category: "shopping",
    },
    {
      id: "s5",
      title: "Use a reusable bag for every shopping trip",
      description:
        "Single-use plastic bags have a significant lifecycle carbon footprint. Reusable bags pay off in just a few uses.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 2,
      tags: ["plastic", "reusable"],
      category: "shopping",
    },
  ],

  waste: [
    {
      id: "w1",
      title: "Segregate dry and wet waste daily",
      description:
        "Proper segregation enables effective recycling and composting, significantly reducing landfill methane.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 8,
      tags: ["segregation", "recycling"],
      category: "waste",
    },
    {
      id: "w2",
      title: "Carry a reusable water bottle",
      description:
        "Avoiding single-use plastic bottles reduces plastic waste and the energy used to produce them.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 3,
      tags: ["plastic", "reusable"],
      category: "waste",
    },
    {
      id: "w3",
      title: "Say no to single-use plastic straws and cutlery",
      description:
        "Bring reusable cutlery or choose plastic-free options when eating out.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 2,
      tags: ["plastic", "single-use"],
      category: "waste",
    },
    {
      id: "w4",
      title: "Recycle paper, glass, and metal correctly",
      description:
        "Correct recycling ensures materials re-enter the production cycle, saving significant energy and emissions.",
      difficulty: "easy",
      estimatedSavingKgPerMonth: 6,
      tags: ["recycling", "materials"],
      category: "waste",
    },
    {
      id: "w5",
      title: "Use a home vermicomposting kit",
      description:
        "Worm composting turns kitchen waste into rich soil and prevents organic waste from landfills.",
      difficulty: "medium",
      estimatedSavingKgPerMonth: 10,
      tags: ["composting", "organic"],
      category: "waste",
    },
  ],
};

export { ECO_TIPS };
export default ECO_TIPS;
