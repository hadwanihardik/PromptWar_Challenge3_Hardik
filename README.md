# 🌱 CarbonSathi — Carbon Footprint Awareness Platform

> A smart, dynamic assistant that helps individuals understand, track, and reduce their daily carbon footprint through simple actions, personalized insights, progress tracking, and AI-guided recommendations.

---

## 📌 Chosen Vertical

**Sustainability / Climate Awareness / Personal Lifestyle Assistant**

CarbonSathi is designed for individuals who want to make climate-conscious choices but do not know where to begin. The platform converts everyday activities such as travel, food, electricity use, shopping, and waste habits into simple carbon insights and practical reduction actions.

---

## 📌 Problem Statement

Many people care about climate change but struggle to understand how their daily decisions contribute to carbon emissions. Existing carbon calculators can feel complex, data-heavy, or difficult to use consistently.

This leads to:

- Low awareness of personal carbon impact
- Difficulty tracking lifestyle emissions over time
- Lack of personalized and practical reduction guidance
- Low motivation because small improvements are not visible
- Confusion around which actions create the biggest impact

---

## 💡 Solution Overview

**CarbonSathi** is an AI-powered carbon footprint awareness platform that works as a personal sustainability coach. It helps users estimate their daily carbon footprint, understand the source of emissions, receive personalized reduction suggestions, and build eco-friendly habits through gamification.

The solution focuses on:

- 🧮 **Carbon Footprint Calculator** — Estimate emissions from transport, energy, food, shopping, and waste
- 🤖 **Smart AI Eco Assistant** — Context-aware answers and personalized action plans
- 📊 **Insight Dashboard** — Daily, weekly, and category-wise carbon breakdown
- 🎯 **Reduction Goals** — Track progress against personal carbon-saving targets
- 🏆 **Gamified Eco Challenges** — Earn badges, streaks, and green points
- 🗺️ **Google Maps Integration** — Compare low-carbon travel options and nearby eco-friendly services
- 📅 **Google Calendar Integration** — Schedule reminders for eco habits and weekly check-ins
- 🌍 **Localized Experience** — Simple, inclusive language for users from different backgrounds
- 🔒 **Privacy-first Design** — Local-first storage with no unnecessary personal data collection

---

## 🎯 Challenge Alignment

The challenge asks participants to:

> Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

CarbonSathi directly addresses this by combining calculation, tracking, education, habit formation, and personalized AI guidance in one lightweight web application.

| Challenge Requirement       | CarbonSathi Implementation                                             |
| --------------------------- | ---------------------------------------------------------------------- |
| Understand carbon footprint | Category-wise calculator, explanations, tips, and AI assistant         |
| Track carbon footprint      | Dashboard, history, weekly trends, goal progress                       |
| Reduce carbon footprint     | Personalized actions, challenges, habit reminders                      |
| Simple actions              | Daily eco tasks such as “Use public transport once this week”          |
| Personalized insights       | Recommendations based on user profile, lifestyle, and usage patterns   |
| Real-world usability        | Works as a lightweight responsive web app with local-first persistence |

---

## 🧠 Core Logic

CarbonSathi uses a rule-based and AI-assisted decision model.

### 1. User Context Collection

The app asks simple questions across five lifestyle areas:

1. **Transport**
   - Daily commute distance
   - Vehicle type
   - Public transport usage
   - Flight frequency

2. **Home Energy**
   - Monthly electricity usage
   - LPG or gas usage
   - Appliance habits
   - Renewable energy usage

3. **Food**
   - Diet type
   - Meat/dairy frequency
   - Local food habits
   - Food waste frequency

4. **Shopping**
   - Clothing purchases
   - Electronics purchases
   - Reuse/repair habits

5. **Waste**
   - Recycling habits
   - Composting
   - Plastic usage
   - Waste segregation

---

### 2. Carbon Estimation Engine

The platform estimates emissions using transparent, configurable emission factors stored in a separate data file.

Example calculation model:

```js
monthlyTransportCO2 = distanceKmPerDay * commuteDays * emissionFactorByVehicle;
monthlyElectricityCO2 = monthlyKwh * electricityEmissionFactor;
monthlyFoodCO2 = dietTypeMonthlyAverage + foodWasteAdjustment;
totalMonthlyCO2 = transport + energy + food + shopping + waste;
```

