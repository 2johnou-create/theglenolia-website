# Programme world and public updates

The programme world is the homepage hero illustration and a separate page under
Our Progress. It shows four developing areas: Café & farm experiences, Coffee
growing, Hands-on workshops and Local connections. The original magnolia image
assets remain preserved; the programme miniature now occupies the homepage hero.
The existing farm/café construction miniature remains on the parent Progress
page and has its own [maintenance guide](PROGRESS_WORLD.md).

## Public routes and content

| Language | Programme page |
| --- | --- |
| English | `/progress/programmes/` |
| Traditional Chinese | `/zh-hant/progress/programmes/` |
| Japanese | `/ja/progress/programmes/` |

Each localized homepage links to its programme page. Our Progress also has an
entry to the programme page. Common language navigation retains the current
route. The main action remains registration for notices and the newsletter.

`programme-content.json` contains the reviewed static baseline, localized
interface copy and educational growth notes. `scripts/programme_markup.py`
generates readable HTML before JavaScript runs. The public page then requests
the explicitly published notes from the API origin in `config.json`:

- `GET /public/programme`: four public area records, dated coffee observations
  and publication metadata.
- `GET /public/weather`: a bounded nearby weather estimate with source and
  freshness information.

These routes are read-only. They do not return drafts, editor identities,
subscriber records or credentials. The public content projection is allowlisted.
If programme loading fails, the page retains its reviewed baseline, or the last
successfully loaded notes during that visit, with an unavailable-update message.
It never substitutes a private draft. Visible pages check for new notes about
once a minute; public responses have a 60-second cache allowance.

## Owner editing and publication

Open the website's `/admin/` entry, sign in through the existing owner-only
Cloudflare Access protection and select **Programme progress**. No separate
programme password or public write access is introduced.

1. Choose an area and its current status: Planning, In development, In trial or
   Ready for the next step. These statuses do not announce a public opening.
2. Write **Working on**, **Next milestone**, and any **Completed milestones** in
   English, Traditional Chinese and Japanese. Each main note allows 280
   characters. Completed items allow up to four lines of 120 characters each.
3. Keep completed items aligned in meaning and order across the three languages.
   Leave them blank until the work is confirmed. Drafts can be incomplete;
   publication requires all three versions and matching completed-item counts.
4. Select **Save draft & review**, then open **Review all three languages**.
   Check every area and the coffee observations, not only the visible editor.
5. Select **Publish public update**, review the confirmation and choose
   **Publish now**. This publishes all four areas and the coffee record together.
   It does not send an email or change an eDM schedule.

The last publication stays public while a new draft is edited. Revision checks
prevent one session overwriting or publishing another session's unreviewed
changes. If a conflict is reported, reload the saved notes and review again.
Allow about a minute for an already-open public page to refresh.

Write public notes only. Keep personal information, internal budgets, supplier
negotiations, subscriber details and credentials out of these fields. Notes are
plain text; HTML and URLs are rejected. Status/date fields are validated too.

## Actual coffee records and growth illustrations

The fixed variety labels are **IPR107 · NR25 · Marsellesa** for the seed-starting
group and **Paraíso** for the separate early trial. They are not free-text fields
in the owner editor. NR25 remains the supplied trial name with unresolved
identity; do not invent a cultivar profile.

Selecting **Coffee growing** in the editor exposes two independently editable
stage selectors, the approximate Paraíso height in centimetres (0–300), and an
observation date. Either track can use the full stage set:

`seed`, `germinating`, `seedling`, `grafting`, `growing`, `flowering`, `cherries`,
`harvest`.

Grafting is optional. It is not a required stage or a claim that grafting has
occurred. Advance either actual record only from a confirmed, dated observation.
The reviewed 17 October 2026 baseline records seed starting for the three-variety
group and separate Paraíso seedlings around 20 cm tall. It does not establish
harvest, cultivar identity, field layout or visitor readiness.

Visitors can explore all eight illustrated stages with the coffee controls,
then choose **Return to the reported stage**. Those controls change only the
visitor's model view. They never write to storage, advance a crop, or alter the
dated public observations. Growth does not advance automatically with the clock.

The tiny workers, routes, thoughts, tables, tools, resting periods and layouts
are a playful illustration of programme development. They are not staff
attendance, surveillance, actual construction records or an approved spatial
plan. DA approved remains the separately confirmed physical-development stage;
September 2027 remains a target opening.

## Sydney time and weather

