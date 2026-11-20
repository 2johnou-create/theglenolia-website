# Glenolia education service

The public English introduction is `/teachers/`. The separate education Worker
serves the authenticated teacher workspace and a separate D1 education database.
The existing owner-only Access administrator exposes `/education` and proxies
its staff API through a service binding. Existing newsletter lists, campaign
tables, sending schedules and public progress data are separate.

The public repository contains application code, summary metadata and character
assets. Full resource masters, private PDF assets, seed SQL, deployment configs,
keys, class records and subscriber data must stay outside public source control.
The initial library has 48 ES1–S5 four-lesson packs and eight optional senior
project guides. Only two deliberate samples are public; the rest require an
adult verified-email account. School-selected resources require an explicit
school or teacher grant on every read.

## Required private configuration

Copy the education example to an ignored local config and set the actual D1
identifier. Keep `assets.run_worker_first: true`: raw `/private/` paths must never
bypass Worker access checks. The service requires `SESSION_KEY`, `MAIL_SECRET`
and `STAFF_TOKEN` secrets, provisioned privately. No secret belongs in a browser
bundle or this document. `MAILER` binds to the existing newsletter Worker, which
has a matching private `EDUCATION_MAIL_SECRET` and exact `EDUCATION_ORIGIN`.
`EDUCATION` on the existing admin Worker binds to this service and carries the
matching private `EDUCATION_STAFF_TOKEN`.

The existing mail provider key remains only in the newsletter service. The
internal sign-in route is authenticated and transactional; it never creates or
changes mailing-list contacts. Current authentication mail is capped at 20/day,
with per-address and per-IP limits. Known or ambiguous delivery failures stop
without automatic retry. Review the provider state before changing allowance.

## Teacher and school boundaries

Email sign-in links expire after 15minutes, work once and require the browser that
requested them. The host-only secure session expires after eight hours or
30 minutes of inactivity. Mutation endpoints require same-origin requests and a
session-bound CSRF value. The verified adult account starts with a personal
planning workspace. It can save favourites, private notes, groups and pinned
resource assignments, but it cannot store learner evidence.

The owner checks school authority, records an appropriate processing agreement
and activates specific memberships before learner-code observations are allowed.
No student accounts, pupil uploads, health data or official grading exist here.
Learner codes are pseudonymous, not anonymous: the school keeps the identity key
separately. Private teacher-finalised reports are immutable snapshots. Removing
a learner also removes copied group reports containing that learner’s evidence.
The daily education retention job clears learner evidence/reports from closed
groups after the school’s configured interval (default 90 days, range 7–730).

## Content changes

The staff editor saves private, immutable draft versions with optimistic revision
checks. Attach and review a static PDF for that draft, select public/teacher/
specific recipients, then use the explicit publish review. Already published
PDFs are immutable; corrections need a new draft. Existing assignments keep their
published version, including after an owner rolls the current resource back.
Withdrawal or removal of a selected-access grant blocks subsequent reads.
Downloaded copies cannot be recalled from a teacher’s device.

Static-file checks are not antivirus or PDF/UA certification. Review content,
rights, curriculum edition, safety, plain-text alternatives and layout before
publishing. Materials contribute selected NSW outcomes; they are not NESA
endorsement or automatic completion of required fieldwork or a depth study.

## Checks

Run `node integrations/build-admin.mjs` before the admin/education tests, then
`node --test integrations/test/education.test.mjs`. The suite uses real SQLite
foreign keys and transactions with fabricated school and learner records.
Public builds run the generic, progress, programme and teacher leakage audits.
No private full-pack input is needed by the public CI build.

## Character stories and classroom tools

The English collection adds 40 story scenes in eight learning sets, alongside
the 12 original scenes. `/teachers/story-library.json` contains public-safe
titles, questions, alt text and tool metadata. Scene previews use WebP; JPG
downloads support common classroom software. The classroom shelf offers 12
PDFs (41 pages), including a 2027 calendar, reusable journals, role cards,
cooperative boards and calibrated 0-180 cm height-chart editions. No school
holiday dates, farm events or learner records are prefilled.

An optional `storyScenes` array belongs to a resource's immutable edition. Up
to six entries use unique `opening`, `lesson-1` through `lesson-4`, or
`reflection` placements, allowlisted `sl01` through `sl40` IDs, an optional
question and Pip/Milla/Dot/Together. The staff editor presents native choices;
an empty question uses the scene library question. Review the matching PDF
before publication. Earlier assignments retain their original illustrations.

Illustrated Revision 02 retains the original 56 learning sequences and 856
pages, adding five thematic story moments per pack. Teaching, factual and
curriculum wording is unchanged. Original V1 payloads and PDFs remain available
through the authorised version gateway. The classroom tools are intentionally
public; full teaching packs retain their existing public/teacher/selected access.

Refresh public-safe Worker assets with the private preparation tool's
`--assets-only` mode after initial setup. Do not rerun the write-once V1 seed
to publish revisions. Use the staff draft/PDF/publish workflow, preserving
optimistic revisions, audience grants and existing editions.