The goal is not to claim perfect scientific precision. The goal is to create awareness and guide practical behavior change with clearly documented assumptions.

---

### 3. Personalization Logic

CarbonSathi assigns each user an eco profile based on their highest-emission categories.

Example:

| User Pattern              | Eco Profile            | Recommended Focus                              |
| ------------------------- | ---------------------- | ---------------------------------------------- |
| High car usage            | Commuter Optimizer     | Carpooling, public transport, trip batching    |
| High electricity usage    | Energy Saver           | AC optimization, LED usage, unplugging devices |
| High meat/dairy frequency | Food Footprint Reducer | Plant-forward meals, reducing food waste       |
| High shopping footprint   | Conscious Consumer     | Repair, reuse, buy less, second-hand options   |
| Weak recycling habits     | Waste Warrior          | Segregation, composting, plastic reduction     |

---

### 4. AI Assistant Logic

The AI assistant provides practical answers using user context.

Example prompts:

- “How can I reduce my carbon footprint this week?”
- “Why is my transport score high?”
- “Give me a low-cost climate action plan.”
- “Suggest eco-friendly changes for a student.”
- “Explain carbon footprint in simple Gujarati/Hindi/English.”

The assistant response is grounded by:

- Current user footprint category
- Highest emission source
- User goals
- Difficulty preference
- Local climate and lifestyle assumptions
- Safety and practicality rules

---

## ✨ Key Features

### 1. Carbon Footprint Calculator

- Simple questionnaire-based calculator
- Covers transport, home energy, food, shopping, and waste
- Shows monthly and yearly estimated footprint
- Explains which category contributes most
- Uses clear assumptions and configurable factors

---

### 2. Personalized Dashboard

The dashboard displays:

- Total estimated carbon footprint
- Category-wise breakdown
- Weekly/monthly trend
- Highest impact area
- Goal completion percentage
- Eco score out of 100
- Recommended next action

---

### 3. AI Eco Assistant

The AI assistant acts as a sustainability coach.

Capabilities:

- Answers user questions about carbon footprint
- Explains results in simple language
- Suggests practical actions
- Creates weekly reduction plans
- Gives low-cost alternatives
- Provides motivational feedback
- Uses offline fallback suggestions if the AI API is unavailable

---

### 4. Eco Challenges

Users can complete simple challenges such as:

- Use public transport or carpool once
- Avoid single-use plastic for a day
- Eat one plant-based meal
- Turn off unused appliances
- Carry a reusable water bottle
- Segregate dry and wet waste
- Repair or reuse one item instead of buying new

Each challenge gives:

- Green points
- Badge progress
- Estimated CO₂ saved
- Streak contribution

---

### 5. Goal Tracking

Users can set goals such as:

- Reduce monthly footprint by 5%
- Save 20 kg CO₂ this month
- Complete 7 eco actions this week
- Improve transport score
- Reduce electricity usage

Progress is stored locally and shown visually.

---

### 6. Google Services Integration

| Google Service      | Usage                                                                       | Implementation                        |
| ------------------- | --------------------------------------------------------------------------- | ------------------------------------- |
| **Gemini API**      | Personalized eco assistant and explanation engine                           | Contextual prompt with local fallback |
| **Google Maps**     | Compare route choices and show nearby recycling/EV/public transport options | Maps search/deep links                |
| **Google Calendar** | Add eco habit reminders and weekly footprint check-ins                      | Calendar event deep link              |
| **Google Charts**   | Category-wise carbon visualization and trend charts                         | Lightweight visual dashboard          |

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **AI:** Gemini API with offline fallback rules
- **Visualization:** Google Charts or lightweight native SVG charts
- **Storage:** `localStorage` for user progress and preferences
- **Architecture:** Modular vanilla JavaScript
- **Design:** Responsive, mobile-first, accessible UI
- **Repository:** Public GitHub repository, single branch, under 10 MB

---

## ⚙️ How the Solution Works

1. User opens the web app.
2. User answers simple lifestyle questions.
3. The calculator estimates emissions across five categories.
4. Dashboard displays category-wise footprint and eco score.
5. Recommendation engine identifies the highest impact area.
6. AI assistant explains results and suggests practical actions.
7. User accepts challenges and sets reduction goals.
8. Progress is saved locally.
9. User can schedule reminders using Google Calendar.
10. User can explore low-carbon services/routes using Google Maps.

