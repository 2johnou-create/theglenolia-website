# Programme world and public updates

The programme world is a dedicated subpage under Our Progress. It shows four
developing areas: Café & farm experiences, Coffee growing, Hands-on workshops and
Local connections. The landing page uses the original magnolia hero and a static
progress preview linking to Our Progress. The programme miniature and its
clock/weather enhancement run only on the programme subpage. The existing
farm/café construction miniature remains on the parent Progress page and has its
own [maintenance guide](PROGRESS_WORLD.md).

The programme miniature uses four open, roofless settings so each area is easy
to recognise: a café counter and seating, a seed-starting garden, a hands-on
classroom, and shelves of illustrative local gifts and products. These are
playful programme settings, not a completed site layout or confirmed stock.

## Public routes and content

| Language | Programme page |
| --- | --- |
| English | `/progress/programmes/` |
| Traditional Chinese | `/zh-hant/progress/programmes/` |
| Japanese | `/ja/progress/programmes/` |

Visitors reach the programme page through its entry on Our Progress. Each
localized homepage links first to Our Progress. Common language navigation
retains the current route. The main action remains registration for notices and
the newsletter.

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
   **English only**. Each main note allows 280 characters. Completed items allow
   up to four lines of 120 characters each. Leave them blank until confirmed.
3. Select **Save English draft** to keep the work privately. Drafts may be
   incomplete. Saving does not call AI or publish anything.
4. Optionally choose **Preview translations** and open **Review draft and
   translations**. This produces a read-only Traditional Chinese/Japanese
   preview from the current English, including unsaved edits. It does not save
   or publish the draft. Editing any field invalidates the old preview.
5. Select **Publish public update**. The editor first saves any unsaved English
   (including the initial revision-zero baseline), then shows confirmation.
   Check the English notes for all four areas and the coffee observations.
6. Choose **Publish now**. The server prepares the paired Traditional Chinese
   and Japanese versions and publishes all three languages and the coffee
   record atomically. The editor then shows the published versions read-only.
   This does not send an email or change an eDM schedule.

English is the factual source. When an area's English is unchanged from the last
publication or reviewed baseline, its existing language versions are reused.
Only changed English needs model translation. Publication requires complete
English main notes for every area and aligned completed-item counts in the
validated results; manual target-language editing is not required.

The last publication stays public while a new draft is edited. Translation or
validation failure keeps the saved English draft and previous publication intact.
The editor reports unavailable translation, invalid output, busy/rate-limit or
other failures without claiming publication. Revision checks also prevent a
new save during translation from publishing an older snapshot. On a conflict,
preserve any unsaved English, reload and review again. Allow about a minute for
an already-open public page to refresh.

Write public notes only. Keep personal information, internal budgets, supplier
negotiations, subscriber details and credentials out of these fields. Notes are
plain text; HTML and URLs are rejected. Status/date fields are validated too.

## Translation service and safeguards

Translation runs in the protected admin Worker through its server-side
Cloudflare Workers AI binding, using Qwen3
(`@cf/qwen/qwen3-30b-a3b-fp8`). The model receives only changed English public
notes. The frontend receives no provider credential and makes no direct model
request. The anonymous public read API cannot request translation.

`integrations/programme-translation.mjs` makes a generation call followed by an
editorial call against the English for a normal uncached translation. It requests
a strict JSON schema and paired target strings for every supplied entry. Both
language versions must pass the final checks before atomic publication. Protected tokens preserve approved
names, numerals and measurement units; returned names, counts, lengths and text
shapes are checked again. OpenCC normalizes Chinese output to Traditional
Chinese. The prompt preserves planning/completed distinctions, qualifications,
founder attribution and the brand's warm tone. These checks do not replace
semantic review of sensitive new wording; the optional preview is available
before publication. Never treat arbitrary caller-supplied target text as fresh
translation evidence.

Private D1 cache entries are keyed by source, model and prompt version, retained
for up to 30 days and bounded to 100 entries. Valid cached pairs can be reused
for preview/publication. A preview may update that private cache and attempt
ledger, but never the programme draft or public snapshot. Reusing reviewed or
cached translations does not call the model.

