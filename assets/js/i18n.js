/**
 * i18n.js
 * Internationalization module for CarbonSathi.
 * Provides English, Hindi, Gujarati, and Marathi translations.
 *
 * Design:
 *  - All UI strings are keyed in a flat dictionary per language
 *  - translatePage() scans for data-i18n (textContent) and data-i18n-ph (placeholder)
 *  - Language preference is persisted to localStorage
 *  - Falls back to English if a key is missing in the active language
 */

import { loadState, updateStateKey } from "./storage.js";

// ─── TRANSLATION DICTIONARIES ─────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    // App chrome
    appName: "🌿 CarbonSathi",
    tagline: "Understand. Track. Reduce.",
    homeIntro:
      "CarbonSathi is your personal sustainability companion. Calculate your carbon footprint and get simple, actionable tips to make a real difference.",

    // Navigation
    navHome: "Home",
    navCalculator: "Calculator",
    navDashboard: "Dashboard",
    navRecommendations: "Actions",
    navChallenges: "Challenges",
    navAssistant: "Assistant",
    languageSelectorLabel: "Language Selector",
    themeToggleLabel: "Toggle Theme",
    assistantInputLabel: "Type your message",
    apiKeyLabel: "Gemini API Key",

    // Calculator section
    calcTitle: "Carbon Calculator",
    calcTransportTitle: "🚗 Transport",
    calcDailyCommuteLabel: "Daily Commute (km, one way)",
    calcVehicleTypeLabel: "Primary Transport",
    calcEnergyTitle: "⚡ Home Energy",
    calcMonthlyKwhLabel: "Monthly Electricity (kWh)",
    calcFoodTitle: "🥗 Food",
    calcDietTypeLabel: "Diet Type",
    calcFoodWasteLabel: "Food Waste",
    calcShoppingTitle: "🛍️ Shopping & Waste",
    calcNewClothesLabel: "New Clothes / Month",
    calcRecyclingLabel: "Recycling Habit",
    calcSubmitBtn: "Calculate Results",
    calcStartBtn: "Calculate My Footprint",

    // Select options — Transport
    optCarPetrol: "Petrol Car",
    optCarDiesel: "Diesel Car",
    optCarElectric: "Electric Car",
    optPublicBus: "Public Bus",
    optMetro: "Metro / Train",
    optWalking: "Walking / Cycling",

    // Select options — Diet
    optOmnivore: "Omnivore (Average Meat)",
    optHighMeat: "High Meat",
    optPescatarian: "Pescatarian",
    optVegetarian: "Vegetarian",
    optVegan: "Vegan",

    // Select options — Food Waste
    optWasteNone: "None",
    optWasteLow: "Low",
    optWasteMedium: "Medium",
    optWasteHigh: "High",

    // Select options — Recycling
    optRecycleNone: "Rarely Recycle",
    optRecycleSome: "Some Recycling",
    optRecycleGood: "Good Recycling & Segregation",
    optRecycleCompost: "Recycle & Compost",

    // Dashboard
    dashTitle: "Your Dashboard",
    dashMonthly: "Monthly Footprint",
    dashYearly: "Estimated yearly",
    dashEcoScore: "Eco Score",
    dashCategoryTitle: "Category Breakdown",
    dashPlaceholder: "Please complete the calculator first.",
    dashPlaceholderHint:
      "Use the Calculator tab to estimate your carbon footprint, then come back here for a detailed breakdown.",

    // Recommendations
    recsTitle: "Personalized Actions",
    recsSubtitle:
      "Based on your footprint, here are the most effective ways to reduce your impact.",
    recsPlaceholder: "Please complete the calculator first.",
    recsPlaceholderHint:
      "Once you calculate your footprint, we'll show personalized actions tailored to your biggest emission areas.",

    // Challenges
    chalTitle: "Eco Challenges",
    chalSubtitle: "Complete challenges to earn green points and badges.",
    chalAllDone: "You have completed all available challenges! Great job!",

    // Assistant
    astTitle: "AI Eco Assistant",
    astSubtitle: "Ask questions about your footprint or request advice.",
    astSendBtn: "Send",
    astPlaceholder: "e.g., How can I reduce electricity usage?",
    assistantGreeting:
      "Hi! I am your CarbonSathi. Ask me how to reduce your footprint or about your recent results.",
    assistantError:
      "Sorry, something went wrong while connecting to the assistant.",

    // API
    apiSettings: "API Settings (Optional)",
    apiDesc:
      "CarbonSathi works offline, but you can add a Gemini API Key for personalized AI advice.",
    apiPlaceholder: "Enter Gemini API Key (session only)",
    apiSaveBtn: "Save",

    // Dashboard sub-sections
    ecoServicesTitle: "📍 Local Eco Services",
    ecoServicesDesc: "Find low-carbon options near you.",
    calendarTitle: "📅 Calendar Reminders",
    calendarDesc: "Schedule habits to stay on track.",

    // Raw Categories
    transport: "Transport",
    energy: "Energy",
    food: "Food",
    shopping: "Shopping",
    waste: "Waste",

    // Profiles
    profileTitle: "Your Eco Profile",
    profile_transport_label: "Commuter Optimizer",
    profile_transport_desc:
      "Your biggest opportunity is in transport. Small shifts like carpooling or public transport days can make a big difference.",
    profile_energy_label: "Energy Saver",
    profile_energy_desc:
      "Home energy use is your top impact area. Smart appliance habits and renewable energy can dramatically cut your footprint.",
    profile_food_label: "Food Footprint Reducer",
    profile_food_desc:
      "Food choices are your highest emission area. Moving toward more plant-based meals has the biggest impact.",
    profile_shopping_label: "Conscious Consumer",
    profile_shopping_desc:
      "Shopping habits are your main area for improvement. Buying less, repairing more, and choosing second-hand helps most.",
    profile_waste_label: "Waste Warrior",
    profile_waste_desc:
      "Improving your waste habits through recycling and composting can meaningfully cut your monthly emissions.",

    // Maps Links
    map_recycling_title: "Find Recycling Centers",
    map_recycling_desc: "Drop off e-waste, plastics, and recyclables near you.",
    map_ev_title: "EV Charging Stations",
    map_ev_desc: "Locate electric vehicle charging points near your route.",
    map_transit_title: "Public Transport Near Me",
    map_transit_desc: "Find metro stations, bus stops, and transit options.",
    map_bike_title: "Explore Bike Routes",
    map_bike_desc: "Discover safe cycling lanes and bike-friendly paths.",
    map_markets_title: "Local & Organic Markets",
    map_markets_desc:
      "Shop seasonal, local produce to reduce food transport emissions.",
    map_thrift_title: "Second-Hand Stores",
    map_thrift_desc: "Find thrift and vintage shops for sustainable shopping.",

    // Calendar Links
    cal_weekly_title: "Weekly Carbon Check-In",
    cal_weekly_desc: "Review your footprint every Monday morning.",
    cal_meatless_title: "Meatless Monday Reminder",
    cal_meatless_desc: "Plant-based meal every Monday — saves 1.5 kg CO₂.",
    cal_unplug_title: "Evening Unplug Reminder",
    cal_unplug_desc: "Switch off devices every night to cut standby waste.",
    cal_custom_title: "Custom Challenge Reminder",
    cal_custom_desc: "Set a reminder for any eco challenge you choose.",
    cal_custom_event_challenge: "Complete One Eco Challenge Today",

    // Calendar Events
    cal_weekly_event_title: "🌱 CarbonSathi Weekly Check-In",
    cal_weekly_event_desc:
      "Review your carbon footprint this week. Open CarbonSathi, check your dashboard, and complete one eco challenge. Small actions add up to big impact!",
    cal_meatless_event_title: "🥗 Meatless Monday — Eco Habit",
    cal_meatless_event_desc:
      "Choose a plant-based meal today! Skipping meat once a week can save up to 1.5 kg CO₂. Every meal counts.",
    cal_unplug_event_title: "🔌 Unplug Before Bed — Save Energy",
    cal_unplug_event_desc:
      "Switch off and unplug non-essential electronics tonight. Standby power wastes energy and adds to your carbon footprint.",
    calendar_challenge_prefix: "🌿 CarbonSathi Challenge",
    calendar_challenge_desc_prefix: "Today's eco challenge",
    calendar_challenge_desc_suffix:
      "Complete it and earn green points! Open CarbonSathi to log your progress.",

    // Misc
    completeBtn: "Complete",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    ptsLabel: "pts",
    pointsLabel: "points",
    savesLabel: "Saves ~",
    kgPerMonth: "kg/mo",
    challengeCompletedAlert: "Challenge completed! You earned",
    badgeEarnedAlertPrefix: "🎉 You earned a new badge:",
    apiSavedAlert: "API Key saved for this session.",
    apiInvalidAlert: "Please enter a valid key.",

    // Dynamic tips translations keys (fallback will handle these as well but having them here makes it robust)
    t1_title: "Switch to public transport once a week",
    t1_desc:
      "Taking the bus or metro just once a week instead of your car can save significant CO₂.",
    t2_title: "Carpool with a colleague",
    t2_desc:
      "Sharing your commute with one other person halves your per-trip transport emissions.",
    t3_title: "Cycle or walk for trips under 3 km",
    t3_desc:
      "Short trips have disproportionately high emissions per km. Walking or cycling eliminates them.",
    t4_title: "Batch errands into one trip",
    t4_desc:
      "Combining multiple errands into a single journey reduces cold-start emissions and total distance.",
    t5_title: "Switch to an electric or hybrid vehicle",
    t5_desc:
      "EVs produce ~70% less operational emissions than petrol cars on average.",
    t6_title: "Work from home one more day per week",
    t6_desc:
      "Each WFH day eliminates a round-trip commute and its associated emissions.",
    t7_title: "Avoid one domestic flight this year",
    t7_desc:
      "A single domestic flight can generate 120+ kg CO₂. Train or bus alternatives are far lower.",

    e1_title: "Set AC to 24°C instead of 18°C",
    e1_desc:
      "Each degree increase in AC setpoint saves ~6% electricity. 24°C is comfortable and efficient.",
    e2_title: "Unplug devices on standby",
    e2_desc:
      'Standby power ("vampire power") can account for 5–10% of home electricity use.',
    e3_title: "Switch to LED bulbs",
    e3_desc:
      "LED bulbs use 75% less energy than incandescent and last much longer.",
    e4_title: "Use natural light during the day",
    e4_desc:
      "Open curtains and rearrange workspaces to maximize daylight — free and zero-emission.",
    e5_title: "Wash clothes in cold water",
    e5_desc:
      "90% of a washing machine's energy is used heating water. Cold washes clean just as well.",
    e6_title: "Install a solar rooftop panel",
    e6_desc:
      "Even a 1 kW rooftop solar system can offset 80–120 kg CO₂ per month in India.",
    e7_title: "Use a smart power strip",
    e7_desc:
      "Smart strips automatically cut power to devices when not in use, reducing standby losses.",

    f1_title: "Have one plant-based meal per day",
    f1_desc:
      "Replacing one meat meal with a plant-based alternative can save 1–3 kg CO₂ per day.",
    f2_title: "Reduce beef and lamb consumption",
    f2_desc:
      "Beef produces ~20× more CO₂ than chicken and ~100× more than lentils per gram of protein.",
    f3_title: "Buy local and seasonal produce",
    f3_desc:
      "Local food has lower transportation emissions and supports regional farming.",
    f4_title: "Reduce food waste by planning meals",
    f4_desc:
      "Food waste in landfills generates methane — a potent greenhouse gas. Plan ahead to use everything.",
    f5_title: "Start composting food scraps",
    f5_desc:
      "Home composting diverts organic waste from landfills, reducing methane emissions.",
    f6_title: "Choose dairy alternatives occasionally",
    f6_desc:
      "Oat milk produces ~6× fewer emissions than cow's milk. Even occasional swaps help.",

    s1_title: "Repair instead of replace",
    s1_desc:
      "Repairing clothes, electronics, and appliances avoids the high manufacturing emissions of new items.",
    s2_title: "Buy second-hand clothing",
    s2_desc:
      "Second-hand garments use ~82% less water and produce 90% less CO₂ than new fast fashion.",
    s3_title: "Delay electronics upgrades by one year",
    s3_desc:
      "The manufacturing phase of electronics is 70–80% of their lifetime carbon. Use them longer.",
    s4_title: "Choose quality over quantity",
    s4_desc:
      "Buying fewer, higher-quality items that last longer reduces cumulative manufacturing emissions.",
    s5_title: "Use a reusable bag for every shopping trip",
    s5_desc:
      "Single-use plastic bags have a significant lifecycle carbon footprint. Reusable bags pay off in just a few uses.",

    w1_title: "Segregate dry and wet waste daily",
    w1_desc:
      "Proper segregation enables effective recycling and composting, significantly reducing landfill methane.",
    w2_title: "Carry a reusable water bottle",
    w2_desc:
      "Avoiding single-use plastic bottles reduces plastic waste and the energy used to produce them.",
    w3_title: "Say no to single-use plastic straws and cutlery",
    w3_desc:
      "Bring reusable cutlery or choose plastic-free options when eating out.",
    w4_title: "Recycle paper, glass, and metal correctly",
    w4_desc:
      "Correct recycling ensures materials re-enter the production cycle, saving significant energy and emissions.",
    w5_title: "Use a home vermicomposting kit",
    w5_desc:
      "Worm composting turns kitchen waste into rich soil and prevents organic waste from landfills.",

    // Challenge titles & descriptions
    ch_t1_title: "Go Car-Free for a Day",
    ch_t1_desc:
      "Spend an entire day without using a personal car. Use public transport, cycle, or walk.",
    ch_t2_title: "Cycle to Work This Week",
    ch_t2_desc:
      "Cycle to your workplace at least 3 times this week instead of driving.",
    ch_t3_title: "Carpool for 5 Days",
    ch_t3_desc:
      "Share your commute with at least one colleague or neighbour for 5 consecutive working days.",
    ch_t4_title: "Use Only Public Transport This Week",
    ch_t4_desc:
      "Avoid personal motorized vehicles for all local trips this week.",

    ch_e1_title: "Unplug Before Bed",
    ch_e1_desc: "Unplug all non-essential electronics every night for a week.",
    ch_e2_title: "AC at 24°C for a Week",
    ch_e2_desc:
      "Set your air conditioner to 24°C or higher for an entire week.",
    ch_e3_title: "Switch Off Lights in Empty Rooms",
    ch_e3_desc:
      "Consciously turn off lights every time you leave a room for one week.",
    ch_e4_title: "Air-Dry Laundry for a Month",
    ch_e4_desc:
      "Skip the tumble dryer and air-dry all your laundry for one month.",

    ch_f1_title: "Meatless Monday",
    ch_f1_desc: "Eat no meat for one full day today.",
    ch_f2_title: "Zero Food Waste Week",
    ch_f2_desc:
      "Plan meals carefully so that no food goes into the bin this entire week.",
    ch_f3_title: "Cook from Scratch 5 Times",
    ch_f3_desc:
      "Prepare 5 meals from whole ingredients, avoiding packaged and processed food.",
    ch_f4_title: "Start Composting",
    ch_f4_desc:
      "Begin composting your kitchen scraps today. Set up a bin or use a community composting point.",

    ch_s1_title: "Carry a Reusable Bag Today",
    ch_s1_desc:
      "Use only reusable bags for all shopping today. Refuse plastic bags.",
    ch_s2_title: "Repair One Item This Week",
    ch_s2_desc:
      "Fix something that is broken — a garment, appliance, or device — instead of replacing it.",
    ch_s3_title: "Zero New Clothes This Month",
    ch_s3_desc:
      "Commit to buying no new clothing items for 30 days. Borrow, swap, or go without.",
    ch_s4_title: "Carry a Reusable Water Bottle",
    ch_s4_desc:
      "Use a reusable water bottle for all your drinks today instead of buying single-use plastic.",

    ch_w1_title: "Segregate Waste for a Week",
    ch_w1_desc: "Separate dry and wet waste correctly every day for 7 days.",
    ch_w2_title: "Plastic-Free Day",
    ch_w2_desc: "Go an entire day without using any single-use plastics.",
    ch_w3_title: "Find a Recycling Drop-Off Point",
    ch_w3_desc:
      "Locate your nearest e-waste or plastics recycling collection point and drop off one item.",
  },

  hi: {
    appName: "🌿 कार्बन साथी (CarbonSathi)",
    tagline: "समझें। ट्रैक करें। कम करें।",
    homeIntro:
      "कार्बन साथी आपका व्यक्तिगत स्थिरता सहायक है। अपने कार्बन फुटप्रिंट की गणना करें और बदलाव लाने के लिए सरल सुझाव पाएं।",

    navHome: "होम",
    navCalculator: "कैलकुलेटर",
    navDashboard: "डैशबोर्ड",
    navRecommendations: "सुझाव",
    navChallenges: "चुनौतियां",
    navAssistant: "असिस्टेंट",
    languageSelectorLabel: "भाषा चयनकर्ता",
    themeToggleLabel: "थीम बदलें",
    assistantInputLabel: "अपना संदेश लिखें",
    apiKeyLabel: "जेमिनी API कुंजी",

    calcTitle: "कार्बन कैलकुलेटर",
    calcTransportTitle: "🚗 यातायात",
    calcDailyCommuteLabel: "दैनिक यात्रा (किमी, एक तरफ)",
    calcVehicleTypeLabel: "प्राथमिक वाहन",
    calcEnergyTitle: "⚡ घरेलू ऊर्जा",
    calcMonthlyKwhLabel: "मासिक बिजली (kWh)",
    calcFoodTitle: "🥗 भोजन",
    calcDietTypeLabel: "आहार प्रकार",
    calcFoodWasteLabel: "भोजन की बर्बादी",
    calcShoppingTitle: "🛍️ खरीदारी और कचरा",
    calcNewClothesLabel: "नए कपड़े / महीना",
    calcRecyclingLabel: "रीसाइक्लिंग की आदत",
    calcSubmitBtn: "परिणाम की गणना करें",
    calcStartBtn: "मेरा फुटप्रिंट गणना करें",

    optCarPetrol: "पेट्रोल कार",
    optCarDiesel: "डीज़ल कार",
    optCarElectric: "इलेक्ट्रिक कार",
    optPublicBus: "सार्वजनिक बस",
    optMetro: "मेट्रो / ट्रेन",
    optWalking: "पैदल / साइकिल",

    optOmnivore: "सामान्य (मांसाहार मिश्रित)",
    optHighMeat: "अधिक मांसाहार",
    optPescatarian: "मछली आधारित",
    optVegetarian: "शाकाहारी",
    optVegan: "वीगन (पूर्ण शाकाहार)",

    optWasteNone: "कोई नहीं",
    optWasteLow: "कम",
    optWasteMedium: "मध्यम",
    optWasteHigh: "अधिक",

    optRecycleNone: "शायद ही कभी रीसाइकल करें",
    optRecycleSome: "कुछ रीसाइक्लिंग",
    optRecycleGood: "अच्छी रीसाइक्लिंग और अलगाव",
    optRecycleCompost: "रीसाइकल और कम्पोस्ट",

    dashTitle: "आपका डैशबोर्ड",
    dashMonthly: "मासिक कार्बन फुटप्रिंट",
    dashYearly: "अनुमानित वार्षिक",
    dashEcoScore: "इको स्कोर",
    dashCategoryTitle: "श्रेणी के अनुसार विवरण",
    dashPlaceholder: "कृपया पहले कैलकुलेटर पूरा करें।",
    dashPlaceholderHint:
      "अपना कार्बन फुटप्रिंट अनुमानित करने के लिए कैलकुलेटर टैब का उपयोग करें, फिर विस्तृत विवरण देखने के लिए यहां लौटें।",

    recsTitle: "व्यक्तिगत सुझाव",
    recsSubtitle: "आपके फुटप्रिंट के आधार पर, प्रभाव कम करने के प्रभावी तरीके।",
    recsPlaceholder: "कृपया पहले कैलकुलेटर पूरा करें।",
    recsPlaceholderHint:
      "फुटप्रिंट की गणना के बाद, हम आपके सबसे बड़े उत्सर्जन क्षेत्रों के अनुसार व्यक्तिगत सुझाव दिखाएंगे।",

    chalTitle: "इको चुनौतियां",
    chalSubtitle: "ग्रीन पॉइंट और बैज अर्जित करने के लिए चुनौतियां पूरी करें।",
    chalAllDone: "आपने सभी उपलब्ध चुनौतियां पूरी कर ली हैं! शानदार!",

    astTitle: "एआई इको असिस्टेंट",
    astSubtitle: "अपने फुटप्रिंट के बारे में प्रश्न पूछें या सलाह लें।",
    astSendBtn: "भेजें",
    astPlaceholder: "जैसे, मैं बिजली का उपयोग कैसे कम कर सकता हूं?",
    assistantGreeting:
      "नमस्ते! मैं आपका कार्बन साथी हूं। अपना फुटप्रिंट कम करने या अपने हाल के परिणामों के बारे में मुझसे पूछें।",
    assistantError:
      "माफ करें, असिस्टेंट से जुड़ते समय कुछ समस्या हुई।",

    apiSettings: "एपीआई सेटिंग्स (वैकल्पिक)",
    apiDesc:
      "कार्बन साथी ऑफ़लाइन काम करता है, लेकिन आप एआई सलाह के लिए जेमिनी एपीआई कुंजी जोड़ सकते हैं।",
    apiPlaceholder: "जेमिनी एपीआई कुंजी दर्ज करें",
    apiSaveBtn: "सहेजें",

    ecoServicesTitle: "📍 स्थानीय इको सेवाएं",
    ecoServicesDesc: "अपने पास कम कार्बन विकल्प खोजें।",
    calendarTitle: "📅 कैलेंडर रिमाइंडर",
    calendarDesc: "आदतें बनाए रखने के लिए शेड्यूल करें।",

    transport: "यातायात",
    energy: "घरेलू ऊर्जा",
    food: "भोजन",
    shopping: "खरीदारी",
    waste: "कचरा",

    profileTitle: "आपका इको प्रोफाइल",
    profile_transport_label: "यातायात अनुकूलक",
    profile_transport_desc:
      "आपका सबसे बड़ा प्रभाव यातायात क्षेत्र में है। कारपूलिंग या सार्वजनिक परिवहन के उपयोग से बड़ा बदलाव आ सकता है।",
    profile_energy_label: "ऊर्जा बचतकर्ता",
    profile_energy_desc:
      "घरेलू ऊर्जा का उपयोग आपका प्रमुख क्षेत्र है। कुशल उपकरणों के उपयोग और नवीकरणीय ऊर्जा से उत्सर्जन में भारी कमी आ सकती है।",
    profile_food_label: "आहार सुधारक",
    profile_food_desc:
      "भोजन विकल्प आपके उत्सर्जन का मुख्य स्रोत हैं। शाकाहारी आहार की ओर कदम बढ़ाना सबसे प्रभावशाली है।",
    profile_shopping_label: "जागरूक उपभोक्ता",
    profile_shopping_desc:
      "खरीदारी की आदतें सुधार का मुख्य क्षेत्र हैं। कम खरीदना, पुरानी चीजें मरम्मत कराना और सेकंड-हैंड अपनाना मददगार है।",
    profile_waste_label: "कचरा योद्धा",
    profile_waste_desc:
      "रीसाइक्लिंग और कम्पोस्टिंग के माध्यम से कचरा प्रबंधन में सुधार करके आप मासिक उत्सर्जन को कम कर सकते हैं।",

    map_recycling_title: "रीसाइक्लिंग केंद्र खोजें",
    map_recycling_desc:
      "अपने पास ई-कचरा, प्लास्टिक और रीसाइक्लिंग केंद्र खोजें।",
    map_ev_title: "ईवी चार्जिंग स्टेशन",
    map_ev_desc: "अपने रास्ते के पास इलेक्ट्रिक वाहन चार्जिंग पॉइंट खोजें।",
    map_transit_title: "सार्वजनिक परिवहन विकल्प",
    map_transit_desc: "मेट्रो स्टेशन, बस स्टॉप और सार्वजनिक साधन खोजें।",
    map_bike_title: "साइकिल मार्ग खोजें",
    map_bike_desc: "सुरक्षित साइकिल लेन और अनुकूल मार्ग खोजें।",
    map_markets_title: "स्थानीय और जैविक बाजार",
    map_markets_desc: "उत्सर्जन कम करने के लिए स्थानीय और जैविक उत्पाद खरीदें।",
    map_thrift_title: "सेकंड-हैंड दुकानें",
    map_thrift_desc:
      "टिकाऊ खरीदारी के लिए थ्रिफ्ट और पुरानी पोशाकों की दुकानें खोजें।",

    cal_weekly_title: "साप्ताहिक कार्बन जांच",
    cal_weekly_desc: "हर सोमवार सुबह अपने कार्बन फुटप्रिंट की समीक्षा करें।",
    cal_meatless_title: "मीटलेस मंडे रिमाइंडर",
    cal_meatless_desc:
      "हर सोमवार को शाकाहारी भोजन करें — 1.5 किग्रा CO₂ बचाएं।",
    cal_unplug_title: "शाम को बिजली बंद करने का रिमाइंडर",
    cal_unplug_desc: "अनावश्यक उपकरणों को प्लग से निकालें और बिजली बचाएं।",
    cal_custom_title: "कस्टम चुनौती रिमाइंडर",
    cal_custom_desc:
      "अपनी पसंद की किसी भी इको चुनौती के लिए रिमाइंडर सेट करें।",
    cal_custom_event_challenge: "आज एक इको चुनौती पूरी करें",

    cal_weekly_event_title: "🌱 कार्बन साथी साप्ताहिक जांच-इन",
    cal_weekly_event_desc:
      "इस सप्ताह अपने कार्बन फुटप्रिंट की समीक्षा करें। कार्बन साथी खोलें, अपना डैशबोर्ड देखें और एक इको चुनौती पूरी करें।",
    cal_meatless_event_title: "🥗 मीटलेस मंडे — इको आदत",
    cal_meatless_event_desc:
      "आज शाकाहारी भोजन चुनें! सप्ताह में एक बार मांस छोड़ने से 1.5 किग्रा CO₂ तक की बचत हो सकती है।",
    cal_unplug_event_title: "🔌 सोने से पहले बिजली बंद करें",
    cal_unplug_event_desc:
      "आज रात गैर-जरूरी इलेक्ट्रॉनिक्स को बंद करें और प्लग निकालें। स्टैंडबाय पावर ऊर्जा बर्बाद करती है।",
    calendar_challenge_prefix: "🌿 कार्बन साथी चुनौती",
    calendar_challenge_desc_prefix: "आज की इको चुनौती",
    calendar_challenge_desc_suffix:
      "इसे पूरा करें और ग्रीन पॉइंट अर्जित करें! प्रगति दर्ज करने के लिए कार्बन साथी खोलें।",

    completeBtn: "पूरा करें",
    easy: "आसान",
    medium: "मध्यम",
    hard: "कठिन",
    ptsLabel: "अंक",
    pointsLabel: "अंक",
    savesLabel: "बचत ~",
    kgPerMonth: "किग्रा/माह",
    challengeCompletedAlert: "चुनौती पूरी हुई! आपने अर्जित किए",
    badgeEarnedAlertPrefix: "🎉 आपने नया बैज जीता:",
    apiSavedAlert: "API कुंजी इस सत्र के लिए सहेज दी गई है।",
    apiInvalidAlert: "कृपया मान्य कुंजी दर्ज करें।",

    // Tips translated
    t1_title: "हफ्ते में एक बार सार्वजनिक वाहन अपनाएं",
    t1_desc:
      "अपनी कार की जगह हफ्ते में एक बार बस या मेट्रो का उपयोग करने से महत्वपूर्ण CO₂ बचता है।",
    t2_title: "सहकर्मी के साथ कारपूल करें",
    t2_desc:
      "किसी अन्य व्यक्ति के साथ यात्रा साझा करने से आपका उत्सर्जन आधा हो जाता है।",
    t3_title: "3 किमी से कम दूरी के लिए पैदल या साइकिल चलें",
    t3_desc:
      "छोटी यात्राएं बहुत अधिक उत्सर्जन करती हैं। पैदल चलना या साइकिल चलाना इन्हें समाप्त करता है।",
    t4_title: "सभी काम एक ही यात्रा में निपटाएं",
    t4_desc:
      "कई कामों को एक ही यात्रा में मिलाने से दूरी और उत्सर्जन दोनों कम होते हैं।",
    t5_title: "इलेक्ट्रिक या हाइब्रिड वाहन अपनाएं",
    t5_desc: "ईवी पेट्रोल कारों की तुलना में औसतन 70% कम उत्सर्जन करती हैं।",
    t6_title: "हफ्ते में एक और दिन वर्क फ्रॉम होम करें",
    t6_desc: "प्रत्येक WFH दिन आने-जाने का उत्सर्जन समाप्त करता है।",
    t7_title: "इस साल एक घरेलू हवाई यात्रा से बचें",
    t7_desc:
      "एक घरेलू उड़ान 120+ किग्रा CO₂ उत्पन्न कर सकती है। ट्रेन या बस काफी बेहतर विकल्प हैं।",

    e1_title: "एसी को 18° के बजाय 24°C पर सेट करें",
    e1_desc:
      "तापमान में प्रत्येक डिग्री की वृद्धि से ~6% बिजली बचती है। 24°C कुशल और आरामदायक है।",
    e2_title: "स्टैंडबाय पर उपकरणों को अनप्लग करें",
    e2_desc: "स्टैंडबाय बिजली घर के कुल उपयोग का 5-10% हिस्सा ले सकती है।",
    e3_title: "एलईडी बल्ब का प्रयोग करें",
    e3_desc:
      "एलईडी बल्ब पारंपरिक बल्बों की तुलना में 75% कम ऊर्जा का उपयोग करते हैं।",
    e4_title: "दिन में प्राकृतिक रोशनी का उपयोग करें",
    e4_desc:
      "पर्दे खोलें और दिन के उजाले का अधिकतम लाभ उठाएं — मुफ्त और शून्य उत्सर्जन।",
    e5_title: "ठंडे पानी में कपड़े धोएं",
    e5_desc:
      "वाशिंग मशीन की 90% ऊर्जा पानी गर्म करने में जाती है। ठंडा पानी भी समान सफाई देता है।",
    e6_title: "छत पर सोलर पैनल लगाएं",
    e6_desc:
      "भारत में 1 किलोवाट का सोलर सिस्टम भी प्रति माह 80-120 किग्रा CO₂ बचा सकता है।",
    e7_title: "स्मार्ट पावर स्ट्रिप का प्रयोग करें",
    e7_desc: "स्मार्ट स्ट्रिप उपयोग न होने पर बिजली स्वतः काट देती है।",

    f1_title: "दिन में एक बार शाकाहारी भोजन करें",
    f1_desc: "एक बार शाकाहारी भोजन करने से प्रतिदिन 1-3 किग्रा CO₂ बच सकता है।",
    f2_title: "गोमांस और मटन का सेवन कम करें",
    f2_desc: "गोमांस दालों की तुलना में लगभग 100 गुना अधिक उत्सर्जन करता है।",
    f3_title: "स्थानीय और मौसमी फल-सब्जियां खरीदें",
    f3_desc:
      "स्थानीय भोजन में परिवहन का उत्सर्जन कम होता है और किसानों को मदद मिलती है।",
    f4_title: "योजना बनाकर भोजन की बर्बादी कम करें",
    f4_desc:
      "लैंडफिल में सड़ने वाला भोजन मीथेन गैस बनाता है। उतनी ही खरीदारी करें जितनी जरूरत हो।",
    f5_title: "गीले कचरे से खाद बनाना शुरू करें",
    f5_desc:
      "घर पर खाद बनाने से गीला कचरा लैंडफिल में नहीं जाता और मीथेन उत्सर्जन रुकता है।",
    f6_title: "कभी-कभी डेयरी विकल्पों का चयन करें",
    f6_desc: "ओट मिल्क गाय के दूध की तुलना में 6 गुना कम उत्सर्जन करता है।",

    s1_title: "बदलने के बजाय मरम्मत करें",
    s1_desc:
      "कपड़ों, इलेक्ट्रॉनिक्स और उपकरणों की मरम्मत करने से निर्माण का भारी उत्सर्जन बचता है।",
    s2_title: "सेकंड-हैंड कपड़े खरीदें",
    s2_desc:
      "सेकंड-हैंड कपड़े नए फास्ट फैशन की तुलना में 90% कम CO₂ उत्पन्न करते हैं।",
    s3_title: "नया फोन/लैपटॉप एक साल बाद खरीदें",
    s3_desc:
      "इलेक्ट्रॉनिक्स के जीवनकाल का 70-80% कार्बन निर्माण के दौरान ही निकलता है। लंबे समय तक उपयोग करें।",
    s4_title: "मात्रा से ज्यादा गुणवत्ता पर ध्यान दें",
    s4_desc: "कम लेकिन टिकाऊ सामान खरीदने से उत्पादन उत्सर्जन कम होता है।",
    s5_title: "हर बार कपड़े का थैला साथ ले जाएं",
    s5_desc:
      "सिंगल-यूज़ प्लास्टिक बैग का कार्बन उत्सर्जन बहुत अधिक होता है। कपड़े का थैला सर्वोत्तम है।",

    w1_title: "सूखा और गीला कचरा रोज अलग करें",
    w1_desc: "सही कचरा पृथक्करण रीसाइक्लिंग और खाद बनाने में मदद करता है।",
    w2_title: "हमेशा पानी की बोतल साथ रखें",
    w2_desc:
      "सिंगल-यूज़ बोतलों से बचकर आप ऊर्जा खपत और प्लास्टिक कचरा कम करते हैं।",
    w3_title: "प्लास्टिक स्ट्रॉ और कटलरी को ना कहें",
    w3_desc:
      "बाहर खाना खाते समय अपने चम्मच साथ रखें या प्लास्टिक-मुक्त विकल्प चुनें।",
    w4_title: "कागज, कांच और धातु रीसाइकल करें",
    w4_desc:
      "सही रीसाइक्लिंग सामग्री को पुनः चक्र में लाती है जिससे भारी ऊर्जा बचती है।",
    w5_title: "घर पर केंचुआ खाद किट का उपयोग करें",
    w5_desc: "यह गीले कचरे को समृद्ध खाद में बदल देता है।",

    // Challenges
    ch_t1_title: "एक दिन कार-मुक्त रहें",
    ch_t1_desc:
      "पूरा दिन निजी कार के बिना बिताएं। सार्वजनिक वाहन, साइकिल या पैदल यात्रा करें।",
    ch_t2_title: "इस सप्ताह साइकिल से काम पर जाएं",
    ch_t2_desc:
      "इस सप्ताह काम पर जाने के लिए कम से कम 3 बार गाड़ी की जगह साइकिल का उपयोग करें।",
    ch_t3_title: "5 दिन कारपूल करें",
    ch_t3_desc: "लगातार 5 दिनों तक सहकर्मी या पड़ोसी के साथ यात्रा साझा करें।",
    ch_t4_title: "केवल सार्वजनिक परिवहन का उपयोग करें",
    ch_t4_desc:
      "इस सप्ताह सभी यात्राओं के लिए केवल सार्वजनिक वाहनों का उपयोग करें।",

    ch_e1_title: "सोने से पहले उपकरण बंद करें",
    ch_e1_desc:
      "एक सप्ताह तक हर रात सभी अनावश्यक इलेक्ट्रॉनिक्स उपकरणों को प्लग से निकालें।",
    ch_e2_title: "एसी को 24°C पर रखें",
    ch_e2_desc:
      "पूरे सप्ताह अपने एयर कंडीशनर का तापमान 24°C या उससे अधिक रखें।",
    ch_e3_title: "खाली कमरों की लाइट बंद करें",
    ch_e3_desc:
      "एक सप्ताह तक जब भी आप किसी कमरे से बाहर निकलें, लाइट बंद करना न भूलें।",
    ch_e4_title: "कपड़ों को हवा में सुखाएं",
    ch_e4_desc:
      "एक महीने तक कपड़े सुखाने के लिए ड्रायर का उपयोग न करें, उन्हें प्राकृतिक रूप से सुखाएं।",

    ch_f1_title: "मीटलेस मंडे",
    ch_f1_desc: "आज पूरे दिन केवल शाकाहारी भोजन करें।",
    ch_f2_title: "शून्य भोजन बर्बादी सप्ताह",
    ch_f2_desc:
      "भोजन की योजना इस तरह बनाएं कि इस सप्ताह एक दाना भी कचरे में न जाए।",
    ch_f3_title: "5 बार घर पर खुद पकाएं",
    ch_f3_desc:
      "प्रसंस्कृत भोजन से बचते हुए साबुत सामग्री से 5 बार भोजन तैयार करें।",
    ch_f4_title: "खाद बनाना शुरू करें",
    ch_f4_desc:
      "आज से रसोई के कचरे को खाद बनाने के लिए अलग रखें और प्रक्रिया शुरू करें।",

    ch_s1_title: "कपड़े का थैला उपयोग करें",
    ch_s1_desc:
      "आज खरीदारी के लिए केवल कपड़े के थैलों का उपयोग करें। प्लास्टिक बैग मना करें।",
    ch_s2_title: "एक टूटी चीज ठीक करें",
    ch_s2_desc:
      "इस सप्ताह फेंकने के बजाय कोई खराब वस्त्र, उपकरण या गैजेट खुद सुधारें।",
    ch_s3_title: "इस महीने नए कपड़े नहीं खरीदेंगे",
    ch_s3_desc: "30 दिनों तक कोई भी नया कपड़ा न खरीदने का संकल्प लें।",
    ch_s4_title: "अपनी पानी की बोतल रखें",
    ch_s4_desc:
      "आज बाहर जाते समय पानी की रीयूजेबल बोतल साथ रखें, प्लास्टिक बोतल न खरीदें।",

    ch_w1_title: "कचरा अलग करें",
    ch_w1_desc: "7 दिनों तक रोज सूखा और गीला कचरा अलग डब्बे में डालें।",
    ch_w2_title: "प्लास्टिक-मुक्त दिन",
    ch_w2_desc: "पूरा दिन किसी भी प्रकार के सिंगल-यूज़ प्लास्टिक से दूर रहें।",
    ch_w3_title: "रीसाइक्लिंग केंद्र खोजें",
    ch_w3_desc:
      "नजदीकी ई-कचरा या प्लास्टिक रीसाइक्लिंग केंद्र खोजें और वहां पुराना सामान दें।",
  },

  gu: {
    appName: "🌿 કાર્બન સાથી (CarbonSathi)",
    tagline: "સમજો. ટ્રૅક કરો. ઘટાડો.",
    homeIntro:
      "કાર્બન સાથી તમારો વ્યક્તિગત ટકાઉપણા સાથી છે. તમારા કાર્બન ફૂટપ્રિન્ટની ગણતરી કરો અને ફેરફાર લાવવા માટે સરળ સૂચનો મેળવો.",

    navHome: "હોમ",
    navCalculator: "કેલ્ક્યુલેટર",
    navDashboard: "ડેશબોર્ડ",
    navRecommendations: "સૂચનો",
    navChallenges: "પડકારો",
    navAssistant: "આસિસ્ટન્ટ",
    languageSelectorLabel: "ભાષા પસંદ કરો",
    themeToggleLabel: "થીમ બદલો",
    assistantInputLabel: "તમારો સંદેશ લખો",
    apiKeyLabel: "જેમિની API કી",

    calcTitle: "કાર્બન કેલ્ક્યુલેટર",
    calcTransportTitle: "🚗 પરિવહન",
    calcDailyCommuteLabel: "દૈનિક મુસાફરી (કિમી, એક તરફ)",
    calcVehicleTypeLabel: "પ્રાથમિક વાહન",
    calcEnergyTitle: "⚡ ઘરની ઊર્જા",
    calcMonthlyKwhLabel: "માસિક વીજળી (kWh)",
    calcFoodTitle: "🥗 ભોજન",
    calcDietTypeLabel: "આહારનો પ્રકાર",
    calcFoodWasteLabel: "ખોરાકનો બગાડ",
    calcShoppingTitle: "🛍️ ખરીદી અને કચરો",
    calcNewClothesLabel: "નવા કપડાં / મહિનો",
    calcRecyclingLabel: "રિસાઇક્લિંગની આદત",
    calcSubmitBtn: "પરિણામની ગણતરી કરો",
    calcStartBtn: "મારી ફૂટપ્રિન્ટ ગણતરી કરો",

    optCarPetrol: "પેટ્રોલ કાર",
    optCarDiesel: "ડીઝલ કાર",
    optCarElectric: "ઇલેક્ટ્રિક કાર",
    optPublicBus: "જાહેર બસ",
    optMetro: "મેટ્રો / ટ્રેન",
    optWalking: "પગપાળા / સાઇકલ",

    optOmnivore: "સામાન્ય (માંસાહાર મિશ્રિત)",
    optHighMeat: "વધુ માંસાહાર",
    optPescatarian: "માછલી આધારિત",
    optVegetarian: "શાકાહારી",
    optVegan: "વીગન (સંપૂર્ણ શાકાહાર)",

    optWasteNone: "કોઈ નહીં",
    optWasteLow: "ઓછો",
    optWasteMedium: "મધ્યમ",
    optWasteHigh: "વધુ",

    optRecycleNone: "ભાગ્યે જ રિસાઇકલ",
    optRecycleSome: "થોડી રિસાઇક્લિંગ",
    optRecycleGood: "સારી રિસાઇક્લિંગ અને અલગાવ",
    optRecycleCompost: "રિસાઇકલ અને કમ્પોસ્ટ",

    dashTitle: "તમારું ડેશબોર્ડ",
    dashMonthly: "માસિક કાર્બન ફૂટપ્રિન્ટ",
    dashYearly: "અંદાજિત વાર્ષિક",
    dashEcoScore: "ઇકો સ્કોર",
    dashCategoryTitle: "શ્રેણી મુજબ વિગતો",
    dashPlaceholder: "કૃપા કરીને પહેલા કેલ્ક્યુલેટર પૂર્ણ કરો.",
    dashPlaceholderHint:
      "તમારા કાર્બન ફૂટપ્રિન્ટનો અંદાજ મેળવવા કેલ્ક્યુલેટર ટૅબ વાપરો, પછી વિગતવાર માહિતી માટે અહીં પાછા આવો.",

    recsTitle: "વ્યક્તિગત સૂચનો",
    recsSubtitle: "તમારા ફૂટપ્રિન્ટના આધારે, અસર ઘટાડવાની અસરકારક રીતો.",
    recsPlaceholder: "કૃપા કરીને પહેલા કેલ્ક્યુલેટર પૂર્ણ કરો.",
    recsPlaceholderHint:
      "ફૂટપ્રિન્ટ ગણ્યા પછી, અમે તમારા સૌથી મોટા ઉત્સર્જન ક્ષેત્રો મુજબ વ્યક્તિગત સૂચનો બતાવીશું.",

    chalTitle: "ઇકો પડકારો",
    chalSubtitle: "ગ્રીન પોઇન્ટ્સ અને બેજ મેળવવા પડકારો પૂર્ણ કરો.",
    chalAllDone: "તમે બધા ઉપલબ્ધ પડકારો પૂર્ણ કર્યા છે! શાબાશ!",

    astTitle: "એઆઈ ઇકો આસિસ્ટન્ટ",
    astSubtitle: "તમારા ફૂટપ્રિન્ટ વિશે પ્રશ્નો પૂછો અથવા સલાહ લો.",
    astSendBtn: "મોકલો",
    astPlaceholder: "દા.ત., હું વીજળીનો વપરાશ કેવી રીતે ઘટાડી શકું?",
    assistantGreeting:
      "નમસ્તે! હું તમારો કાર્બન સાથી છું. ફૂટપ્રિન્ટ ઘટાડવા અથવા તમારા તાજેતરના પરિણામો વિશે મને પૂછો.",
    assistantError:
      "માફ કરશો, આસિસ્ટન્ટ સાથે જોડાતાં કંઈક ખોટું થયું.",

    apiSettings: "API સેટિંગ્સ (વૈકલ્પિક)",
    apiDesc:
      "કાર્બન સાથી ઑફલાઇન કાર્ય કરે છે, પરંતુ AI સલાહ માટે જેમિની API કી ઉમેરી શકો છો.",
    apiPlaceholder: "જેમિની API કી દાખલ કરો",
    apiSaveBtn: "સાચવો",

    ecoServicesTitle: "📍 સ્થાનિક ઇકો સેવાઓ",
    ecoServicesDesc: "તમારી નજીકમાં ઓછા કાર્બન વિકલ્પો શોધો.",
    calendarTitle: "📅 કૅલેન્ડર રીમાઇન્ડર",
    calendarDesc: "આદતો જાળવવા શેડ્યૂલ કરો.",

    transport: "પરિવહન",
    energy: "ઊર્જા",
    food: "આહાર",
    shopping: "ખરીદી",
    waste: "કચરો",

    profileTitle: "તમારી ઇકો પ્રોફાઇલ",
    profile_transport_label: "મુસાફરી અનુકૂલક",
    profile_transport_desc:
      "તમારા માટે સૌથી મોટી તક પરિવહનમાં છે. કારપૂલ અથવા જાહેર પરિવહનનો ઉપયોગ કરવાથી મોટો ફાયદો થશે.",
    profile_energy_label: "ઊર્જા બચતકાર",
    profile_energy_desc:
      "ઘરની વીજળીનો ઉપયોગ તમારો મુખ્ય વિસ્તાર છે. એલઇડી લાઇટ અને સાધનો બંધ રાખવાથી ઉત્સર્જન બચશે.",
    profile_food_label: "આહાર સંશોધક",
    profile_food_desc:
      "તમારા આહારમાંથી ઉત્સર્જન વધુ છે. શાકાહારી ભોજન તરફ આગળ વધવાથી સૌથી વધુ અસર થાય છે.",
    profile_shopping_label: "જાગૃત ગ્રાહક",
    profile_shopping_desc:
      "ખરીદીની આદતો સુધારવાની જરૂર છે. નવું ખરીદવા કરતાં જૂની વસ્તુઓ સુધારીને વાપરવું ઉત્તમ છે.",
    profile_waste_label: "કચરા યોદ્ધા",
    profile_waste_desc:
      "કચરાનું અલગાવ અને ખાતર બનાવવાથી તમારા માસિક કાર્બન ફૂટપ્રિન્ટમાં નોંધપાત્ર ઘટાડો થશે.",

    map_recycling_title: "રિસાઇક્લિંગ કેન્દ્રો શોધો",
    map_recycling_desc:
      "નજીકના ઈ-વેસ્ટ અને પ્લાસ્ટિક રિસાઇક્લિંગ કેન્દ્રો શોધો.",
    map_ev_title: "ઇવી ચાર્જિંગ સ્ટેશનો",
    map_ev_desc: "તમારા માર્ગ પર ઇલેક્ટ્રિક વાહન ચાર્જિંગ પોઇન્ટ શોધો.",
    map_transit_title: "જાહેર વાહન વ્યવહાર",
    map_transit_desc: "મેટ્રો સ્ટેશનો, બસ સ્ટોપ અને પરિવહનના સાધનો શોધો.",
    map_bike_title: "સાયકલ માર્ગો",
    map_bike_desc: "સાયકલ ચલાવવા માટેના સલામત માર્ગો અને ટ્રેક શોધો.",
    map_markets_title: "સ્થાનિક ઓર્ગેનિક બજારો",
    map_markets_desc: "ઉત્સર્જન ઘટાડવા નજીકનું ઓર્ગેનિક બજાર શોધો.",
    map_thrift_title: "સેકન્ડ-હૅન્ડ દુકાનો",
    map_thrift_desc: "ટકાઉ ખરીદી માટે થ્રિફ્ટ સ્ટોર્સ શોધો.",

    cal_weekly_title: "સાપ્તાહિક કાર્બન સમીક્ષા",
    cal_weekly_desc: "દર સોમવારે સવારે તમારા કાર્બન ફૂટપ્રિન્ટની તપાસ કરો.",
    cal_meatless_title: "મીટલેસ મન્ડે રીમાઇન્ડર",
    cal_meatless_desc: "દર સોમવારે શાકાહારી ભોજન લો — 1.5 કિલો CO₂ બચાવો.",
    cal_unplug_title: "સાંજે વીજળી બંધ કરવાનું રીમાઇન્ડર",
    cal_unplug_desc: "રાત્રે બિનજરૂરી ઉપકરણો પ્લગમાંથી કાઢી નાખો.",
    cal_custom_title: "કસ્ટમ પડકાર રીમાઇન્ડર",
    cal_custom_desc: "ગમે તે પડકાર માટે રીમાઇન્ડર શેડ્યૂલ કરો.",
    cal_custom_event_challenge: "આજે એક ઇકો પડકાર પૂર્ણ કરો",

    cal_weekly_event_title: "🌱 કાર્બન સાથી સાપ્તાહિક ચેક-ઇન",
    cal_weekly_event_desc:
      "આ અઠવાડિયે તમારા કાર્બન ફૂટપ્રિન્ટની સમીક્ષા કરો. કાર્બન સાથી ખોલો અને એક ઇકો પડકાર પૂર્ણ કરો.",
    cal_meatless_event_title: "🥗 મીટલેસ મન્ડે — ઇકો આદત",
    cal_meatless_event_desc:
      "આજે શાકાહારી ભોજન પસંદ કરો! અઠવાડિયામાં એકવાર માંસ ન ખાવાથી 1.5 કિગ્રા CO₂ બચી શકે છે.",
    cal_unplug_event_title: "🔌 રાત્રે ઉપકરણો બંધ કરો",
    cal_unplug_event_desc:
      "આજે રાત્રે બિનજરૂરી ઇલેક્ટ્રોનિક્સ સાધનો બંધ કરી પ્લગ કાઢી નાખો.",
    calendar_challenge_prefix: "🌿 કાર્બન સાથી પડકાર",
    calendar_challenge_desc_prefix: "આજનો ઇકો પડકાર",
    calendar_challenge_desc_suffix:
      "પડકાર પૂર્ણ કરી ગ્રીન પોઇન્ટ્સ મેળવો! અપડેટ કરવા કાર્બન સાથી ખોલો.",

    completeBtn: "પૂર્ણ કરો",
    easy: "સરળ",
    medium: "મધ્યમ",
    hard: "મુશ્કેલ",
    ptsLabel: "પોઇન્ટ",
    pointsLabel: "પોઇન્ટ",
    savesLabel: "બચત ~",
    kgPerMonth: "કિગ્રા/માસ",
    challengeCompletedAlert: "પડકાર પૂર્ણ થયો! તમે મેળવ્યા",
    badgeEarnedAlertPrefix: "🎉 તમે નવો બેજ મેળવ્યો:",
    apiSavedAlert: "API કી આ સત્ર માટે સાચવી છે.",
    apiInvalidAlert: "કૃપા કરીને માન્ય કી દાખલ કરો.",

    t1_title: "અઠવાડિયામાં એકવાર જાહેર વાહન વાપરો",
    t1_desc:
      "ગાડીની જગ્યાએ અઠવાડિયામાં એકવાર બસ કે મેટ્રોનો ઉપયોગ કરવાથી નોંધપાત્ર CO₂ બચે છે.",
    t2_title: "સહકર્મી સાથે કારપૂલ કરો",
    t2_desc:
      "બીજા સાથે મુસાફરી વહેંચવાથી તમારું વ્યક્તિગત ઉત્સર્જન અડધું થાય છે.",
    t3_title: "3 કિમીથી ઓછી મુસાફરી માટે સાયકલ કે ચાલવાનું રાખો",
    t3_desc: "ટૂંકી મુસાફરી સૌથી વધુ પ્રદૂષણ કરે છે. ચાલવું કે સાયકલ બેસ્ટ છે.",
    t4_title: "બધા કામો એક જ ફેરામાં પતાવો",
    t4_desc: "બહુ બધા કામો એક જ ફેરામાં પતાવવાથી અંતર અને પેટ્રોલ બંને બચે છે.",
    t5_title: "ઇલેક્ટ્રિક કે હાઇબ્રિડ વાહન ખરીદો",
    t5_desc: "ઇવી ગાડીઓ પેટ્રોલ કાર કરતાં 70% ઓછું ઉત્સર્જન કરે છે.",
    t6_title: "અઠવાડિયામાં વધુ એક દિવસ ઘરેથી કામ કરો",
    t6_desc: "વર્ક ફ્રોમ હોમથી મુસાફરીનું ઉત્સર્જન સંપૂર્ણ બચે છે.",
    t7_title: "આ વર્ષે એક ડોમેસ્ટિક ફ્લાઇટ ટાળો",
    t7_desc: "એક ફ્લાઇટ 120+ કિગ્રા CO₂ બનાવી શકે છે. તેના બદલે ટ્રેન વાપરો.",

    e1_title: "AC 18° ને બદલે 24°C પર ચલાવો",
    e1_desc:
      "તાપમાનમાં દરેક ડિગ્રીના વધારાથી 6% વીજળી બચે છે. 24°C પર્યાપ્ત છે.",
    e2_title: "ઉપકરણો વાપરીને પ્લગમાંથી કાઢો",
    e2_desc: "સ્ટેન્ડબાય પાવર ઘરની 5-10% વીજળી ખાઈ શકે છે.",
    e3_title: "LED બલ્બ લગાવો",
    e3_desc: "એલઇડી બલ્બ 75% ઓછી વીજળી વાપરે છે અને લાંબુ ચાલે છે.",
    e4_title: "દિવસ દરમિયાન કુદરતી પ્રકાશ વાપરો",
    e4_desc:
      "બારીના પડદા ખોલો અને દિવસના પ્રકાશનો ઉપયોગ કરો — મફત અને પ્રદૂષણ મુક્ત.",
    e5_title: "ઠંડા પાણીમાં કપડાં ધોવો",
    e5_desc: "વોશિંગ મશીનની 90% એનર્જી પાણી ગરમ કરવામાં જાય છે.",
    e6_title: "અગાશી પર સોલર પેનલ લગાવો",
    e6_desc: "1 કિલોવોટની સોલર પેનલ પણ મહિને 80-120 કિગ્રા CO₂ બચાવે છે.",
    e7_title: "સ્માર્ટ પાવર સ્ટ્રીપ વાપરો",
    e7_desc: "જ્યારે સાધનો વપરાશમાં ન હોય ત્યારે તે પાવર આપોઆપ કાપે છે.",

    f1_title: "દિવસમાં એકવાર શાકાહારી ભોજન લો",
    f1_desc: "એક ટંક શાકાહારી ભોજન લેવાથી રોજ 1-3 કિગ્રા CO₂ બચે છે.",
    f2_title: "માસાંહારનું પ્રમાણ ઘટાડો",
    f2_desc: "માંસનું ઉત્પાદન શાકાહારી કઠોળ કરતાં ઘણું વધારે પ્રદૂષણ કરે છે.",
    f3_title: "સ્થાનિક અને મોસમી શાકભાજી ખરીદો",
    f3_desc: "સ્થાનિક ખોરાક લાવવા-લઇ જવાનું ટ્રાન્સપોર્ટ પ્રદૂષણ ઓછું હોય છે.",
    f4_title: "યોજનાપૂર્વક રસોઈ કરી બગાડ અટકાવો",
    f4_desc: "કચરામાં ગયેલો ખોરાક મિથેન ગેસ બનાવે છે. જરૂર હોય તેટલું જ ખરીદો.",
    f5_title: "ઘરે ખાતર બનાવવાનું શરૂ કરો",
    f5_desc: "રસોઈના કચરામાંથી ઓર્ગેનિક ખાતર બનાવવાથી મિથેન ગેસ બનતો અટકે છે.",
    f6_title: "ક્યારેક દૂધના ઓલ્ટરનેટિવ વાપરો",
    f6_desc: "ઓટ મિલ્ક ગાયના દૂધ કરતાં 6 ગણું ઓછું ઉત્સર્જન કરે છે.",

    s1_title: "નવું ખરીદવાને બદલે રિપેર કરો",
    s1_desc:
      "કપડાં કે ઇલેક્ટ્રોનિક્સ સુધારીને વાપરવાથી નવું બનાવવાનું ઉત્સર્જન બચે છે.",
    s2_title: "સેકન્ડ-હૅન્ડ કપડાં ખરીદો",
    s2_desc:
      "જુના કે વપરાયેલા સારા કપડાં નવા કપડાં કરતાં 90% ઓછું CO₂ બનાવે છે.",
    s3_title: "નવો ફોન કે લેપટોપ એક વર્ષ મોડો ખરીદો",
    s3_desc:
      "મોબાઇલ કે લેપટોપનું 80% પ્રદૂષણ ફેક્ટરીમાં બનતી વખતે થાય છે. લાંબો સમય વાપરો.",
    s4_title: "ક્વોલિટી પર વધારે ધ્યાન આપો",
    s4_desc:
      "ટકાઉ વસ્તુઓ ખરીદવાથી વારંવાર ખરીદવું નથી પડતું, જેથી ઉત્પાદન બચે છે.",
    s5_title: "હંમેશા કાપડની થેલી સાથે રાખો",
    s5_desc: "પ્લાસ્ટિક બેગને ના કહી હંમેશા કાપડની થેલી વાપરો.",

    w1_title: "ભીનો અને સૂકો કચરો રોજ અલગ કરો",
    w1_desc: "કચરો અલગ કરવાથી તેનું રિસાઇક્લિંગ સરળ બને છે.",
    w2_title: "હંમેશા પાણીની બોટલ સાથે રાખો",
    w2_desc: "પ્લાસ્ટિકની સિંગલ-યુઝ બોટલ ટાળીને કચરો બચાવો.",
    w3_title: "પ્લાસ્ટિકની ચમચી કે સ્ટ્રોને ના કહો",
    w3_desc: "બહાર જતી વખતે પોતાની ચમચી સાથે રાખો.",
    w4_title: "કાગળ અને મેટલ રિસાઇકલ કરો",
    w4_desc: "વસ્તુઓ ફેંકવાને બદલે કબાડીવાળાને આપો.",
    w5_title: "ઘરે અળસિયા ખાતર કીટ વાપરો",
    w5_desc: "રસોડાના કચરામાંથી ઉત્કૃષ્ટ ખાતર ઘરે જ બનાવો.",

    // Challenges
    ch_t1_title: "એક દિવસ ગાડી વગર રહો",
    ch_t1_desc: "આજે તમારી ગાડી ન ચલાવો. ચાલતા જાઓ, સાયકલ વાપરો કે બસમાં જાઓ.",
    ch_t2_title: "આ અઠવાડિયે સાયકલ પર કામે જાઓ",
    ch_t2_desc: "અઠવાડિયામાં ઓછામાં ઓછું 3 વાર સાયકલ પર નોકરીએ જાઓ.",
    ch_t3_title: "5 દિવસ કારપૂલ કરો",
    ch_t3_desc: "લગાતાર 5 દિવસ માટે મિત્ર કે સહકર્મી સાથે ગાડી શેર કરો.",
    ch_t4_title: "માત્ર સરકારી બસ કે મેટ્રો વાપરો",
    ch_t4_desc:
      "આ આખું અઠવાડિયું અંગત વાહનો બંધ રાખી સરકારી ટ્રાન્સપોર્ટ વાપરો.",

    ch_e1_title: "રાત્રે સાધનો બંધ કરો",
    ch_e1_desc:
      "એક અઠવાડિયા સુધી દરરોજ રાત્રે ટીવી અને ચાર્જર પ્લગમાંથી બહાર કાઢી દો.",
    ch_e2_title: "AC 24°C પર ચલાવો",
    ch_e2_desc: "આખું અઠવાડિયું એસીનું તાપમાન 24 ડિગ્રી કે તેથી વધુ રાખો.",
    ch_e3_title: "લાઇટો બંધ રાખવાની ટેવ પાડો",
    ch_e3_desc: "રૂમમાંથી બહાર નીકળો એટલે અચૂક લાઇટ બંધ કરો.",
    ch_e4_title: "કપડાં તડકામાં સૂકવો",
    ch_e4_desc: "વોશિંગ મશીનના ડ્રાયરનો ઉપયોગ બંધ કરી કપડાં દોરી પર સૂકવો.",

    ch_f1_title: "મીટલેસ મન્ડે",
    ch_f1_desc: "આજે આખો દિવસ માંસાહારથી દૂર રહી શાકાહારી ભોજન લો.",
    ch_f2_title: "ખોરાકનો ઝીરો બગાડ",
    ch_f2_desc:
      "આ અઠવાડિયે રસોઈ એવી રીતે બનાવો કે જરા પણ અન્ન કચરાપેટીમાં ન જાય.",
    ch_f3_title: "5 વાર ઘરે જાતે રાંધો",
    ch_f3_desc: "બહારનું પેકેટ ફૂડ ટાળી 5 વાર તાજી સામગ્રીમાંથી રસોઈ કરો.",
    ch_f4_title: "ખાતર બનાવવાનું શરૂ કરો",
    ch_f4_desc: "આજથી તમારા રસોડાના કચરામાંથી ખાતર બનાવવાનું શરૂ કરો.",

    ch_s1_title: "કાપડની થેલી વાપરો",
    ch_s1_desc: "આજે બધી ખરીદી માટે માત્ર કાપડની થેલી જ વાપરો.",
    ch_s2_title: "એક વસ્તુ સુધારો",
    ch_s2_desc: "ફેંકી દેવાની જગ્યાએ એક જુનો શર્ટ કે ચપ્પલ રિપેર કરાવો.",
    ch_s3_title: "આ મહિને નવું કપડું નહીં",
    ch_s3_desc: "૩૦ દિવસ સુધી એક પણ નવું કપડું ન ખરીદવાનો સંકલ્પ લો.",
    ch_s4_title: "પાણીની પોતાની બોટલ રાખો",
    ch_s4_desc: "આજે બહાર જતી વખતે સ્ટીલની બોટલ સાથે રાખો.",

    ch_w1_title: "કચરો જુદો કરો",
    ch_w1_desc: "૧ અઠવાડિયા સુધી રોજ સૂકો અને ભીનો કचरो અલગ પેટીમાં નાખો.",
    ch_w2_title: "પ્લાસ્ટિક મુક્ત દિવસ",
    ch_w2_desc: "આજે આખો દિવસ કોઈપણ સિંગલ-યુઝ પ્લાસ્ટિકનો ઉપયોગ ન કરો.",
    ch_w3_title: "રિસાઇક્લિંગ સેન્ટર શોધો",
    ch_w3_desc:
      "નજીકનું ઈ-વેસ્ટ કલેક્શન સેન્ટર શોધી નકામો ફોન કે વાયર ત્યાં આપી આવો.",
  },

  mr: {
    appName: "🌿 कार्बन साथी (CarbonSathi)",
    tagline: "समजून घ्या. मागोवा घ्या. कमी करा.",
    homeIntro:
      "कार्बन साथी हा तुमचा वैयक्तिक शाश्वतता सोबती आहे. तुमच्या कार्बन फूटप्रिंटची गणना करा आणि बदल घडवण्यासाठी सोप्या सूचना मिळवा.",

    navHome: "मुख्यपृष्ठ",
    navCalculator: "कॅल्क्युलेटर",
    navDashboard: "डॅशबोर्ड",
    navRecommendations: "सुचना",
    navChallenges: "आव्हाने",
    navAssistant: "असिस्टंट",
    languageSelectorLabel: "भाषा निवडा",
    themeToggleLabel: "थीम बदला",
    assistantInputLabel: "तुमचा संदेश लिहा",
    apiKeyLabel: "जेमिनी API की",

    calcTitle: "कार्बन कॅल्क्युलेटर",
    calcTransportTitle: "🚗 वाहतूक",
    calcDailyCommuteLabel: "दैनिक प्रवास (किमी, एका बाजूने)",
    calcVehicleTypeLabel: "प्राथमिक वाहन",
    calcEnergyTitle: "⚡ घरगुती ऊर्जा",
    calcMonthlyKwhLabel: "मासिक वीज (kWh)",
    calcFoodTitle: "🥗 अन्न",
    calcDietTypeLabel: "आहाराचा प्रकार",
    calcFoodWasteLabel: "अन्नाची नासाडी",
    calcShoppingTitle: "🛍️ खरेदी आणि कचरा",
    calcNewClothesLabel: "नवीन कपडे / महिना",
    calcRecyclingLabel: "पुनर्वापराची सवय",
    calcSubmitBtn: "निकाल मोजा",
    calcStartBtn: "माझी फूटप्रिंट मोजा",

    optCarPetrol: "पेट्रोल कार",
    optCarDiesel: "डिझेल कार",
    optCarElectric: "इलेक्ट्रिक कार",
    optPublicBus: "सार्वजनिक बस",
    optMetro: "मेट्रो / ट्रेन",
    optWalking: "पायी / सायकल",

    optOmnivore: "सामान्य (मिश्र मांसाहार)",
    optHighMeat: "जास्त मांसाहार",
    optPescatarian: "मासे आधारित",
    optVegetarian: "शाकाहारी",
    optVegan: "व्हीगन (पूर्ण शाकाहार)",

    optWasteNone: "काहीच नाही",
    optWasteLow: "कमी",
    optWasteMedium: "मध्यम",
    optWasteHigh: "जास्त",

    optRecycleNone: "क्वचितच पुनर्वापर",
    optRecycleSome: "काही पुनर्वापर",
    optRecycleGood: "चांगला पुनर्वापर आणि विभाजन",
    optRecycleCompost: "पुनर्वापर आणि कंपोस्ट",

    dashTitle: "तुमचा डॅशबोर्ड",
    dashMonthly: "मासिक कार्बन फूटप्रिंट",
    dashYearly: "अंदाजे वार्षिक",
    dashEcoScore: "इको स्कोअर",
    dashCategoryTitle: "श्रेणीनुसार तपशील",
    dashPlaceholder: "कृपया आधी कॅल्क्युलेटर पूर्ण करा.",
    dashPlaceholderHint:
      "तुमचा कार्बन फूटप्रिंट अंदाजण्यासाठी कॅल्क्युलेटर टॅब वापरा, मग तपशील पाहण्यासाठी इथे परत या.",

    recsTitle: "वैयक्तिकृत सूचना",
    recsSubtitle:
      "तुमच्या फूटप्रिंटवर आधारित, प्रभाव कमी करण्याचे प्रभावी मार्ग.",
    recsPlaceholder: "कृपया आधी कॅल्क्युलेटर पूर्ण करा.",
    recsPlaceholderHint:
      "फूटप्रिंट मोजल्यानंतर, आम्ही तुमच्या मोठ्या उत्सर्जन क्षेत्रांनुसार वैयक्तिक सूचना दाखवू.",

    chalTitle: "इको आव्हाने",
    chalSubtitle: "ग्रीन पॉइंट आणि बैज मिळवण्यासाठी आव्हाने पूर्ण करा.",
    chalAllDone: "तुम्ही सर्व उपलब्ध आव्हाने पूर्ण केली आहेत! छान!",

    astTitle: "एआय इको असिस्टंट",
    astSubtitle: "तुमच्या फूटप्रिंटबद्दल प्रश्न विचारा किंवा सल्ला घ्या.",
    astSendBtn: "पाठवा",
    astPlaceholder: "उदा., मी विजेचा वापर कसा कमी करू शकतो?",
    assistantGreeting:
      "नमस्ते! मी तुमचा कार्बन साथी आहे. फूटप्रिंट कमी करण्याबद्दल किंवा अलीकडच्या निकालांबद्दल मला विचारा.",
    assistantError:
      "माफ करा, असिस्टंटशी जोडताना काहीतरी चूक झाली.",

    apiSettings: "API सेटिंग्ज (पर्यायी)",
    apiDesc:
      "कार्बन साथी ऑफलाइन काम करते, पण AI सल्ल्यासाठी जेमिनी API की जोडा.",
    apiPlaceholder: "जेमिनी API की प्रविष्ट करा",
    apiSaveBtn: "जतन करा",

    ecoServicesTitle: "📍 स्थानिक इको सेवा",
    ecoServicesDesc: "तुमच्या जवळ कमी कार्बन पर्याय शोधा.",
    calendarTitle: "📅 कॅलेंडर रिमाइंडर",
    calendarDesc: "सवयी राखण्यासाठी शेड्यूल करा.",

    transport: "वाहतूक",
    energy: "घरेलू ऊर्जा",
    food: "अन्न",
    shopping: "खरेदी",
    waste: "कचरा",

    profileTitle: "तुमचे इको प्रोफाइल",
    profile_transport_label: "प्रवास अनुकूलक",
    profile_transport_desc:
      "तुमच्यासाठी सर्वात मोठी संधी प्रवासात आहे. कारपूलिंग किंवा सार्वजनिक वाहनांचा वापर लक्षणीय बदल घडवू शकतो.",
    profile_energy_label: "ऊर्जा संवर्धक",
    profile_energy_desc:
      "घरातील विजेचा वापर हा तुमचा मुख्य क्षेत्र आहे. एलईडी दिव्यांचा वापर आणि साधने बंद ठेवल्याने कार्बन उत्सर्जन वाचेल.",
    profile_food_label: "आहार संशोधक",
    profile_food_desc:
      "तुमच्या आहारातील कार्बन उत्सर्जन जास्त आहे. शाकाहारी जेवणाकडे वळल्याने सर्वाधिक फायदा होतो.",
    profile_shopping_label: "जागरूक ग्राहक",
    profile_shopping_desc:
      "खरेदीच्या सवयींमध्ये सुधारणा हवी आहे. नवीन खरेदी करण्याऐवजी जुन्या वस्तूंची दुरुस्ती करून वापरणे चांगले.",
    profile_waste_label: "कचरा योद्धा",
    profile_waste_desc:
      "कचऱ्याचे वर्गीकरण आणि खत बनवून तुम्ही मासिक कार्बन फूटप्रिंटमध्ये चांगली घट करू शकता.",

    map_recycling_title: "पुनर्वापर केंद्रे शोधा",
    map_recycling_desc:
      "तुमच्या जवळ ई-कचरा आणि प्लास्टिक पुनर्वापर केंद्रे शोधा.",
    map_ev_title: "ईव्ही चार्जिंग स्टेशन्स",
    map_ev_desc: "तुमच्या मार्गावर इलेक्ट्रिक वाहन चार्जिंग पॉईंट्स शोधा.",
    map_transit_title: "सार्वजनिक वाहतूक पर्याय",
    map_transit_desc:
      "मेट्रो स्टेशन, बस स्टॉप आणि सार्वजनिक वाहतुकीची साधने शोधा.",
    map_bike_title: "सायकल मार्ग शोधा",
    map_bike_desc: "सायकल चालवण्यासाठी सुरक्षित मार्ग आणि ट्रॅक शोधा.",
    map_markets_title: "स्थानिक सेंद्रिय बाजार",
    map_markets_desc:
      "उत्सर्जन कमी करण्यासाठी स्थानिक आणि सेंद्रिय उत्पादने खरेदी करा.",
    map_thrift_title: "सेकंड-हँड दुकाने",
    map_thrift_desc:
      "शाश्वत खरेदीसाठी थ्रिफ्ट आणि विंटेज कपड्यांची दुकाने शोधा.",

    cal_weekly_title: "साप्ताहिक कार्बन पुनरावलोकन",
    cal_weekly_desc: "दर सोमवारी सकाळी तुमच्या कार्बन फूटप्रिंटची तपासणी करा.",
    cal_meatless_title: "मीटलेस मंडे रिमाइंडर",
    cal_meatless_desc: "दर सोमवारी शाकाहारी भोजन घ्या — 1.5 किलो CO₂ वाचवा.",
    cal_unplug_title: "संध्याकाळी वीज बंद करण्याचे रिमाइंडर",
    cal_unplug_desc: "रात्री वापरात नसलेली उपकरणे थेट प्लगमधून काढून टाका.",
    cal_custom_title: "कस्टम आव्हान रिमाइंडर",
    cal_custom_desc: "कोणत्याही आव्हानासाठी रिमाइंडर शेड्यूल करा.",
    cal_custom_event_challenge: "आज एक इको आव्हान पूर्ण करा",

    cal_weekly_event_title: "🌱 कार्बन साथी साप्ताहिक चेक-इन",
    cal_weekly_event_desc:
      "या आठवड्यात तुमच्या कार्बन फूटप्रिंटचे पुनरावलोकन करा. कार्बन साथी उघडा आणि एक इको आव्हान पूर्ण करा.",
    cal_meatless_event_title: "🥗 Meatless Monday — इको सवय",
    cal_meatless_event_desc:
      "आज शाकाहारी जेवण निवडा! आठवड्यातून एकदा मांस न खाल्ल्यास 1.5 किग्रॅ CO₂ वाचू शकतो.",
    cal_unplug_event_title: "🔌 रात्री उपकरणे बंद करा",
    cal_unplug_event_desc:
      "आज रात्री वापरात नसलेले इलेक्ट्रॉनिक्स बंद करा आणि प्लग बाहेर काढा.",
    calendar_challenge_prefix: "🌿 कार्बन साथी आव्हान",
    calendar_challenge_desc_prefix: "आजचे इको आव्हान",
    calendar_challenge_desc_suffix:
      "आव्हान पूर्ण करून ग्रीन पॉईंट्स मिळवा! प्रगती नोंदवण्यासाठी कार्बन साथी उघडा.",

    completeBtn: "पूर्ण करा",
    easy: "सोपे",
    medium: "मध्यम",
    hard: "कठीण",
    ptsLabel: "गुण",
    pointsLabel: "गुण",
    savesLabel: "बचत ~",
    kgPerMonth: "किग्रॅ/महिना",
    challengeCompletedAlert: "आव्हान पूर्ण झाले! तुम्हाला मिळाले",
    badgeEarnedAlertPrefix: "🎉 तुम्हाला नवीन बॅज मिळाला:",
    apiSavedAlert: "API की या सत्रासाठी जतन केली आहे.",
    apiInvalidAlert: "कृपया वैध की प्रविष्ट करा.",

    t1_title: "आठवड्यातून एकदा सार्वजनिक वाहतूक वापरा",
    t1_desc:
      "गाडी ऐवजी आठवड्यातून एकदा बस किंवा मेट्रो वापरल्याने महत्त्वपूर्ण CO₂ वाचतो.",
    t2_title: "सहकाऱ्यासोबत कारपूल करा",
    t2_desc:
      "प्रवास दुसऱ्यासोबत शेअर केल्याने तुमचा वैयक्तिक उत्सर्जन निम्मा होतो.",
    t3_title: "3 किमी पेक्षा कमी प्रवासासाठी सायकल किंवा पायी जाणे ठेवा",
    t3_desc:
      "लहान प्रवास जास्त उत्सर्जन करतो. चालणे किंवा सायकल सर्वोत्तम आहे.",
    t4_title: "सर्व कामे एकाच फेऱ्यात पूर्ण करा",
    t4_desc: "अनेक कामे एकाच फेऱ्यात संपवल्याने अंतर आणि इंधन दोन्ही वाचतात.",
    t5_title: "इलेक्ट्रिक किंवा हायब्रिड वाहन खरेदी करा",
    t5_desc: "इलेक्ट्रिक वाहने पेट्रोल गाड्यांपेक्षा 70% कमी उत्सर्जन करतात.",
    t6_title: "आठवड्यातून अजून एक दिवस घरून काम करा",
    t6_desc: "वर्क फ्रॉम होममुळे प्रवासाचे उत्सर्जन पूर्णपणे वाचते.",
    t7_title: "या वर्षी एक देशांतर्गत विमान प्रवास टाळा",
    t7_desc: "एक विमान प्रवास 120+ किग्रॅ CO₂ तयार करतो. त्याऐवजी ट्रेन वापरा.",

    e1_title: "AC 18° ऐवजी 24°C वर चालवा",
    e1_desc:
      "तापमानात प्रत्येक अंशाच्या वाढीमुळे 6% वीज वाचते. 24°C पुरेसा आहे.",
    e2_title: "उपकरणे वापरात नसताना प्लग बाहेर काढा",
    e2_desc: "स्टँडबाय वीज घरातील एकूण वापराच्या 5-10% भाग घेऊ शकते.",
    e3_title: "LED बल्ब वापरा",
    e3_desc: "एलईडी बल्ब 75% कमी वीज वापरतात आणि जास्त टिकतात.",
    e4_title: "दिवसा नैसर्गिक प्रकाशाचा वापर करा",
    e4_desc:
      "खिडकीचे पडदे उघडा आणि दिवसाच्या प्रकाशाचा वापर करा — मोफत आणि शून्य उत्सर्जन.",
    e5_title: "थंड पाण्यात कपडे धुवा",
    e5_desc: "वॉशिंग मशिनची 90% ऊर्जा पाणी गरम करण्यात जाते.",
    e6_title: "छतावर सोलर पॅनेल बसवा",
    e6_desc:
      "1 किलोवॅटचे सोलर पॅनेल देखील प्रति महिना 80-120 किग्रॅ CO₂ वाचवते.",
    e7_title: "स्मार्ट पॉवर स्ट्रिप वापरा",
    e7_desc: "जेव्हा साधने वापरात नसतात तेव्हा ते वीज प्रवाह आपोआप बंद करते.",

    f1_title: "दिवसातून एकदा शाकाहारी जेवण घ्या",
    f1_desc: "एक वेळ शाकाहारी भोजन घेतल्याने दररोज 1-3 किग्रॅ CO₂ वाचतो.",
    f2_title: "मांसाहाराचे प्रमाण कमी करा",
    f2_desc:
      "मांसाचे उत्पादन शाकाहारी डाळींपेक्षा कितीतरी पट अधिक उत्सर्जन करते.",
    f3_title: "स्थानिक आणि हंगामी भाज्या खरेदी करा",
    f3_desc:
      "स्थानिक अन्नामध्ये वाहतुकीचे उत्सर्जन कमी असते आणि शेतकऱ्यांना मदत होते.",
    f4_title: "नियोजित स्वयंपाक करून अन्नाची नासाडी टाळा",
    f4_desc: "कचऱ्यातील अन्न मिथेन गॅस तयार करतो. गरजेनुसारच खरेदी करा.",
    f5_title: "घरी खत बनवण्यास सुरुवात करा",
    f5_desc: "ओल्या कचऱ्यापासून खत बनवल्याने मिथेन गॅस निर्मिती रोखली जाते.",
    f6_title: "कधीतरी दुधाचे पर्याय वापरा",
    f6_desc: "ओट मिल्क गाईच्या दुधापेक्षा 6 पट कमी उत्सर्जन करतो.",

    s1_title: "नवीन खरेदी करण्याऐवजी दुरुस्ती करा",
    s1_desc:
      "कपडे किंवा इलेक्ट्रॉनिक्स दुरुस्त करून वापरल्याने नवीन उत्पादनाचा भार वाचतो.",
    s2_title: "सेकंड-हँड कपडे खरेदी करा",
    s2_desc: "सेकंड-हँड कपडे नवीन फास्ट फॅशनपेक्षा 90% कमी CO₂ तयार करतात.",
    s3_title: "नवीन फोन किंवा लॅपटॉप एक वर्ष उशिरा खरेदी करा",
    s3_desc:
      "मोबाईल किंवा लॅपटॉपचे 80% प्रदूषण उत्पादन निर्मितीच्या वेळी होते. जास्त वेळ वापरा.",
    s4_title: "गुणवत्तेवर अधिक भर द्या",
    s4_desc: "टिकाऊ गोष्टी खरेदी केल्याने उत्पादन उत्सर्जन कमी होते.",
    s5_title: "खरेदीला जाताना नेहमी कापडी पिशवी सोबत ठेवा",
    s5_desc: "प्लॅस्टिक पिशव्यांना नकार देऊन नेहमी कापडी पिशवी वापरा.",

    w1_title: "ओला आणि सुका कचरा रोज वेगळा करा",
    w1_desc: "कचरा वेगळा केल्याने त्याचे पुनर्वापर सोपे होते.",
    w2_title: "नेहमी पाण्याची बाटली सोबत ठेवा",
    w2_desc: "प्लॅस्टिकच्या बाटल्या टाळून कचरा आणि प्रदूषण वाचवा.",
    w3_title: "प्लॅस्टिक चमचे किंवा स्ट्रॉला नकार द्या",
    w3_desc: "बाहेर जाताना स्वतःचे चमचे सोबत ठेवा.",
    w4_title: "कागद आणि मेटल पुनर्वापर करा",
    w4_desc: "नको असलेले साहित्य भंगारवाल्याला द्या.",
    w5_title: "घरी गांडूळ खत किट वापरा",
    w5_desc: "स्वयंपाकघरातील कचऱ्यापासून उत्कृष्ट खत घरीच तयार करा.",

    // Challenges
    ch_t1_title: "एक दिवस गाडीशिवाय रहा",
    ch_t1_desc: "आज गाडी चालवू नका. पायी जा, सायकल वापरा किंवा बसचा वापर करा.",
    ch_t2_title: "या आठवड्यात सायकलने कामावर जा",
    ch_t2_desc: "आठवड्यातून किमान 3 वेळा सायकलने नोकरीवर जा.",
    ch_t3_title: "5 दिवस कारपूल करा",
    ch_t3_desc: "सलग 5 दिवस सहकाऱ्यासोबत किंवा शेजाऱ्यासोबत गाडी शेअर करा.",
    ch_t4_title: "फक्त बस किंवा मेट्रो वापरा",
    ch_t4_desc: "या आठवड्यात खाजगी वाहने बंद ठेवून सार्वजनिक वाहतूक वापरा.",

    ch_e1_title: "रात्री उपकरणे बंद करा",
    ch_e1_desc:
      "एक आठवड्यापर्यंत दररोज रात्री टीव्ही आणि चार्जर बंद करून प्लग बाहेर काढा.",
    ch_e2_title: "AC 24°C वर ठेवा",
    ch_e2_desc: "आठवडाभर एसीचे तापमान २४ अंश किंवा त्यापेक्षा जास्त ठेवा.",
    ch_e3_title: "रिकाम्या खोलीतील दिवे बंद करा",
    ch_e3_desc: "खोलीतून बाहेर जाताना दिवा बंद करण्याची सवय ठेवा.",
    ch_e4_title: "कपडे उन्हात सुकवा",
    ch_e4_desc: "ड्रायरचा वापर टाळून कपडे दोरीवर सुकवा.",

    ch_f1_title: "मीटलेस मंडे",
    ch_f1_desc: "आज संपूर्ण दिवस शाकाहारी जेवण घ्या.",
    ch_f2_title: "अन्नाची शून्य नासाडी",
    ch_f2_desc:
      "या आठवड्यात स्वयंपाक असा करा की अन्नाचा एक कणही वाया जाणार नाही.",
    ch_f3_title: "5 वेळा घरी स्वतः स्वयंपाक करा",
    ch_f3_desc:
      "बाहेरचे तयार अन्न टाळून ५ वेळा ताज्या साहित्यापासून स्वयंपाक करा.",
    ch_f4_title: "खत बनवण्यास सुरुवात करा",
    ch_f4_desc:
      "आजपासून तुमच्या स्वयंपाकघरातील कचऱ्यापासून खत बनवण्यास सुरुवात करा.",

    ch_s1_title: "कापडी पिशवी वापरा",
    ch_s1_desc: "आज सर्व खरेदीसाठी कापडी पिशवीच वापरा.",
    ch_s2_title: "एक वस्तू दुरुस्त करा",
    ch_s2_desc: "फेंकण्याऐवजी एक जुना शर्ट किंवा चप्पल दुरुस्त करून घ्या.",
    ch_s3_title: "या महिन्यात नवीन कपडे नाही",
    ch_s3_desc: "३० दिवस नवीन कपडे न खरेदी करण्याचा संकल्प घ्या.",
    ch_s4_title: "पाण्याची स्वतःची बाटली ठेवा",
    ch_s4_desc: "आज बाहेर जाताना पाण्याची बाटली सोबत ठेवा.",

    ch_w1_title: "कचरा वेगळा करा",
    ch_w1_desc: "७ दिवस रोज सुका आणि ओला कचरा वेगळ्या कचराकुंडीत टाका.",
    ch_w2_title: "प्लॅस्टिक मुक्त दिवस",
    ch_w2_desc: "आज संपूर्ण दिवस कोणत्याही सिंगल-युज प्लॅस्टिकचा वापर करू नका.",
    ch_w3_title: "पुनर्वापर केंद्र शोधा",
    ch_w3_desc: "नजीकचे ई-कचरा केंद्र शोधून तिथे जुना फोन किंवा साहित्य द्या.",
  },
};