---

## 🧪 Testing Strategy

Testing is a major improvement area for this challenge.

### Unit Tests

- Calculator formula validation
- Emission factor mapping
- Category score calculation
- Recommendation ranking
- Goal progress calculation
- Local storage save/load behavior

### UI Tests

- Form validation
- Empty input handling
- Invalid number handling
- Dashboard rendering
- Challenge completion flow
- Theme toggle
- Language switch

### Accessibility Tests

- Keyboard navigation
- ARIA labels
- Color contrast
- Focus states
- Screen-reader friendly dynamic updates

### Manual Test Cases

| Scenario                          | Expected Result                                   |
| --------------------------------- | ------------------------------------------------- |
| User enters zero commute distance | Transport emission remains zero                   |
| User enters high car usage        | Transport appears as top recommendation           |
| User completes challenge          | Points increase and challenge is marked completed |
| Gemini API unavailable            | Offline fallback response appears                 |
| User refreshes page               | Progress remains saved                            |
| User uses keyboard only           | All major actions remain accessible               |

---

## 🔒 Security & Privacy

CarbonSathi follows a privacy-first approach.

- No passwords collected
- No unnecessary personal information collected
- No sensitive data stored
- API key must never be committed to GitHub
- User input is inserted using `textContent`, not unsafe `innerHTML`
- Local storage is used only for non-sensitive progress data
- External links use safe attributes
- Content Security Policy is recommended

---

## ♿ Accessibility

Accessibility is treated as a core requirement, not final polish.

Implemented standards:

- Semantic HTML landmarks
- Descriptive headings
- Keyboard-friendly navigation
- Visible focus indicators
- High contrast design
- ARIA live regions for assistant responses and result updates
- Labels for all form fields
- Error messages connected to inputs
- Responsive design for mobile and desktop

---

## ⚡ Efficiency

CarbonSathi is designed to stay lightweight and fast.

- No heavy framework required
- Modular vanilla JavaScript
- Small local data files
- Lazy-load optional Google services
- Local-first persistence
- Optimized SVG icons
- Repository kept under 10 MB
- Single public branch as per challenge rules

---

## 📊 Evaluation Focus Areas

| Area                     | Implementation Focus                                                    |
| ------------------------ | ----------------------------------------------------------------------- |
| **Code Quality**         | Modular files, clear naming, no duplicate logic, documented assumptions |
| **Security**             | Safe DOM updates, no exposed secrets, CSP, privacy-first storage        |
| **Efficiency**           | Lightweight architecture, optimized assets, lazy loading                |
| **Testing**              | Unit tests, UI tests, accessibility checklist, fallback testing         |
| **Accessibility**        | Semantic UI, keyboard support, contrast, ARIA live regions              |
| **Problem Alignment**    | Clear carbon tracking, personalized insights, simple actions            |
| **Real-world Usability** | Works for everyday users, mobile-first, practical recommendations       |

---

## 🧾 Assumptions

- Carbon calculations are estimates for awareness, not certified carbon accounting.
- Emission factors are kept configurable so they can be updated later.
- User data is stored locally unless a backend is added in the future.
- AI responses support education and habit guidance, not official environmental certification.
- The project is optimized for hackathon evaluation, clarity, and maintainability.

---

## ✅ Submission Checklist

Before submitting:

- [x] Repository is public
- [x] Repository has only one branch
- [x] Repository size is under 10 MB
- [x] README explains vertical, approach, logic, working, and assumptions
- [x] CODE_QUALITY.md is included
- [x] Code is modular and readable
- [x] Tests are added and passing
- [x] No API keys or secrets are committed
- [x] App works without paid API using fallback data
- [x] Accessibility checklist is completed
- [x] Final commit is pushed

---

## 🏁 Final Summary

CarbonSathi helps users understand their carbon footprint, track progress, and reduce emissions through simple daily actions. It combines a transparent calculator, personalized dashboard, AI guidance, eco challenges, and Google service integrations into a practical and lightweight sustainability assistant.

**Built for Hack2Skill PromptWars — Challenge 3: Carbon Footprint Awareness Platform**
