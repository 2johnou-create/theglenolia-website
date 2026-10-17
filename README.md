# THE GLENOLIA — public website

A light, responsive information website in English, Traditional Chinese and Japanese. Native A-v1 artwork, the five selected palette values and Noto typography are preserved. The homepage uses the original magnolia hero and a static progress preview linking to Our Progress. The programme miniature runs on its dedicated subpage. September 2027 remains a target opening, subject to readiness and required approvals. The approved founder wording remains unchanged; John Ou leads the coffee project alongside plantation consultants.

## Live services

- Website: https://theglenolia.com.au/ — standalone GitHub Pages repository.
- Owner entry: https://theglenolia.com.au/admin/ — protected Cloudflare workspace, exact owner john@theglenolia.com.au, six-hour sessions.
- Registration: a Cloudflare endpoint sends Brevo double-opt-in email in the selected language. Admission to the confirmed list requires the email link. No API credentials are sent to the visitor.
- Business email: Google Workspace, with verified incoming routing for info@theglenolia.com.au and partner@theglenolia.com.au.
- Partner invitation: the In the making page links to the partner mailbox with a localized expression-of-interest subject. It opens the visitor’s email app.
- Instagram: the official @theglenolia account is linked. Automatic feed import still needs Meta account authorization; no invented posts appear.
- Google Business Profile: account creation/verification remains separate from completed Workspace setup.
- Programme updates: `/progress/programmes/`, `/zh-hant/progress/programmes/` and `/ja/progress/programmes/` show four developing areas, dated coffee observations and an illustrative miniature. Our Progress links into these pages. Programme 3D, Sydney day/night and attributed nearby weather run on these subpages without visitor geolocation.

## Owner workflow

Sign in to the admin with the existing Cloudflare account for john@theglenolia.com.au. Subscribers displays the website confirmation list, language, interests, consent date and unsubscribed status; search filters the current page and pagination covers additional records.

**Programme progress** edits each area's status, Working on, Next milestone and up to four completed items in **English only**. **Save English draft** stores it privately without AI. Optional **Preview translations** shows read-only Traditional Chinese/Japanese versions without writing the draft; editing invalidates that preview. **Publish public update** first saves any unsaved English, then asks for confirmation. **Publish now** prepares the paired translations and publishes all three languages atomically. Existing reviewed translations are reused where English is unchanged; failures retain the draft and previous public version. No manual target-language editing is required.

Coffee growing also has separate actual stages for the fixed IPR107/NR25/Marsellesa seed group and Paraíso trial, with editable height and observation date. Both tracks support all eight growth stages; grafting is optional. Visitor previews never alter these records. Programme publication does not send an email. See [PROGRAMME_WORLD.md](PROGRAMME_WORLD.md) for the full workflow, translation/weather cache behaviour and maintenance.

Monthly eDMs contains October, November and December 2026, each in three languages. Their delivery plans use the last calendar day at 10:00 am Australia/Sydney. Choose an edition, review each language and saved preview, then confirm its schedule. Scheduled editions lock in this editor. Use Brevo to pause or change an already queued campaign.

Owner alerts are sent to john@theglenolia.com.au when a new website subscriber confirms their email, normally within five minutes. They include email, optional name, chosen language/interests and a link to the protected admin. Repeat registration by the same address does not send another alert. Existing subscribers are baselined at activation, so old registrations are not replayed. The protected subscriber view shows whether alerts are enabled and any uncertain delivery needing review. Alerts use the existing Brevo sending allowance.

The cloud timer checks explicitly enrolled editions every five minutes. A language with no active confirmed subscribers waits rather than inventing recipients. When subscribers join, the timer queues the matching campaign for the saved time. Delivery uses the current language list; Brevo suppresses unsubscribed contacts. Waiting lists that remain empty at sending time are marked accordingly. Ambiguous provider outcomes stop for review, retain the provider ID when available and are never blindly retried.

The configured audience allowance is 250, leaving room within the current free daily email allowance for confirmation messages. The timer suspends already queued campaigns when audience growth or consent issues fail preflight; review the Brevo plan and paused campaign before resuming. No paid upgrade is automatic. The first three editions contain introductory, trial-learning and local-community invitations, with no invented progress or harvest claims. Later editions need current project facts and checked translations.