Provider-attempt caps are six in a rolling minute and 20 per UTC day. Generation,
editorial and any retry calls each consume an attempt. Cached/reviewed reuse
consumes no model attempt. Do not describe these limits as a guarantee of free or unlimited
provider service. No paid upgrade is configured by this feature; existing
account/binding limits still apply. If the binding or allowance is unavailable,
keep the English draft and prior public version, then retry when available.

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

At night, each department has a stand with a local pool of light. The illustrated
workers visit its switch as they arrive or finish, share lights while another
worker is still in the area, and leave a short afterglow before an empty area
goes dark. Lane lamps remain safety lighting. Night garden visits focus on
inspection; rain suppresses the watering routine. These are local character
routines, with no connection to real people, switches or attendance records.
The existing pause and reduced-motion controls apply to movement and light
transitions.

## Sydney time and weather

The clock always uses `Australia/Sydney`, including daylight-saving changes.
Inside the world, a round analogue dial shows live hour/minute hands and a
second hand. The visible weather header shows the local date; a precise
localized timestamp remains available to assistive technology without repeated
live announcements. The dial works independently of WebGL and weather requests.

The adjacent animated sun/moon indicator follows the calculated Glenorie solar
horizon. It can still be daytime at 20:00 in summer or night at 17:00 in winter.
The moon shows a calculated, symbolic Southern Hemisphere phase; it is not an
on-site sky observation or a projection of its apparent viewing angle. Pausing
the miniature or reducing motion stops decorative sky effects and hides the
second hand while the clock keeps its correct time. No separate animation
loop, weather request or visitor location permission is introduced by the HUD.
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
the estimate qualification on the programme page wherever weather is shown. Preserve
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
- `integrations/programme-translation.mjs`: server-side translation, protected
  tokens, validation and bounded private reuse.

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
node --test integrations/*.test.mjs src/progress/programme-time.test.mjs
python scripts/build.py
npm run build:progress
python scripts/audit.py
python scripts/audit-progress.py
python scripts/audit-programmes.py
python -m http.server 8775 --directory dist
```

The automated suite covers existing email services, Access/write boundaries,
draft/publish races, English-source translation and cache/attempt bounds, public
projections, weather cache limits and Sydney time/DST. Use the release audit for
final test counts and deployment status. Static audits cover localized routes,
source links, metadata, fallback content and lazy module references. Browser
review must also cover three languages, small mobile layouts, actual and
illustrative growth, department focus, day/night/rain, pause/reduced motion,
keyboard/touch navigation, fallbacks and the existing registration flow. Exercise
English-only save, unsaved private preview, preview invalidation, automatic save
before confirmation, successful paired publication and translation-failure
recovery. Rebuild font subsets when adding new public characters.

GitHub Actions builds and audits `dist/` before Pages deployment. Worker changes
deploy separately. Both the admin Worker and public newsletter Worker need the
same existing D1 binding; apply `integrations/migrations/003-programme.sql`,
`004-weather-cache.sql` and `005-programme-translations.sql` to that database
before enabling the associated routes. The last migration adds only the private
translation cache/attempt tables. Preserve the existing email tables, consent
records, sending schedules and Access policy. Changing this programme feature
must not reset them. Keep account bindings, credentials and operational evidence
outside the public repository.

The admin example configuration includes the AI binding:

```json
{
  "ai": {
    "binding": "AI",
    "remote": true
  }
}
```

Copy the example into the ignored local deployment configuration and retain the
existing authorized account, D1 and Access bindings privately. Deploy the admin
Worker with its `AI` binding; the public newsletter Worker needs the shared DB
for read-only publication/weather, not an anonymous translation endpoint. Verify
one protected preview and a failure case before public release. No AI key belongs
in HTML, client JavaScript, public configuration or the repository. Do not change
provider plan/billing as part of routine deployment.

Owner publication updates the dynamic notes without a GitHub rebuild. For an
updated static/no-JS/search baseline, reconcile confirmed public facts into
`programme-content.json`, rebuild and review before publishing the static site.
Changing that baseline does not replace an existing D1 publication; keep the two
sources deliberately aligned.
