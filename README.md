# Yessay

Yessay is a production-ready MVP for checking a student's own essay draft
against an assignment prompt and rubric before submission.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm run lint
npm run test:analysis
npm run typecheck
npm run build
```

## Demo mode

The app works without external credentials:

- `/api/analyze` uses deterministic checks based on length, prompt keywords,
  citations, thesis signals, paragraph structure, and conclusion signals.
- Prompt, rubric, and draft screenshots can be converted to editable text with
  local Tesseract OCR before analysis.
- Reports are saved in browser `localStorage`.
- Checkout uses a short-lived signed demo token and unlocks the relevant report
  only after server-side verification.
- `/report/sample-report` provides an immediate full example.
- `/check` includes a **Use sample** action for end-to-end testing.

## Environment variables

Copy the safe template, then add your server-side credentials:

```bash
cp .env.example .env.local
```

For OpenAI analysis, set:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.4-mini
```

Never expose `OPENAI_API_KEY` through a `NEXT_PUBLIC_` variable or commit
`.env.local`. Restart `npm run dev` after changing environment variables.

The remaining optional variables are:

```bash
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SINGLE_REPORT_PRICE_ID=
STRIPE_SINGLE_REPORT_PRICE_ID_699=
STRIPE_SINGLE_REPORT_PRICE_ID_799=
STRIPE_SINGLE_REPORT_PRICE_ID_999=
STRIPE_FINALS_PASS_PRICE_ID=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_ANNUAL_PRICE_ID=
NEXT_PUBLIC_SINGLE_REPORT_PRICE_VARIANT=799
CHECKOUT_DEMO_SECRET=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

When `OPENAI_API_KEY` is present, the app uses the OpenAI Responses API with a
strict Zod-backed structured output schema. The model returns grounded
performance levels and report text; Yessay deterministically converts those
levels into score percentages, caps scores for high-risk missing requirements,
and keeps source/citation criteria marked as not applicable when the assignment
does not require them. If the OpenAI call fails, the route automatically returns
the deterministic fallback and marks the report as a local fallback review.

The analysis regression suite covers deterministic score mapping, citation
applicability, missing-requirement caps, due-tonight planning, deduplication,
and formatting-warning filtering:

```bash
npm run test:analysis
```

When Stripe and the matching price ID are present, checkout uses a real Stripe
Checkout session. The success page verifies the session server-side before
granting access. Without Stripe configuration, development checkout uses a
short-lived signed demo token; set `CHECKOUT_DEMO_SECRET` outside local
development.

The single-report price is deployment-configurable for price testing:
`NEXT_PUBLIC_SINGLE_REPORT_PRICE_VARIANT=699`, `799`, or `999`. Configure the
matching Stripe price ID for each active test cell. The default variant is
`799` ($7.99).

Supabase environment variables are reserved for replacing the local storage
adapter with authenticated cloud persistence. The current MVP intentionally
keeps local storage as the working default.

## Revenue funnel analytics

Vercel Analytics records the conversion sequence without sending draft,
prompt, rubric, or other user-written content:

- `analysis_completed`
- `free_score_viewed`
- `paywall_viewed`
- `unlock_clicked`
- `checkout_started`
- `purchase_verified`
- `report_unlocked`

The primary metric is:

```text
purchase_verified / free_score_viewed
```

Use `unlock_clicked / paywall_viewed` to diagnose offer intent and
`purchase_verified / checkout_started` to diagnose checkout completion.
Events include score band, issue totals by severity, assignment type, analysis
mode, product, location, and viewport where relevant. Reveal, paywall, purchase,
and unlock events are deduplicated per browser session so refreshes do not
inflate the funnel.

## Routes

- `/` - marketing page
- `/check` - three-step essay check
- `/report/[id]` - saved report or locked preview
- `/report/sample-report` - full example report
- `/pricing` - pricing and checkout
- `/dashboard` - reports saved in this browser
- `/success` - checkout completion
- `/terms` and `/privacy` - launch placeholders

## Academic integrity

Yessay is designed for revision guidance. It does not generate full essays,
promise grades, or provide text intended to be submitted as a replacement for
the student's own work.