## Build and check

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
```

Use the release audit for final test counts and deployment status. `content.json` contains the original reviewed copy. `content-additions.json` contains the coffee, partner, monthly-registration, privacy and owner-entry additions. `progress-content.json` maintains the physical development world; `programme-content.json` contains the programme's reviewed static baseline and localized interface. `config.json` is public configuration only. GitHub Actions publishes only `dist/`; admin source and public API changes are deployed separately to their Workers.

## Backend deployment

Wrangler is pinned in `integrations/package.json`. Copy the example configurations to ignored local files, set the account/database/Access audience and provider bindings, then deploy. Store BREVO_API_KEY as a Worker secret. A new database uses `admin-schema.sql`; an existing pre-scheduler database needs `migrations/001-audience-scheduler.sql` once, preserving its previous campaign table. For an existing database, apply `migrations/002-owner-notifications.sql`, baseline the current list privately, then enable `OWNER_NOTIFICATIONS_ENABLED`. The notification ledger retains only a normalized-address hash and delivery state. Atomic send claims and provider duplicate keys protect concurrent/repeated checks; ambiguous results retry only within ten minutes and then lock for review. Never reset an uncertain row without checking provider logs. Account identifiers, DNS backups, provider credentials, subscriber records and operational evidence are private and are excluded from this repository.

Google and Brevo DKIM coexist in GoDaddy DNS. Preserve the existing Google MX, single SPF record and DMARC quarantine policy. Primary/alias domain connection is complete; alternate-domain homepage redirects do not preserve deep page paths. Use the official domain for page links.

Programme updates use the existing D1 database from both admin and public Workers. Apply `migrations/003-programme.sql`, `migrations/004-weather-cache.sql` and `migrations/005-programme-translations.sql` before enabling their routes. The admin example includes a server-side Workers AI binding named `AI`. Normal uncached translation uses Qwen3 generation followed by an editorial pass against the English, with OpenCC Traditional Chinese normalization, schema validation and protected names/numbers/units. Both targets pass final checks before atomic publication; no model credential reaches the frontend. Private translation reuse lasts up to 30 days and is bounded to 100 entries. Model attempts, including generation, editing and retries, are capped at six per rolling minute and 20 per UTC day; cached reuse makes no model call. These checks do not guarantee perfect translation. This feature configures no paid upgrade; existing provider limits still apply. Keep the Access policy, email schedules and subscriber/consent tables intact. [PROGRAMME_WORLD.md](PROGRAMME_WORLD.md) covers binding setup, failure behaviour and baseline maintenance.

## Editorial and media maintenance

Do not infer planting, harvest, product origin, facility readiness or public visiting access from proposals or concept images. IPR107, NR25 and Marsellesa are the fixed seed-group labels; Paraíso is a separate early trial, and NR25’s identity is unresolved. Publish actual growth only from confirmed, dated observations. Keep the café vegetarian standard and the approved founder attribution. Rebuild font subsets when new public characters are added.

Native logo geometry and outlines remain unchanged. Web SVG presentations adjust viewport padding/dimensions only. The supplied aerial footage is silent background motion, with still fallback, pause, visibility/data-saving and reduced-motion controls. Approved botanical imagery is identified as illustrative concepts.

The programme's workers, thoughts, routes, breaks and layouts are illustrative, not attendance or construction records. Actual notes remain separate from visitor growth previews, and the physical Progress page retains its DA-approved milestone. Programme scenes use static fallbacks, local lazy modules, pause/reduced-motion controls and bounded rendering. Preserve MET Norway attribution, its CC BY 4.0 link, nearby-estimate wording and stale/unavailable states. Public programme notes must not contain private operational or subscriber information.

## Authorized Instagram import

`scripts/sync_instagram.py` verifies the authorized account, imports up to six real posts and caches resized images. No Instagram script or tracking is embedded. Video posts link through their still thumbnails. Reviewed caption translations may be added under `captions` (`en`, `zh`, `ja`).

Connect a professional account with Meta’s minimum `instagram_business_basic` permission. Save the token as repository secret INSTAGRAM_ACCESS_TOKEN and account ID/current supported version as repository variables. Test manual import before enabling the feed workflow. Failed imports preserve the last valid feed; authorization is not yet complete.
