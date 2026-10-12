# THE GLENOLIA — public website

A light, responsive information website in English, Traditional Chinese and Japanese. Native A-v1 artwork, the five selected palette values, Noto typography and the existing magnolia hero are preserved. September 2027 remains a target opening, subject to readiness and required approvals. The approved founder wording remains unchanged; John Ou leads the coffee project alongside plantation consultants.

## Live services

- Website: https://theglenolia.com.au/ — standalone GitHub Pages repository.
- Owner entry: https://theglenolia.com.au/admin/ — protected Cloudflare workspace, exact owner john@theglenolia.com.au, six-hour sessions.
- Registration: a Cloudflare endpoint sends Brevo double-opt-in email in the selected language. Admission to the confirmed list requires the email link. No API credentials are sent to the visitor.
- Business email: Google Workspace, with verified incoming routing for info@theglenolia.com.au and partner@theglenolia.com.au.
- Partner invitation: the In the making page links to the partner mailbox with a localized expression-of-interest subject. It opens the visitor’s email app.
- Instagram: the official @theglenolia account is linked. Automatic feed import still needs Meta account authorization; no invented posts appear.
- Google Business Profile: account creation/verification remains separate from completed Workspace setup.

## Owner workflow

Sign in to the admin with the existing Cloudflare account for john@theglenolia.com.au. Subscribers displays the website confirmation list, language, interests, consent date and unsubscribed status; search filters the current page and pagination covers additional records.

Monthly eDMs contains October, November and December 2026, each in three languages. Their delivery plans use the last calendar day at 10:00 am Australia/Sydney. Choose an edition, review each language and saved preview, then confirm its schedule. Scheduled editions lock in this editor. Use Brevo to pause or change an already queued campaign.

Owner alerts are sent to john@theglenolia.com.au when a new website subscriber confirms their email, normally within five minutes. They include email, optional name, chosen language/interests and a link to the protected admin. Repeat registration by the same address does not send another alert. Existing subscribers are baselined at activation, so old registrations are not replayed. The protected subscriber view shows whether alerts are enabled and any uncertain delivery needing review. Alerts use the existing Brevo sending allowance.

The cloud timer checks explicitly enrolled editions every five minutes. A language with no active confirmed subscribers waits rather than inventing recipients. When subscribers join, the timer queues the matching campaign for the saved time. Delivery uses the current language list; Brevo suppresses unsubscribed contacts. Waiting lists that remain empty at sending time are marked accordingly. Ambiguous provider outcomes stop for review, retain the provider ID when available and are never blindly retried.

The configured audience allowance is 250, leaving room within the current free daily email allowance for confirmation messages. The timer suspends already queued campaigns when audience growth or consent issues fail preflight; review the Brevo plan and paused campaign before resuming. No paid upgrade is automatic. The first three editions contain introductory, trial-learning and local-community invitations, with no invented progress or harvest claims. Later editions need current project facts and checked translations.

## Build and check

Use Node 24 and Python 3.12 or newer:

```sh
node integrations/build-admin.mjs
node --test integrations/newsletter.test.mjs integrations/admin.test.mjs
python scripts/build.py
python scripts/audit.py
```

`content.json` contains the original reviewed copy. `content-additions.json` contains the coffee, partner, monthly-registration, privacy and owner-entry additions. `config.json` is public configuration only. GitHub Actions publishes only `dist/`; admin source is deployed separately to its Worker.

## Backend deployment

Wrangler is pinned in `integrations/package.json`. Copy the example configurations to ignored local files, set the account/database/Access audience and provider bindings, then deploy. Store BREVO_API_KEY as a Worker secret. A new database uses `admin-schema.sql`; an existing pre-scheduler database needs `migrations/001-audience-scheduler.sql` once, preserving its previous campaign table. For an existing database, apply `migrations/002-owner-notifications.sql`, baseline the current list privately, then enable `OWNER_NOTIFICATIONS_ENABLED`. The notification ledger retains only a normalized-address hash and delivery state. Atomic send claims and provider duplicate keys protect concurrent/repeated checks; ambiguous results retry only within ten minutes and then lock for review. Never reset an uncertain row without checking provider logs. Account identifiers, DNS backups, provider credentials, subscriber records and operational evidence are private and are excluded from this repository.

Google and Brevo DKIM coexist in GoDaddy DNS. Preserve the existing Google MX, single SPF record and DMARC quarantine policy. Primary/alias domain connection is complete; alternate-domain homepage redirects do not preserve deep page paths. Use the official domain for page links.

## Editorial and media maintenance

Do not infer planting, harvest, product origin, facility readiness or public visiting access from proposals or concept images. IPR107, NR25 and Marsellesa are the accepted first-block direction; Paraíso is a separate early trial, and NR25’s identity is unresolved. Keep the café vegetarian standard and the approved founder attribution. Rebuild font subsets when new public characters are added.

Native logo geometry and outlines remain unchanged. Web SVG presentations adjust viewport padding/dimensions only. The supplied aerial footage is silent background motion, with still fallback, pause, visibility/data-saving and reduced-motion controls. Approved botanical imagery is identified as illustrative concepts.

## Authorized Instagram import

`scripts/sync_instagram.py` verifies the authorized account, imports up to six real posts and caches resized images. No Instagram script or tracking is embedded. Video posts link through their still thumbnails. Reviewed caption translations may be added under `captions` (`en`, `zh`, `ja`).

Connect a professional account with Meta’s minimum `instagram_business_basic` permission. Save the token as repository secret INSTAGRAM_ACCESS_TOKEN and account ID/current supported version as repository variables. Test manual import before enabling the feed workflow. Failed imports preserve the last valid feed; authorization is not yet complete.
