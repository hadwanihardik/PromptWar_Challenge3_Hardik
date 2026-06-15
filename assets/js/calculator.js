/**
 * calculator.js
 * Pure carbon footprint calculation functions for CarbonSathi.
 * All emission factors are imported from the central data file.
 * Results are always in kgCO2e. Rounding happens only in the UI layer.
 *
 * Design principles:
 *  - Functions are pure (no side effects, no DOM access)
 *  - Invalid/negative inputs are normalized to zero
 *  - Monthly and yearly estimates are clearly separated
 */

import EMISSION_FACTORS from "./data/emissionFactors.js";

// ─── INPUT VALIDATION ────────────────────────────────────────────────────────

/**
 * Normalizes a numeric input to a non-negative number.
 * Returns 0 for invalid, negative, or non-numeric values.
 * @param {*} value - Raw input value
 * @param {number} [max=Infinity] - Optional maximum cap
 * @returns {number} Safe non-negative number
 */
const normalizeInput = (value, max = Infinity) => {
  const num = parseFloat(value);
  if (!isFinite(num) || isNaN(num) || num < 0) return 0;
  return Math.min(num, max);
};

// ─── TRANSPORT CALCULATIONS ───────────────────────────────────────────────────

/**
 * Calculates monthly transport CO₂e emissions.
 * @param {Object} input
 * @param {number} input.dailyDistanceKm - Daily one-way commute distance in km
 * @param {number} input.commuteDaysPerMonth - Working days per month (default 22)
 * @param {string} input.vehicleType - Key from EMISSION_FACTORS.transport
 * @param {number} input.domesticFlightsPerYear - Domestic flights per year
 * @param {number} input.internationalFlightsPerYear - International flights per year
 * @returns {number} Monthly transport kgCO2e
 */
const calculateTransport = ({
  dailyDistanceKm = 0,
  commuteDaysPerMonth = 22,
  vehicleType = "carPetrol",
  domesticFlightsPerYear = 0,
  internationalFlightsPerYear = 0,
} = {}) => {
  const distance = normalizeInput(dailyDistanceKm, 500);
  const days = normalizeInput(commuteDaysPerMonth, 31);
  const domFlights = normalizeInput(domesticFlightsPerYear, 365);
  const intlFlights = normalizeInput(internationalFlightsPerYear, 365);

  const factor =
    EMISSION_FACTORS.transport[vehicleType]?.value ??
    EMISSION_FACTORS.transport.carPetrol.value;

  // Commute: round trip each day × factor × working days
  const monthlyCommute = distance * 2 * days * factor;

  // Flights distributed as monthly average
  const monthlyDomFlight =
    (domFlights * EMISSION_FACTORS.flights.domesticShorthaul.value) / 12;
  const monthlyIntlFlight =
    (intlFlights * EMISSION_FACTORS.flights.internationalLonghaul.value) / 12;

  return monthlyCommute + monthlyDomFlight + monthlyIntlFlight;
};

// ─── ENERGY CALCULATIONS ──────────────────────────────────────────────────────

/**
 * Calculates monthly home energy CO₂e emissions.
 * @param {Object} input
 * @param {number} input.monthlyKwh - Monthly electricity usage in kWh
 * @param {number} input.monthlyLpgKg - Monthly LPG usage in kg
 * @param {boolean} input.hasRenewable - Whether rooftop solar/renewable reduces grid usage
 * @param {string} input.gridRegion - 'india' or 'global'
 * @returns {number} Monthly energy kgCO2e
 */
const calculateEnergy = ({
  monthlyKwh = 0,
  monthlyLpgKg = 0,
  hasRenewable = false,
  gridRegion = "india",
} = {}) => {
  const kwh = normalizeInput(monthlyKwh, 5000);
  const lpg = normalizeInput(monthlyLpgKg, 200);

  const gridFactor =
    gridRegion === "india"
      ? EMISSION_FACTORS.energy.electricityIndia.value
      : EMISSION_FACTORS.energy.electricityGlobal.value;

  // Renewable reduces effective electricity footprint by ~40%
  const effectiveKwh = hasRenewable ? kwh * 0.6 : kwh;

  const electricityCo2 = effectiveKwh * gridFactor;
  const lpgCo2 = lpg * EMISSION_FACTORS.energy.lpgPerKg.value;

  return electricityCo2 + lpgCo2;
};

// ─── FOOD CALCULATIONS ────────────────────────────────────────────────────────

/**
 * Calculates monthly food CO₂e emissions.
 * @param {Object} input
 * @param {string} input.dietType - 'vegan'|'vegetarian'|'pescatarian'|'omnivore'|'highMeat'
 * @param {string} input.foodWaste - 'none'|'low'|'medium'|'high'
 * @returns {number} Monthly food kgCO2e
 */
