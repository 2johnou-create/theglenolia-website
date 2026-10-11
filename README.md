# THE GLENOLIA — public website

Light, responsive, three-language information website. The original A-v1 identity and five brand colours are retained. English, Traditional Chinese and Japanese are separate crawlable pages, with language links preserving the current topic.

The café and farm experiences are in preparation. September 2027 is a **target opening**, not a confirmed opening date. Founder copy is faithfully reused from the approved public introduction. Supplied aerial footage is used as silent background motion; botanical/still-life imagery is labelled as illustrative concepts.

## Build

Python 3.12 or newer, standard library only:

```sh
python scripts/build.py
python scripts/audit.py
python -m http.server 8791 --directory dist
```

`content.json` holds aligned editorial in all three languages. `config.json` contains public configuration, never secrets. `public/` holds optimised assets, licences and browser code. GitHub Actions builds and deploys only `dist/`.

For the temporary GitHub Pages repository URL, set the repository variable `SITE_BASE_PATH` to `/theglenolia-website`. After the official domain is connected, remove that variable and redeploy. Canonical metadata always identifies the intended official domain, `https://theglenolia.com.au`.
The temporary preview is marked `noindex`; the official-domain build permits indexing.

## Connection status

- Official domain: `theglenolia.com.au`; DNS connection pending.
- Alias domains: `glenolia.com.au`, `glenolia.com`; permanent forward-only redirects pending.
- Email: `info@theglenolia.com.au`; Workspace provisioning and verification pending. The site does not display an unverified mailbox.
- Instagram: official account link `@theglenolia` is connected. Automatic import needs professional-account API authorisation. No invented posts are displayed.
- Newsletter: registration UI is prepared and currently disabled. Connect the managed email provider, confirmation flow and privacy details, test delivery and unsubscribe, then set `newsletterReady` to `true`.

## Editorial maintenance

Update confirmed milestones after they occur. Do not infer plantings, harvests, facilities, product origins, visitor access or operational readiness from proposals or imagery. Keep the opening date a target until confirmed. Preserve the founder wording and reviewed language tone. Rebuild font subsets when new characters are added; source and licence notices are in `public/assets/fonts/`.

Native logo files are byte-for-byte copies. The `*-web.svg` presentations adjust only SVG viewport padding and declared dimensions to retain clearspace while making the outlined wordmark readable. No outline, mask, spacing, leaf geometry or colour changes. Smaller screens use the supplied compact mark without a tagline rather than squeezing the primary logo below its provisional minimum.

## Authorised Instagram import

`scripts/sync_instagram.py` verifies the authorised username, imports up to six real posts and caches resized images. Instagram scripts and tracking are not embedded in the visitor page. Video posts appear as still thumbnails linking to the original post. Captions stay in their original language unless reviewed translations are added under `captions` (`en`, `zh`, `ja`).

Connect a professional account through Meta's Instagram Login with the minimum `instagram_business_basic` permission. Put the token in the repository secret `INSTAGRAM_ACCESS_TOKEN`, and the account ID plus current supported API version in repository variables `INSTAGRAM_USER_ID` and `INSTAGRAM_API_VERSION`. Test the manual import before setting `INSTAGRAM_FEED_ENABLED=true`. The workflow refreshes daily. Renew tokens before they expire; failed imports preserve the last valid feed. This prepared integration is not claimed as a live feed until account authorisation succeeds.

## Newsletter API

`integrations/newsletter-worker.mjs` is a prepared Cloudflare Worker for Brevo double opt-in. It enforces allowed origins, payload limits, current explicit consent and rate limiting, and reports confirmation sent only after provider acceptance. Copy `wrangler.example.jsonc` to a private deployment config; provision its rate-limit bindings, list, EN/Traditional Chinese/JP confirmation templates and contact attributes. Store the API key as a Worker secret. Authentication records for the transactional/newsletter sender must be added alongside Google's records without creating duplicate SPF records.

Before opening registration, identify the operating entity and provider in the privacy notice, add a verified contact mailbox, test all three language confirmations, list admission, newsletter delivery and unsubscribe. Keep `newsletterReady=false` until those checks pass. The current disabled state prevents collection into an unconfigured service.

The website has no advertising or analytics scripts. Background video loads only when its area is visible and motion is permitted, with a still fallback and a pause control. Website hosting is an information stage; review hosting requirements before adding commercial booking or checkout features.
