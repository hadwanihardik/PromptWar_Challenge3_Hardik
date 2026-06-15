/**
 * emissionFactors.js
 * Central data file for all carbon emission factors used in CarbonSathi.
 * All values are approximate estimates intended for awareness, not certified accounting.
 * Sources: IPCC AR6, UK DEFRA 2023 emission factors, IEA 2023, EPA estimates.
 */

const EMISSION_FACTORS = {
  // ─── TRANSPORT ────────────────────────────────────────────────────────────
  transport: {
    carPetrol: {
      value: 0.192,
      unit: "kgCO2e/km",
      category: "transport",
      note: "Average petrol passenger car — DEFRA 2023.",
    },
    carDiesel: {
      value: 0.171,
      unit: "kgCO2e/km",
      category: "transport",
      note: "Average diesel passenger car — DEFRA 2023.",
    },
    carElectric: {
      value: 0.053,
      unit: "kgCO2e/km",
      category: "transport",
      note: "Average EV on India grid mix — IEA 2023 estimate.",
    },
    carHybrid: {
      value: 0.105,
      unit: "kgCO2e/km",
      category: "transport",
      note: "Average hybrid car estimate.",
    },
    publicBus: {
      value: 0.089,
      unit: "kgCO2e/km",
      category: "transport",
      note: "Urban bus average per passenger — DEFRA 2023.",
    },
    metro: {
      value: 0.041,
      unit: "kgCO2e/km",
      category: "transport",
      note: "Metro/subway per passenger — IEA estimate.",
    },
    walking: {
      value: 0.0,
      unit: "kgCO2e/km",
      category: "transport",
      note: "Zero direct emissions.",
    },
    cycling: {
      value: 0.0,
      unit: "kgCO2e/km",
      category: "transport",
      note: "Zero direct emissions.",
    },
    autoRickshaw: {
      value: 0.08,
      unit: "kgCO2e/km",
      category: "transport",
      note: "Average CNG auto-rickshaw estimate for India.",
    },
    domesticFlight: {
      value: 0.255,
      unit: "kgCO2e/km",
      category: "transport",
      note: "Per passenger km — DEFRA 2023 short-haul economy.",
    },
    internationalFlight: {
      value: 0.195,
      unit: "kgCO2e/km",
      category: "transport",
      note: "Per passenger km long-haul economy — DEFRA 2023.",
    },
  },

  // ─── HOME ENERGY ──────────────────────────────────────────────────────────
  energy: {
    electricityIndia: {
      value: 0.82,
      unit: "kgCO2e/kWh",
      category: "energy",
      note: "India average grid emission factor — CEA 2022.",
    },
    electricityGlobal: {
      value: 0.475,
      unit: "kgCO2e/kWh",
      category: "energy",
      note: "Global average grid — IEA 2023.",
    },
    lpgPerKg: {
      value: 2.983,
      unit: "kgCO2e/kg",
      category: "energy",
      note: "LPG combustion — IPCC AR6.",
    },
    naturalGasPerM3: {
      value: 1.996,
      unit: "kgCO2e/m³",
      category: "energy",
      note: "Natural gas combustion — DEFRA 2023.",
    },
  },

  // ─── FOOD ─────────────────────────────────────────────────────────────────
  food: {
    // Monthly baseline kgCO2e by diet type
    dietVegan: {
      value: 55,
      unit: "kgCO2e/month",
      category: "food",
      note: "Approximate vegan diet footprint — Poore & Nemecek 2018.",
    },
    dietVegetarian: {
      value: 80,
      unit: "kgCO2e/month",
      category: "food",
      note: "Approximate vegetarian diet footprint.",
    },
    dietPescatarian: {
      value: 95,
      unit: "kgCO2e/month",
      category: "food",
      note: "Approximate fish-eating diet footprint.",
    },
    dietOmnivore: {
      value: 130,
      unit: "kgCO2e/month",
      category: "food",
      note: "Average omnivore diet footprint.",
    },
    dietHighMeat: {
      value: 185,
      unit: "kgCO2e/month",
      category: "food",
      note: "High meat consumption diet footprint.",
    },
    // Food waste multiplier (added on top of diet)
    foodWasteNone: {
      value: 0,
      unit: "kgCO2e/month",
      category: "food",
      note: "No food waste.",
    },
    foodWasteLow: {
      value: 8,
      unit: "kgCO2e/month",
      category: "food",
      note: "Minimal food waste.",
    },
    foodWasteMedium: {
      value: 20,
      unit: "kgCO2e/month",
      category: "food",
      note: "Average food waste.",
    },
    foodWasteHigh: {
      value: 40,
      unit: "kgCO2e/month",
      category: "food",
      note: "High food waste.",
    },
  },

  // ─── SHOPPING ─────────────────────────────────────────────────────────────
  shopping: {
    // kgCO2e per clothing item purchased
    clothingItemNew: {
      value: 15,
      unit: "kgCO2e/item",
      category: "shopping",
      note: "Average new garment — WRAP 2020 estimate.",
    },
    clothingItemSecondhand: {
      value: 2,
      unit: "kgCO2e/item",
      category: "shopping",
      note: "Second-hand garment — reduced production impact.",
    },
    electronicsSmall: {
      value: 30,
      unit: "kgCO2e/item",
      category: "shopping",
      note: "Small electronics (headphones, accessories) manufacturing estimate.",
    },
    electronicsMedium: {
      value: 80,
      unit: "kgCO2e/item",
      category: "shopping",
      note: "Medium electronics (tablet, small appliance) estimate.",
    },
    electronicsLarge: {
      value: 300,
      unit: "kgCO2e/item",
      category: "shopping",
      note: "Large electronics (laptop, TV) — EPA/IEA estimate.",
    },
  },

  // ─── WASTE ────────────────────────────────────────────────────────────────
  waste: {
    // Monthly baseline kgCO2e from waste habits
    wasteNoRecycle: {
      value: 35,
      unit: "kgCO2e/month",
      category: "waste",
      note: "Landfill-heavy waste — average household estimate.",
    },
    wasteSomeRecycle: {
      value: 20,
      unit: "kgCO2e/month",
      category: "waste",
      note: "Partial recycling household estimate.",
    },
    wasteGoodRecycle: {
      value: 10,
      unit: "kgCO2e/month",
      category: "waste",
      note: "Good recycling and segregation estimate.",
    },
    wasteCompostRecycle: {
      value: 5,
      unit: "kgCO2e/month",
      category: "waste",
      note: "Excellent composting and recycling — minimal landfill.",
    },
  },

  // ─── FLIGHTS (per trip) ───────────────────────────────────────────────────
  flights: {
    domesticShorthaul: {
      value: 120,
      unit: "kgCO2e/trip",
      category: "transport",
      note: "Approximate domestic short-haul round trip per person.",
    },
    internationalLonghaul: {
      value: 900,
      unit: "kgCO2e/trip",
      category: "transport",
      note: "Approximate international long-haul round trip per person — economy.",
    },
  },
};

export { EMISSION_FACTORS };
export default EMISSION_FACTORS;