const calculateFood = ({
  dietType = "omnivore",
  foodWaste = "medium",
} = {}) => {
  const dietKeyMap = {
    vegan: "dietVegan",
    vegetarian: "dietVegetarian",
    pescatarian: "dietPescatarian",
    omnivore: "dietOmnivore",
    highMeat: "dietHighMeat",
  };
  const wasteKeyMap = {
    none: "foodWasteNone",
    low: "foodWasteLow",
    medium: "foodWasteMedium",
    high: "foodWasteHigh",
  };

  const dietKey = dietKeyMap[dietType] ?? "dietOmnivore";
  const wasteKey = wasteKeyMap[foodWaste] ?? "foodWasteMedium";

  const dietCo2 = EMISSION_FACTORS.food[dietKey]?.value ?? 130;
  const wasteCo2 = EMISSION_FACTORS.food[wasteKey]?.value ?? 20;

  return dietCo2 + wasteCo2;
};

// ─── SHOPPING CALCULATIONS ────────────────────────────────────────────────────

/**
 * Calculates monthly shopping CO₂e emissions.
 * @param {Object} input
 * @param {number} input.newClothingItemsPerMonth - New clothing items bought per month
 * @param {number} input.secondhandClothingItemsPerMonth - Secondhand items per month
 * @param {number} input.smallElectronicsPerYear - Small electronics per year
 * @param {number} input.largeElectronicsPerYear - Large electronics per year
 * @returns {number} Monthly shopping kgCO2e
 */
const calculateShopping = ({
  newClothingItemsPerMonth = 0,
  secondhandClothingItemsPerMonth = 0,
  smallElectronicsPerYear = 0,
  largeElectronicsPerYear = 0,
} = {}) => {
  const newClothing = normalizeInput(newClothingItemsPerMonth, 100);
  const secondhand = normalizeInput(secondhandClothingItemsPerMonth, 100);
  const smallElec = normalizeInput(smallElectronicsPerYear, 50);
  const largeElec = normalizeInput(largeElectronicsPerYear, 20);

  const clothingCo2 =
    newClothing * EMISSION_FACTORS.shopping.clothingItemNew.value +
    secondhand * EMISSION_FACTORS.shopping.clothingItemSecondhand.value;

  const electronicsCo2 =
    (smallElec * EMISSION_FACTORS.shopping.electronicsSmall.value +
      largeElec * EMISSION_FACTORS.shopping.electronicsLarge.value) /
    12;

  return clothingCo2 + electronicsCo2;
};

// ─── WASTE CALCULATIONS ───────────────────────────────────────────────────────

/**
 * Calculates monthly waste CO₂e emissions.
 * @param {Object} input
 * @param {string} input.recyclingLevel - 'none'|'some'|'good'|'compost'
 * @returns {number} Monthly waste kgCO2e
 */
const calculateWaste = ({ recyclingLevel = "some" } = {}) => {
  const levelKeyMap = {
    none: "wasteNoRecycle",
    some: "wasteSomeRecycle",
    good: "wasteGoodRecycle",
    compost: "wasteCompostRecycle",
  };
  const key = levelKeyMap[recyclingLevel] ?? "wasteSomeRecycle";
  return EMISSION_FACTORS.waste[key]?.value ?? 20;
};

// ─── TOTAL CALCULATION ────────────────────────────────────────────────────────

/**
 * Calculates the total monthly and yearly carbon footprint across all categories.
 * @param {Object} inputs - Combined inputs for all 5 categories
 * @returns {Object} Footprint result with category breakdown and totals
 */
const calculateTotal = (inputs = {}) => {
  const transport = calculateTransport(inputs.transport || {});
  const energy = calculateEnergy(inputs.energy || {});
  const food = calculateFood(inputs.food || {});
  const shopping = calculateShopping(inputs.shopping || {});
  const waste = calculateWaste(inputs.waste || {});

  const monthlyTotal = transport + energy + food + shopping + waste;
  const yearlyTotal = monthlyTotal * 12;

  // Eco score: 100 = global average of ~400 kgCO2e/month; lower is better
  // Score = max(0, 100 - (monthly / 4)) capped at 100
  const ecoScore = Math.max(0, Math.round(100 - monthlyTotal / 4));

  // Detect highest emission category
  const categories = { transport, energy, food, shopping, waste };
  const topCategory = Object.entries(categories).sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  return {
    categories,
    monthlyTotal,
    yearlyTotal,
    ecoScore,
    topCategory,
    note: "These are awareness estimates, not certified carbon accounting figures.",
  };
};

/**
 * Returns yearly footprint from a monthly result object.
 * @param {Object} result - Result from calculateTotal()
 * @returns {number} Yearly kgCO2e
 */
const getYearlyFromResult = (result) => {
  return (result?.monthlyTotal ?? 0) * 12;
};

export {
  normalizeInput,
  calculateTransport,
  calculateEnergy,
  calculateFood,
  calculateShopping,
  calculateWaste,
  calculateTotal,
  getYearlyFromResult,
};
