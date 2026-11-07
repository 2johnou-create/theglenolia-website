# The Glenolia progress world

Approved on 14 October 2026. The public miniature illustrates the vision for the
farm, coffee trial and café renovation. It does not document actual planting,
building geometry or construction activity. DA approved is the confirmed current
milestone; September 2027 remains a target.

## Updating a confirmed milestone

Edit `progress-content.json` only after the real milestone is confirmed:

- `config.currentStage`: 0 DA approved, 1 construction, 2 decoration/finishing,
  3 preparing to open. Stage 3 does not announce that the café is already open.
- `config.updated` and the three localized `copy.*.update` lines: confirmed
  project-update date. Change `config.json.updated` for the publication date.
- Check the English, Traditional Chinese and Japanese current story/intro and
  homepage text against the new facts. For an actual launch, update the public
  visiting information and stage-3 copy together before publishing.

One source advances the server-rendered homepage, actual timeline/default scene,
page description and runtime model. A visitor's stage preview cannot change the
confirmed milestone. Earlier/current/future illustrations remain distinct.
Scene geometry is editable in `src/progress/physical-detailed-props.js`, with the
runtime in `src/progress/world.js`; localized area notes are
in `progress-content.json`. Verify real plans before making spatial assertions.

## Build and review

Use Python 3.12 and Node 24:

```sh
npm ci --ignore-scripts
node integrations/build-admin.mjs
node --test integrations/newsletter.test.mjs integrations/admin.test.mjs integrations/owner-notifications.test.mjs
python scripts/build.py
npm run build:progress
python scripts/audit.py
python scripts/audit-progress.py
python -m http.server 8775 --directory dist
```

Three.js 0.180.0 and esbuild 0.25.11 are pinned. The model is bundled into a lazy
local module; no runtime CDN is required. The initial entry is small, model
rendering pauses offscreen/background, animation is capped at 30 fps and mobile
pixel/shadow resolution is bounded. The website motion preference and scene
pause controls are honored. Static posters, project status and all area notes
remain available without JavaScript or WebGL. Rebuild the six Noto subsets when
adding text characters; source licenses remain in the font assets.

The 7 November 2026 approved visual release applies the landscape diorama style
to both views at all four stages. Shared terrain, café props and rendering live
in `diorama-terrain.js`, `diorama-cafe.js` and `diorama-renderer.js`. The layered
ground, individual foliage, more detailed props and soft shadows remain
illustrations. Camera fitting contains the active model on phones and desktop;
desktop contact shading has a lighter mobile rendering path. The fallback image
is `public/assets/progress/farm-diorama.webp`. Keep the earlier poster archived.

Review all three languages, farm/interior, mobile menus, keyboard rotation,
hotspots, motion settings, fallbacks, signup validation and the live published
assets. The GitHub Pages workflow builds and audits before deployment. Detailed
approval and review evidence is kept outside the public repository.


The later Weather Play V1 release adds shared illustrative farm life to all four
farm stages: a tractor/trailer, handcart, birds, passing aircraft and burrowing
animals. `farm-life.js` is added after static batching. Its physical fleet route
uses `vehicleOffsetX: -1.9` to clear the existing café/plan board/coffee rows.
The parent page links to the opt-in weather game on the programme subpage; the
farm/interior milestone selectors remain independent of that local game.
