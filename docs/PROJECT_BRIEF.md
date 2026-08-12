# Project Brief

## Objective

Give overseas visitors a 30–60 minute, bilingual learning experience that
reduces high-risk mistakes before they collect a rental-car key in Japan.

The product must help users recognize which home-country instincts are unsafe,
where they must stop or yield, when they must slow down, and what to do after an
accident or breakdown.

## Users

- First-time or infrequent drivers in Japan
- Visitors from both right-driving and left-driving regions
- Mobile-first users preparing before travel or checking guidance during a trip
- People who need practical trip safety, not complete licensing-exam knowledge

## Product outcomes

- Direct Lesson 01 entry into the ordered 16-lesson guide
- 30–45 minute full guide
- Shared zh-TW/en rule, question, and diagram identity
- Reviewed questions with immediate explanations
- Deterministic weakness feedback without accounts or AI
- Source traceability and visible content verification date
- Mobile-readable, reviewed SVG diagrams

## Product architecture

```text
Official sources
  -> reviewed rule metadata
  -> bilingual lessons and questions
  -> deterministic build-time SVG diagrams
  -> Astro static site
  -> session-only quiz and weakness results
  -> GitHub Pages
```

## Current phase

Phase 0 establishes only the engineering and Agent Harness foundation. Content
schemas belong to Phase 1. Curriculum expansion, diagrams, quiz features, PWA,
and production deployment remain out of scope until their feature gates open.

## Non-goals

- No backend, database, login, user profile, CMS, analytics, or AI chatbot
- No runtime legal-content or traffic-scene generation
- No legal encyclopedia, penalty catalog, or full licensing exam simulator
- No automatic scraping and publishing
- No unreviewed legal claims or questions

## First-principles constraints

1. A compact wrong rule is worse than an incomplete but verified guide.
2. Advice must not be presented as law.
3. Effective dates are content data, not editorial prose.
4. A diagram with incorrect geometry is a content defect, not decoration.
5. Completion requires evidence; implementation alone is not evidence.
