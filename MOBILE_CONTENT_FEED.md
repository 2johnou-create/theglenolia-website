# Public content for The Glenolia app

The website remains the public editorial source. Each successful build publishes one read-only file with English, Traditional Chinese and Japanese together:

- Content: https://theglenolia.com.au/api/v1/content.json
- JSON Schema: https://theglenolia.com.au/api/v1/content.schema.json
- Published programme notes: https://glenolia-newsletter.theglenolia.workers.dev/public/programme

The native app can refresh the content file without an app release for text and image updates supported by the existing version 1 contract. New native features or incompatible contract changes still require app development. The feed carries data only, with no executable remote UI or code.

## Updating the content

Edit the reviewed public `content.json`, `content-additions.json` and public `config.json`, then use the normal website build and deployment. Additions merge over the original language object exactly as they do for the website. The exporter reads only those files and `programme-content.json`, which provides the established department identity mapping. It does not read admin drafts, subscribers, research or secrets. Unknown source properties are not exported.

The current hero remains the approved magnolia asset. Changing it requires a reviewed change to both website and exporter, with accurate alternative text in all three languages. Each direction's title must match its corresponding programme title so a reordered array cannot silently swap department identities. Locale/prefix pairs and public contact addresses are checked explicitly.

The `scripts/build.py` hook runs after `dist` is recreated and writes `dist/api/v1/content.json`; the build also copies the schema. It is self-contained in this repository. Run the export alone for inspection with:

```sh
python scripts/export_website_content.py --website . --output /tmp/glenolia-public-feed
python -m unittest discover -s scripts -p 'test_mobile_content.py'
```

`schemaVersion` is 1. `contentVersion` is the SHA-256 of the exported feed before adding the `contentVersion` property, encoded as UTF-8 JSON with sorted keys, no extra whitespace and unescaped Unicode. Unchanged public output produces the same version; unrelated source properties and live programme notes do not change it. `updatedAt` comes from `config.updated`, an editorial date rather than a fabricated publication or observation time. Keep it current when reviewing editorial changes.

Programme notes remain on the existing public programme endpoint. Staff can publish the paired English, Traditional Chinese and Japanese updates through the protected admin without rebuilding the website or releasing the app. The editorial feed links to that endpoint and does not copy drafts or pretend a bundled baseline is live. The website build does not publish `programme.snapshot.json`. The exporter can explicitly create that labelled offline fallback with `--include-programme-snapshot` for native development.

Programme version1 optionally includes up to four `snapshots` per department.
Each item contains a validated UUIDv4 `imageId`, `photo` or `concept` kind,
optional `capturedOn` date and paired `caption`/`alt` strings under `en`, `zh` and
`ja`. Images use the programme host's fixed `/public/programme/images/{imageId}`
route and become public only when staff publish. Older clients can ignore this
additive array. The optional offline baseline preserves the same allowlisted
metadata; image URLs, private upload metadata and image bytes are not embedded.
The main editorial feed's schema and version calculation remain unchanged.

## Client behaviour and hosting

Validate schema version, required fields, language mapping, bounded text and trusted URLs before replacing a cached document. Ignore unknown additive keys. Retain the last valid cache on a malformed response or network failure, identify saved information clearly, and display actual observation dates separately from download time. September 2027 remains a qualified target; a department marked ready does not establish that the whole destination is open.

GitHub Pages serves these static files through the existing HTTPS deployment. It controls the response headers and ETag; a requested custom cache policy is not configured by this exporter. Revalidate the feed on app foreground/manual refresh, honour host caching and 304 responses, and compare `contentVersion` after validation. Live programme data uses the separate API's caching policy. No new login, credential, paid service or email send is introduced.
