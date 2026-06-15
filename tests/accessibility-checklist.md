# ♿ Accessibility Manual QA Checklist

This checklist is required by the CarbonSathi Code Quality standards to ensure the platform is usable by everyone.

## 1. Keyboard Navigation

- [x] I can reach all interactive elements using the `Tab` key.
- [x] The current focus is clearly visible (Custom CSS focus state applied).
- [x] I can submit the calculator form using the `Enter` key.
- [x] I can navigate between app sections using the top navigation bar with the keyboard.
- [x] I can trigger challenge "Complete" buttons using the `Enter` or `Space` key.

## 2. Screen Reader Support

- [x] The page has one and only one `<h1>` tag (The logo/app name).
- [x] Heading levels (`<h2>`, `<h3>`) follow a logical, unskipped order.
- [x] The AI Assistant chat container has `aria-live="polite"` so new messages are announced.
- [x] All form inputs have explicitly linked `<label>` elements.
- [x] Essential links (Maps, Calendar) have descriptive text rather than just "Click here".

## 3. Visual Design & Contrast

- [x] Text color contrast meets WCAG AA standards (checked via DevTools).
- [x] Dark mode (`prefers-color-scheme: dark`) maintains adequate contrast.
- [x] Important information is not conveyed by color alone (e.g., badges have text labels like "Easy").
- [x] The page remains usable and readable when zoomed to 200%.

## 4. Motion and Animation

- [x] CSS animations use a `@media (prefers-reduced-motion: reduce)` block to disable motion for users who prefer it.
- [x] Transition times are kept short (0.2s - 0.5s) to avoid motion sickness.

## 5. Form Validation

- [x] Number inputs use `type="number"` and have appropriate `min` values.
- [x] The calculator gracefully handles empty or invalid inputs without crashing.
- [x] The Assistant input has a visually hidden but screen-reader accessible label.

_Completed by: CarbonSathi QA_
_Date: 2026-06-13_
