/**
 * maps.js
 * Google Maps deep link generator for CarbonSathi.
 * Generates search links for low-carbon travel options and eco-friendly services.
 * All links open in a new tab with secure rel attributes.
 */

const MAPS_BASE = "https://www.google.com/maps/search/";
const MAPS_DIR_BASE = "https://www.google.com/maps/dir/";

/**
 * Generates a Google Maps search URL for a given query.
 * @param {string} query - Search term
 * @param {string} [location] - Optional location context
 * @returns {string} Google Maps search URL
 */
const getMapsSearchUrl = (query, location = "") => {
  const fullQuery = location ? `${query} near ${location}` : query;
  return `${MAPS_BASE}${encodeURIComponent(fullQuery)}`;
};

/**
 * Generates a Google Maps directions URL comparing transit options.
 * @param {string} destination - Destination address or place
 * @param {string} [travelMode] - 'transit'|'bicycling'|'walking'
 * @returns {string} Google Maps directions URL
 */
const getMapsDirectionsUrl = (destination, travelMode = "transit") => {
  const modeMap = { transit: "r", bicycling: "b", walking: "w" };
  const modeParam = modeMap[travelMode] || "r";
  return `${MAPS_DIR_BASE}/${encodeURIComponent(destination)}/@?travelmode=${modeParam}`;
};

// ─── PRE-BUILT ECO SEARCH LINKS ───────────────────────────────────────────────

/**
 * Returns a Google Maps link to find nearby recycling centers.
 * @param {string} [city] - Optional city name for proximity
 * @returns {string} URL
 */
const getRecyclingCentersLink = (city = "") =>
  getMapsSearchUrl("recycling center e-waste drop-off", city);

/**
 * Returns a Google Maps link to find nearby EV charging stations.
 * @param {string} [city] - Optional city name
 * @returns {string} URL
 */
const getEvChargingLink = (city = "") =>
  getMapsSearchUrl("EV charging station electric vehicle", city);

/**
 * Returns a Google Maps link to find nearby public transport options.
 * @param {string} [city] - Optional city name
 * @returns {string} URL
 */
const getPublicTransportLink = (city = "") =>
  getMapsSearchUrl("metro station bus stop public transport", city);

/**
 * Returns a Google Maps link to explore bike routes.
 * @param {string} [destination] - Optional destination
 * @returns {string} URL
 */
const getBikeRoutesLink = (destination = "") => {
  if (destination) return getMapsDirectionsUrl(destination, "bicycling");
  return getMapsSearchUrl("bike lanes cycling routes");
};

/**
 * Returns a Google Maps link for organic/local food markets.
 * @param {string} [city] - Optional city name
 * @returns {string} URL
 */
const getLocalMarketsLink = (city = "") =>
  getMapsSearchUrl("organic market farmers market local produce", city);

/**
 * Returns a Google Maps link for second-hand stores.
 * @param {string} [city] - Optional city name
 * @returns {string} URL
 */
const getSecondhandStoresLink = (city = "") =>
  getMapsSearchUrl("second-hand thrift store vintage clothing", city);

/**
 * Returns all eco map links as an array of button definitions.
 * Used to render the Maps integration section in the UI.
 * @returns {Object[]} Array of { id, label, url, icon, description }
 */
const getAllEcoMapLinks = () => [
  {
    id: "map_recycling",
    label: "Find Recycling Centers",
    url: getRecyclingCentersLink(),
    icon: "♻️",
    description: "Drop off e-waste, plastics, and recyclables near you.",
    category: "waste",
  },
  {
    id: "map_ev",
    label: "EV Charging Stations",
    url: getEvChargingLink(),
    icon: "⚡",
    description: "Locate electric vehicle charging points near your route.",
    category: "transport",
  },
  {
    id: "map_transit",
    label: "Public Transport Near Me",
    url: getPublicTransportLink(),
    icon: "🚌",
    description: "Find metro stations, bus stops, and transit options.",
    category: "transport",
  },
  {
    id: "map_bike",
    label: "Explore Bike Routes",
    url: getBikeRoutesLink(),
    icon: "🚲",
    description: "Discover safe cycling lanes and bike-friendly paths.",
    category: "transport",
  },
  {
    id: "map_markets",
    label: "Local & Organic Markets",
    url: getLocalMarketsLink(),
    icon: "🥦",
    description:
      "Shop seasonal, local produce to reduce food transport emissions.",
    category: "food",
  },
  {
    id: "map_thrift",
    label: "Second-Hand Stores",
    url: getSecondhandStoresLink(),
    icon: "👗",
    description: "Find thrift and vintage shops for sustainable shopping.",
    category: "shopping",
  },
];

export {
  getMapsSearchUrl,
  getMapsDirectionsUrl,
  getRecyclingCentersLink,
  getEvChargingLink,
  getPublicTransportLink,
  getBikeRoutesLink,
  getLocalMarketsLink,
  getSecondhandStoresLink,
  getAllEcoMapLinks,
};
