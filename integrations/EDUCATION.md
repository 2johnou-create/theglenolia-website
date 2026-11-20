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

## Plant school emails

Apply `plant-notifications-schema.sql` after the adoption migration. Deploy the
newsletter relay before the education Worker when changing email payloads.
The education database records each teacher’s versioned privacy, educational
use and separate choices for farmer updates and monthly summaries. A school
invitation grants access only when its matched teacher signs in and accepts.

A journal INSERT queues messages for currently eligible, opted-in teachers
within the journal transaction. The education cron drains the queue every
five minutes and rechecks membership, consent and the status of the note and
adoption before calling the existing transactional relay. Monthly letters
summarise the previous Sydney calendar month per school. The first eligible
run is 9 am on the first of the month. A teacher who joined or subscribed
after that period waits for the next relevant summary.

The `edu_plant_mail_outbox` records pending, accepted (`sent`), cancelled and
review states. Provider rate rejection retries with a stable message key.
Reconcile `review` against the provider delivery log before a manual retry,
since a timeout can occur after provider acceptance. Email acceptance does
not confirm delivery to an inbox. Every optional message has a signed
unsubscribe link. Opening it displays a confirmation, and submitting it
disables that email category immediately without requiring a login.

## Teacher and school boundaries

The primary teacher sign-in is a six-digit emailed code, valid for 15 minutes in
the requesting browser. Five attempts are allowed per challenge. Its optional
email link and any previously issued link work once in the requesting browser. The host-only secure session expires after eight hours or
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

For a new database apply the education, plant and plant atlas schemas in order.
For a database already running the atlas, take a D1 recovery bookmark and
record the existing teacher, application, verified tag, journal and question
counts. Apply `plant-adoption-schema.sql` **once**, followed by
`plant-weather-schema.sql` and `plant-notifications-schema.sql` to the
education D1. Import each complete migration transactionally. Check the
counts and run `PRAGMA foreign_key_check`. The adoption migration preserves
application IDs, existing assignments, teachers, journal entries and questions.
Publish the compatible newsletter relay, education service, protected admin,
then public Pages. Regenerate private teacher assets and the embedded staff
bundle from the current public teacher UI source before deploying.

The first verified applicant manages the school account. The lead teacher can
invite another teacher by email and transfer responsibility to an accepted
member. Members have their own sign-in and email preferences. The lead can
add the school address and a fitted logo. Publicly naming the school on the map
requires its permission. Additional applications require an educational reason
and a farm review. Each school has up to three places, including pending
applications, offers and trees in their cooling period.

A lead teacher can withdraw an adoption with a reason, or cancel the withdrawal
during the five NSW working days before release. The scheduled job and portal
reconcile expired reservations. The adoption log retains the changes. Every
farmer note and photo belongs to its permanent plant ID across adoptions;
private questions belong to the original school application. When staff withdraw
a mistaken field note, its archived entry is retained.

New field notes record the submission time, reported observation date and
registered farm row/position. Weather comes from a regional MET Norway model
and the Australian SILO gridded climate dataset. Read each metric's date and
source. A delayed daily rainfall observation is labelled separately from a
forecast. Missing fields stay blank and do not block a farmer from posting.
Teachers can open the stage-specific learning and classroom prompts adapted
from the AgriFutures *Australian Coffee Grower’s Manual* in the plant journal.

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
positions, adoption status and an approved public school name when permitted. Addresses, teacher identities, physical tag strings, notes and photos remain private.
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
and physical record. Offered, active and cooling school positions cannot be hidden
or returned to the soil-preparation stage. School photographs continue to use
the private education service.

The classroom endpoint omits teacher details and private questions. Private photo
responses are authenticated and use no-store caching.

Farm work opens at `/plants` on the existing Cloudflare Access admin service. The existing owner can verify tags, post or withdraw observations, review school applications and answer class questions. For a named additional farmer, configure their exact sign-in email in the admin Worker's optional comma-separated `FARMER_EMAILS` variable and allow that same identity in the existing Cloudflare Access application. Register only identities authorised by the owner. Both checks are required. A farmer can read the map and plant journals, verify tags, change availability, post photos/notes and withdraw an erroneous entry. School applications, questions, education administration and campaign data stay owner-only. Passwords, service tokens and personal email lists belong in private configuration.

The admin normalises a phone image before submitting an update. The Worker accepts a single metadata-free JPEG or WebP of up to 300 KiB and 1,600 pixels on its longest edge. Note and photo share one atomic database write. Reusing the same update ID after a network interruption returns the previous successful result. The staff member can withdraw an erroneous update and its photo. Educators see dated records for their assigned plant only.
