# 🌱 CarbonSathi Code Quality Guide

This document defines the quality, security, testing, accessibility, and performance rules for the CarbonSathi project.

The goal is to maximize the Hack2Skill PromptWars evaluation score by keeping the code clean, maintainable, secure, efficient, testable, and accessible.

---

## 1. Development Principles

CarbonSathi must follow these principles:

- Keep the app simple, fast, and useful
- Write readable code before clever code
- Separate data, logic, and UI rendering
- Avoid duplicate logic
- Make every calculation traceable
- Keep user data private
- Design for mobile and keyboard users
- Ensure the app still works when AI services are unavailable

---

## 2. JavaScript Standards

### 2.1 Module Pattern

Use modular JavaScript files with clearly separated responsibilities.

Recommended modules:

```text
app.js              # App bootstrap and navigation
calculator.js       # Carbon calculation logic
dashboard.js        # Dashboard rendering
recommendations.js  # Personalized insight engine
assistant.js        # Chat UI logic
gemini.js           # Gemini API wrapper and fallback logic
challenges.js       # Eco challenge logic
goals.js            # Goal tracking
storage.js          # localStorage helper
i18n.js             # Language support
maps.js             # Google Maps links
calendar.js         # Google Calendar links
```

---

### 2.2 Naming Conventions

| Item         | Convention         | Example                      |
| ------------ | ------------------ | ---------------------------- |
| Variables    | `camelCase`        | `monthlyFootprint`           |
| Functions    | `camelCase`        | `calculateTotalEmission()`   |
| Constants    | `UPPER_SNAKE_CASE` | `DEFAULT_ELECTRICITY_FACTOR` |
| DOM elements | suffix with `El`   | `submitButtonEl`             |
| Data files   | clear nouns        | `emissionFactors.js`         |
| CSS classes  | BEM style          | `dashboard__card--highlight` |

---

### 2.3 Code Rules

- Do not place large logic directly inside event listeners.
- Keep functions small and focused.
- Avoid magic numbers; use named constants.
- Validate all user inputs before calculation.
- Keep emission factors in a separate data file.
- Avoid unnecessary global variables.
- Use early returns for invalid states.
- Add comments only where logic needs explanation.
- Prefer pure functions for calculation and recommendation logic.

---

## 3. Carbon Calculation Quality

### 3.1 Emission Factors

All emission factors must be stored in one place:

```text
assets/js/data/emissionFactors.js
```

Each factor should include:

- Category
- Unit
- Value
- Description
- Source note or assumption note

Example:

```js
const EMISSION_FACTORS = {
  carPetrolPerKm: {
    value: 0.192,
    unit: "kgCO2e/km",
    note: "Approximate passenger car emission factor used for awareness calculation.",
  },
};
```

---

### 3.2 Calculation Rules

- Never hard-code factors inside UI files.
- Round final display values, not internal calculation values.
- Handle empty, zero, and invalid values safely.
- Clearly separate monthly and yearly estimates.
- Mark results as estimates for awareness.
- Provide explanation text for each category result.

---

### 3.3 Recommendation Rules

Recommendation logic should be deterministic and testable.

Good pattern:

```js
const getTopCategory = (categoryScores) => {
  return Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0][0];
};
```

Recommendations must consider:

- Highest emission category
- User difficulty preference
- Low-cost alternatives
- Estimated impact
- Real-world practicality

---

## 4. HTML Quality Standards

Use semantic HTML.

Required landmarks:

- `<header>`
- `<nav>`
- `<main>`
- `<section>`
- `<article>`
- `<footer>`

Form rules:

- Every input must have a visible `<label>`.
- Every error message must be connected to the input.
- Required fields must be marked clearly.
- Use correct input types such as `number`, `radio`, and `select`.

Avoid:

- Clickable `<div>` without role and keyboard handling
- Empty headings
- Unlabeled icons
- Inline event handlers like `onclick=""`

---

## 5. CSS Quality Standards

### 5.1 CSS Architecture

Use:

- CSS custom properties
- BEM naming
- Mobile-first responsive layout
- Reduced-motion support

