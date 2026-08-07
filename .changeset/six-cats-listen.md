---
"@bip-design-systems/ui-components": minor
---

Cierra los pendientes restantes de empaquetado e infraestructura tras el changeset anterior:

- Fix: el paquete ahora declara `"type": "module"` — antes Node interpretaba los `.js` de
  `dist/` como CommonJS pese a que el contenido es ESM real (`publint` marcaba 45 warnings de
  este tipo). `postcss.config.js` (el único archivo `.js` del paquete en CommonJS) se renombró
  a `postcss.config.cjs` para no romperse bajo la nueva declaración.
- Nuevas stories para los subcomponentes internos de `Odontogram`: `ImagePopover`,
  `NotePopover`, `ToothDetail`, `ToothSVG` (antes solo tenían tests).
- Cobertura de lint (ESLint) y typecheck (`tsc`) ampliada a `visual/`, `.storybook/` y `e2e/`
  — antes esos directorios no se comprobaban en absoluto.
- Nuevo gate de presupuesto de bundle (`size-limit`) sobre el paquete publicado, corriendo en
  CI. Nuevos workflows de seguridad: CodeQL y `dependency-review`.
- Los jobs de deploy de Storybook en `dev`/`qa` (antes `echo` stubs que no publicaban nada)
  ahora suben la build como artifact de GitHub Actions.