The height scale uses native vector geometry. Print at actual size (100%),
check the 100 mm bar, match the A-G overlaps, then check an assembled interval
and mount the zero at floor level. Digital geometry is not a printer test.

PDF upload checks parse dictionary/name structure rather than scanning encoded
image bytes for active-looking text. The pinned parser applies a 2 MiB input
limit, bounded object-stream inflation, object/depth/page limits and rejects
active, encrypted or malformed structures. It permits ordinary static image
streams containing coincidental reserved-looking bytes. This narrow profile
is not malware scanning or PDF accessibility certification.

## School Plant Portal

The public programme and scrolling estate atlas are at `/plant-portal/` on the main
site. The signed-in teacher opens `/#plant` on the education service. A
row-qualified preference, such as `/#plant?prefer=r2-p7`, follows the teacher
to the application. A free school application can also be submitted without
choosing a plant. The programme owner checks the school's authority and reviews nearby
schools first. The teacher returns to the portal to accept the offer. Students
follow the journal together in the teacher's classroom view.

Open `/plants` on the protected admin service to work in the field.

1. Under **Plant register**, match a physical tag to its row and position.
2. The owner opens **School requests** to review the school and offer a verified plant.
3. Under **Post an update**, select the tagged plant and observation date. Write
   a note, take a photo with the rear camera, or choose one from the phone.
   Check the journal preview and post. Photograph the plant without people or
   identifying information.
4. Reopen the plant's previous updates to check the entry. Use the classroom
   view in the teacher workspace to discuss observations with the students.

For new databases apply `education-schema.sql`, `plant-schema.sql`, then
`plant-atlas-schema.sql`. For an existing school Plant Portal, apply only
`plant-atlas-schema.sql` to the **education** D1 database. Execute that entire
file as one transactional D1 import before deploying the education Worker,
protected admin Worker, and public site, in that order. The migration copies
the physical register, widens its row check to 1–12 and restores all existing
keys, verification dates, tags and availability. Offers and journal references
retain their keys. The layout migration can be replayed without resetting
saved row counts or stages. Verify foreign keys and the counts of existing
physical records, offers and journal records after the migration.

The farmer dashboard controls how many of a row's 19 mapped positions appear
and selects an individual illustration stage from 1 through 10. Rows 1 and 2
initially show the 19 and eight pilot positions; the remaining ten rows start
closed to coffee. Any previously field-verified position beyond those counts
is retained on upgrade. The pilot starts with the young-seedling illustration;
new non-pilot slots start as prepared soil. Stage is an illustration setting.
Plant-specific heights come from actual recorded measurements.

The public atlas displays up to three rows in a scrollable map. All twelve
rows are reachable through the row menu. Teachers can also select a position
from the plant list. Each stage has five illustrated specimens. A position
keeps the same specimen, lean and width across the map, plant card and farmer
preview. The shared `plant-illustration.js` helper derives this appearance
from the row and position, so reopening a row restores the same drawings.

The public `GET /api/plants/map` returns the 12 row counts and enabled
positions only, without school details, physical tag strings, notes or photos.
Public plant numbers are fixed by row and position: P1 is `r1-p1`, P20 is
`r2-p1`, and P39 is `r3-p1`. Changing a different row never renumbers a plant.
Stage 1 and hidden positions cannot be requested or offered. Plant stages
2–10 permit a school preference; staff still have to verify the tag and review
the school before an offer. The public response uses no-store caching.

The protected `POST /api/education/plants/row` takes `row`, `enabledCount`
(0–19) and the dashboard's row `revision`. The corresponding `/stage` route
takes `key`, `stage` (1–10) and the individual position's `revision`. The
server checks that revision on the write. Reducing a row hides its trailing
positions without deleting them. Verified hidden journals stay available to
staff in the archive. Re-enabling a position restores its previous stage
and physical record. Offered and active school positions cannot be hidden
or returned to the soil-preparation stage. School photographs continue to use
the private education service.

The classroom endpoint omits teacher details and private questions. Private photo
responses are authenticated and use no-store caching.

Farm work opens at `/plants` on the existing Cloudflare Access admin service. The existing owner can verify tags, post or withdraw observations, review school applications and answer class questions. For a named additional farmer, configure their exact sign-in email in the admin Worker's optional comma-separated `FARMER_EMAILS` variable and allow that same identity in the existing Cloudflare Access application. Register only identities authorised by the owner. Both checks are required. A farmer can read the map and plant journals, verify tags, change availability, post photos/notes and withdraw an erroneous entry. School applications, questions, education administration and campaign data stay owner-only. Passwords, service tokens and personal email lists belong in private configuration.

The admin normalises a phone image before submitting an update. The Worker accepts a single metadata-free JPEG or WebP of up to 300 KiB and 1,600 pixels on its longest edge. Note and photo share one atomic database write. Reusing the same update ID after a network interruption returns the previous successful result. The staff member can withdraw an erroneous update and its photo. Educators see dated records for their assigned plant only.