Example:

```css
:root {
  --color-primary: #1f9d55;
  --color-surface: #ffffff;
  --space-md: 1rem;
}
```

---

### 5.2 Responsive Design

Test layouts for:

- 320px mobile width
- 375px mobile width
- 768px tablet width
- 1024px desktop width
- Large desktop screens

Rules:

- Avoid fixed-width containers
- Use `max-width`
- Use flexible grids
- Avoid text cropping
- Ensure charts remain readable on mobile

---

### 5.3 Motion and Animation

Animations should improve clarity, not distract users.

Rules:

- Use `transform` and `opacity` for smooth animation
- Avoid heavy layout-changing animations
- Respect `prefers-reduced-motion`
- Do not animate important text continuously

Example:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 6. Accessibility Checklist

Accessibility has direct evaluation value and must be tested before submission.

### 6.1 Keyboard

- [x] All buttons are reachable with Tab
- [x] All forms can be completed using keyboard only
- [x] Focus state is clearly visible
- [x] Modal/dialog focus does not get lost
- [x] Enter and Space work for custom controls

### 6.2 Screen Reader

- [x] Page has one clear `<h1>`
- [x] Headings follow logical order
- [x] Assistant messages use `aria-live="polite"`
- [x] Error messages use `aria-live="assertive"`
- [x] Icons that are decorative have `aria-hidden="true"`
- [x] Meaningful icons/images have accessible labels

### 6.3 Forms

- [x] Every field has a label
- [x] Error messages are specific
- [x] Required fields are clearly marked
- [x] Inputs use correct types
- [x] Number fields have sensible min/max values

### 6.4 Visual Design

- [x] Text contrast meets WCAG AA
- [x] Buttons are large enough for touch
- [x] No important information is color-only
- [x] Font sizes are readable
- [x] Layout works at 200% zoom

---

## 7. Security Checklist

### 7.1 DOM Safety

- [x] Never use `innerHTML` with raw user input
- [x] Use `textContent` for user-generated content
- [x] Escape content before rendering markdown-like text
- [x] Validate all input before processing
- [x] Do not inject AI output directly as HTML

Safe pattern:

```js
messageEl.textContent = assistantReply;
```

Unsafe pattern:

```js
messageEl.innerHTML = assistantReply;
```

---

### 7.2 API Key Safety

- [x] Never commit API keys
- [x] Use placeholder values in code
- [x] Document how to add local API config
- [x] Ensure app works without API key using fallback data
- [x] Add `.env` and config files to `.gitignore`

Example `.gitignore`:

```text
.env
.env.local
config.local.js
*.log
node_modules/
.DS_Store
```

---

### 7.3 Privacy

- [x] Do not collect names, phone numbers, addresses, or passwords
- [x] Store only non-sensitive progress data
- [x] Explain that estimates are stored locally
- [x] Provide reset/clear data option
- [x] Avoid unnecessary third-party tracking

---

### 7.4 External Links