// ─── STATE ────────────────────────────────────────────────────────────────────

let _currentLanguage = "en";

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Loads saved language preference and applies it.
 */
const initLanguage = () => {
  const state = loadState();
  const saved = state.preferences?.language;
  if (saved && TRANSLATIONS[saved]) {
    _currentLanguage = saved;
    translatePage();
  }
};

/**
 * Sets the active language, persists it, and translates the page.
 * @param {string} lang - Language code: 'en' | 'hi' | 'gu' | 'mr'
 * @param {boolean} [persist=true] - Whether to save to localStorage
 */
const setLanguage = (lang, persist = true) => {
  if (!TRANSLATIONS[lang]) return;
  _currentLanguage = lang;

  if (persist) {
    const state = loadState();
    const prefs = { ...(state.preferences || {}), language: lang };
    updateStateKey("preferences", prefs);
  }

  translatePage();
};

/**
 * Returns a translated string by key.
 * Falls back to English, then to the provided fallback value (defaults to raw key).
 * @param {string} key - Translation key
 * @param {string} [fallback] - Fallback value if key not found
 * @returns {string}
 */
const t = (key, fallback) => {
  return (
    TRANSLATIONS[_currentLanguage]?.[key] ??
    TRANSLATIONS.en[key] ??
    (fallback !== undefined ? fallback : key)
  );
};

/** Returns the current language code. */
const getCurrentLanguage = () => _currentLanguage;

/**
 * Translates all tagged DOM elements on the page.
 *
 * Supported attributes:
 *  - data-i18n       → sets el.textContent
 *  - data-i18n-ph    → sets el.placeholder
 *  - data-i18n-aria  → sets el aria-label
 */
const translatePage = () => {
  // 1. Text content
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  // 2. Placeholders
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const key = el.getAttribute("data-i18n-ph");
    el.placeholder = t(key);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    el.setAttribute("aria-label", t(key));
  });

  // 4. Update the html lang attribute
  document.documentElement.lang =
    _currentLanguage === "en"
      ? "en"
      : _currentLanguage === "hi"
        ? "hi"
        : _currentLanguage === "gu"
          ? "gu"
          : "mr";
};

export {
  initLanguage,
  setLanguage,
  t,
  getCurrentLanguage,
  translatePage,
  TRANSLATIONS,
};
