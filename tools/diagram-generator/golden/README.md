# Diagram template golden files

These SVG files are deterministic test fixtures for T01–T06. They are not
production diagram assets, reviewed legal illustrations, or manifest approvals.

Update them only with the explicit command below and after visual review at both
600px and 360px widths:

```text
npm run update:diagram-golden
npm run test:diagram-templates
npm run capture:diagram-golden
```

Production assets belong under `public/diagrams/` and require the F019 manifest,
hash, and human-review gate.