All external links should use:

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer"></a>
```

---

## 8. Efficiency Checklist

- [x] Repository size below 10 MB
- [x] No unused images or heavy assets
- [x] SVG icons preferred over large PNG files
- [x] Lazy-load optional Google services
- [x] Avoid heavy frameworks unless required
- [x] Minimize repeated DOM queries
- [x] Cache selected DOM elements
- [x] Debounce expensive calculations
- [x] Keep local data compact
- [x] Use efficient array/object operations

---

## 9. Testing Strategy

Testing was the weakest area in the previous challenge, so Challenge 3 must include visible test files and a test plan.

### 9.1 Required Test Files

```text
tests/
├── calculator.test.js
├── recommendations.test.js
├── storage.test.js
├── ui-validation.test.js
└── accessibility-checklist.md
```

---

### 9.2 Calculator Tests

Required cases:

- [x] Zero commute distance returns zero transport emission
- [x] Petrol car produces higher transport emission than public transport
- [x] Electricity calculation handles zero kWh
- [x] Food category changes based on diet type
- [x] Total footprint equals sum of all categories
- [x] Yearly footprint equals monthly footprint multiplied by 12
- [x] Invalid negative input is rejected or normalized

---

### 9.3 Recommendation Tests

Required cases:

- [x] Highest emission category is selected correctly
- [x] Transport-heavy user gets transport actions
- [x] Energy-heavy user gets energy actions
- [x] Food-heavy user gets food actions
- [x] Completed actions are not repeatedly suggested
- [x] Difficulty preference changes recommendation type

---

### 9.4 Storage Tests

Required cases:

- [x] User progress can be saved
- [x] User progress can be loaded
- [x] Invalid saved data does not break the app
- [x] Reset clears all local data
- [x] Default state is created when no saved data exists

---

### 9.5 Assistant Fallback Tests

Required cases:

- [x] Gemini unavailable returns offline fallback
- [x] Empty user message shows validation error
- [x] Assistant response is safely rendered
- [x] Carbon result context is included in prompt
- [x] No API key still allows app usage

---

## 10. Manual QA Checklist

Run this before final submission.

### Main Flow

- [x] App opens from `index.html`
- [x] User can complete calculator
- [x] Dashboard shows total footprint
- [x] Category breakdown is visible
- [x] Recommendations are generated
- [x] User can complete challenges
- [x] Goals are saved after refresh
- [x] Assistant works with fallback
- [x] Calendar link opens correctly
- [x] Maps link opens correctly

### Edge Cases

- [x] Empty form submission
- [x] Very large number input
- [x] Negative number input
- [x] Browser refresh
- [x] Offline mode
- [x] Mobile screen
- [x] Keyboard-only usage
- [x] API key missing

---

## 11. Suggested NPM Scripts

Use these scripts if the project includes `package.json`.

```json
{
  "scripts": {
    "lint": "eslint assets/js/**/*.js tests/**/*.js",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "size": "du -sh .",
    "check": "npm run lint && npm run test"
  }
}
```

Before final submission run:

```bash
npm run format
npm run lint
npm run test
npm run size
```

---

## 12. Pull Request / Commit Checklist

Even if working alone, follow this review process.

- [x] Code is committed regularly
- [x] Only one branch is used
- [x] No generated junk files are committed
- [x] README is updated
- [x] CODE_QUALITY.md is updated
- [x] Tests pass
- [x] Accessibility checklist is completed
- [x] No secrets are committed
- [x] Repository size is under 10 MB

---

## 13. Evaluation Score Improvement Plan

To improve Code Quality:

- [x] Split logic into small modules
- [x] Add comments for carbon assumptions
- [x] Keep calculation functions pure
- [x] Use clear names
- [x] Avoid duplicate code
- [x] Add data files for factors and tips
- [x] Add complete README and architecture explanation

To improve Testing:

- [x] Add real test files
- [x] Add calculator unit tests
- [x] Add recommendation tests
- [x] Add storage tests
- [x] Add accessibility checklist
- [x] Mention tested edge cases in README

To improve Security:

- [x] Use safe DOM methods
- [x] Avoid storing sensitive data
- [x] Never commit API keys
- [x] Add fallback for missing Gemini key
- [x] Add clear `.gitignore`

To improve Accessibility:

- [x] Add labels and ARIA live regions
- [x] Ensure keyboard navigation
- [x] Add visible focus styles
- [x] Test contrast
- [x] Add reduced-motion support

---

## 14. Final Submission Gate

Do not submit until all are true:

- [x] Public GitHub repository
- [x] One branch only
- [x] Repository size below 10 MB
- [x] README includes vertical, approach, working, assumptions
- [x] CODE_QUALITY.md included
- [x] Tests included
- [x] App works without Gemini key
- [x] No API keys committed
- [x] Keyboard and mobile tested
- [x] Final commit pushed

---

## 🏁 Quality Goal

Target score: **98+ / 100**

Primary improvement focus compared with previous challenge:

- Code Quality: improve from 86 to 95+
- Testing: improve from 78 to 95+
- Maintain high Security, Efficiency, Accessibility, and Google Services scores
