# Visual Asset Policy

## Objective

Reduce the risk that a learning diagram changes the appearance or meaning of a
regulated Japanese traffic control. Official correctness and reuse permission
are separate gates; both must pass before an asset enters a review candidate.

## Asset classes

### Regulated visuals — official-first

Traffic-light faces, road-sign faces, and standardized road-marking glyphs must
use an exact reusable asset from a Japanese authority whenever one is available.
The current primary references are:

- National Police Agency, `Traffic Lights and Road Signs`:
  https://www.npa.go.jp/english/bureau/traffic/traffic-light_english.pdf
- Ministry of Land, Infrastructure, Transport and Tourism, road signs:
  https://www.mlit.go.jp/road/sign/sign/index.htm
- e-Gov laws and regulations for controlling text and official schedules:
  https://elaws.e-gov.go.jp/

Do not redraw, visually approximate, recolor, or substitute a regulated visual
merely to match the product style. If no reusable official asset exists, stop
for an explicit exception decision; a specification-derived vector requires a
separate technical comparison and human approval.

### Scenario composition — deterministic project output

Road layout, vehicle placement, movement arrows, labels, and explanatory
overlays remain semantic project output. They communicate a scenario and do not
claim to reproduce an official sign installation or engineering drawing.

### Generated driver-seat simulations — context only

Generated images may establish sight lines, road scale, traffic conflict, and
driver attention before a deterministic explanation. They must be labelled as
generated simulations and paired one-to-one with the matching approved Diagram
ID. They are not documentary photographs and cannot prove a law, exact stopping
position, control appearance, fuel grade, toll-lane meaning, or current site
condition.

If a generated candidate contains a recognizable sign, signal, regulated road
marking, toll-control board, or fuel-grade cue, reject it. Do not repair or
present the generated feature as authoritative. Regenerate a context-only frame
and show the exact reviewed official visual or deterministic diagram beside it.

Generated simulation bytes require a local asset path, SHA-256, dimensions,
creation date, generator identity, bilingual alt text, and an explicit
`containsOfficialVisual: false` record. Runtime image generation is prohibited.

### Third-party photos and illustrations — excluded by default

Do not copy search-result images, rental-company graphics, prefectural-police
photos, or third-party illustrations without an explicit reusable licence and
rights review. A government page can contain material owned by another party.

## Required provenance record

Every imported official visual must record:

- stable internal asset ID and linked Source ID;
- authority, source URL, terms URL, and licence statement;
- retrieval date, source page/object, and exact extraction method;
- SHA-256 of the source document and imported asset;
- intrinsic dimensions, transformations, and required attribution.

The imported bytes are stored locally; production must not hotlink the upstream
asset. Build-time loading verifies the asset checksum and dimensions. Diagram
identity includes the full provenance record, so a source, terms, attribution,
or asset change returns the diagram to `needs_review`.

## Rights control

The National Police Agency states that its site content is generally reusable
under Public Data License 1.0 unless otherwise indicated. Reuse requires source
attribution; edited material must disclose the edit and must not imply that the
government created or endorsed the edited work. Third-party rights, logos,
characters, and content under separate terms remain excluded:
https://www.npa.go.jp/rules/

Before importing each file, inspect both the source page and the document for a
specific credit, copyright notice, or separate restriction. The absence of such
a notice is evidence only within the scope of the controlling site terms; it is
not a universal public-domain declaration.

## Review and release

1. Validate source authority and current meaning through a curriculum Source ID.
2. Validate reuse terms and third-party-rights exclusions.
3. Import exact bytes and create the provenance record.
4. Generate the complete scenario SVG with embedded official bytes.
5. Review at 600px and 360px equivalent widths.
6. Human approval updates the Scene and manifest together.
7. Only an approved, byte-matching SVG may exist under `public/diagrams/`.

Any Scene, output, generator, official asset, or provenance change invalidates
approval. A previous layout approval does not approve a newly substituted asset.
