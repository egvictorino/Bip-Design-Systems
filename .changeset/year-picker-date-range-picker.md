---
"@bip-design-systems/ui-components": minor
---

Add a year-picker decade grid to `DatePicker`/`DateRangePicker`. Clicking the year heading inside the existing month picker now opens a 12-year grid (±12 navigation per click), instead of only being able to step the year one at a time. New i18n keys: `selectYear`, `prevYears`, `nextYears`, `yearRange(from, to)` for both components, in `es-MX` and `en-US`. No new public props or dependencies.