The clock always uses `Australia/Sydney`, including daylight-saving changes.
SunCalc uses a fixed Glenorie town-area point to choose day/night from solar
position. A visitor's device timezone does not change that timezone or location.
No visitor geolocation is requested, collected or sent to the provider.

Weather is a **nearby model estimate**, not an on-site gauge. The server requests
MET Norway at the fixed town-area coordinates, identifies the application,
honours the provider's expiry and uses conditional revalidation. A shared refresh
lock prevents simultaneous visitor requests from multiplying upstream calls.
Without a supplied expiry, the refresh interval is 15 minutes; failed refreshes
back off for five minutes.

The server may serve a clearly marked stale snapshot during provider failure,
within a six-hour fetch-age bound and a 24-hour model-age bound. A forecast point
older than 90 minutes is marked stale. Expired, malformed or unavailable data
produces unavailable weather and dashes for measurements. Do not replace that
state with invented readings. The browser checks weather about every 15 minutes
while visible; day/night still follows the Sydney clock if weather is unavailable.

Display **MET Norway** attribution, a link to [the source](https://api.met.no/)
and the [CC BY 4.0 licence](https://creativecommons.org/licenses/by/4.0/) alongside
the estimate qualification on both the homepage and programme page. Preserve
source/freshness metadata when changing the weather interface.

## Source and rendering

- `src/progress/programmes.js`: published-note/weather loading, clock, controls
  and localized thought bubbles.
- `src/progress/programme-time.js`: fixed Sydney clock and solar day/night.
- `src/progress/programme-world.js`: original four-area procedural miniature,
  routed characters, lighting/weather and separate actual/preview plant modes.
- `public/assets/progress/programme.css`: responsive components and fallbacks.
- `integrations/programme-store.mjs`: private drafts, revision checks and the
  explicit public projection.
- `integrations/programme-public.mjs` and `programme-weather.mjs`: public reads
  and weather normalization/cache.
- `integrations/admin-ui/programme-admin.js`: owner editing and review flow.

The model loads locally near the viewport, without a runtime 3D CDN. Static
scenery is batched by material. Animation is capped at 30 fps, shadow refresh is
bounded, and mobile pixel/shadow resolution is limited. Rendering stops while
offscreen or the document is hidden. Website reduced-motion preferences,
operating-system reduced motion and the scene pause control are respected.
Keyboard arrows rotate the view; Home resets it. Touch scrolling remains enabled.

The static poster and factual updates remain readable without JavaScript or
WebGL. The growth accordion has a static educational alternative. If the model
changes, recapture `public/assets/progress/programme-poster.webp` from the
reviewed scene and inspect both day and night in the real page backgrounds.
Keep the exact native A-v1 identity and established palette; do not redraw the
logo as part of the scene.

## Build, review and deployment

Use Node 24 and Python 3.12 or newer:

```sh
npm ci --ignore-scripts
node integrations/build-admin.mjs
node --test integrations/newsletter.test.mjs integrations/admin.test.mjs integrations/owner-notifications.test.mjs integrations/programme-store.test.mjs integrations/programme-api.test.mjs src/progress/programme-time.test.mjs
python scripts/build.py
npm run build:progress
python scripts/audit.py
python scripts/audit-progress.py
python scripts/audit-programmes.py
python -m http.server 8775 --directory dist
```

The current automated suite contains 71 tests, covering existing email services,
Access/write boundaries, draft/publish races, public projections, weather cache
limits and Sydney time/DST. Static audits cover localized routes, source links,
metadata, fallback content and lazy module references. Browser review must also
cover three languages, small mobile layouts, actual and illustrative growth,
department focus, day/night/rain, pause/reduced motion, keyboard/touch navigation,
fallbacks and the existing registration flow. Rebuild font subsets when adding
new public characters.

GitHub Actions builds and audits `dist/` before Pages deployment. Worker changes
deploy separately. Both the admin Worker and public newsletter Worker need the
same existing D1 binding; apply `integrations/migrations/003-programme.sql` and
`004-weather-cache.sql` to that database before enabling these routes. Preserve
the existing email tables, consent records, sending schedules and Access policy.
Changing this programme feature must not reset them. Keep account bindings,
credentials and operational evidence outside the public repository.

Owner publication updates the dynamic notes without a GitHub rebuild. For an
updated static/no-JS/search baseline, reconcile confirmed public facts into
`programme-content.json`, rebuild and review before publishing the static site.
Changing that baseline does not replace an existing D1 publication; keep the two
sources deliberately aligned.
