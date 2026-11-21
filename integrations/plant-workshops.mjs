import { SECURITY, fail } from './education-common.mjs';

const workshops = [
  {
    id: 'leaf-detectives', title: 'Read a coffee leaf', minutes: 30,
    summary: 'Sketch two dated views, compare visible leaves and write a question for the farmer.'
  },
  {
    id: 'weather-and-soil', title: 'Weather above, soil below', minutes: 35,
    summary: 'Read rain records, calculate a fortnightly mean and compare regional data with a field note.'
  },
  {
    id: 'cherry-to-cup', title: 'From cherry to cup', minutes: 40,
    summary: 'Sequence a coffee seed’s journey and trace which steps the class can verify for its tree.'
  }
];

export const plantWorkshopManifest = workshops.map(workshop => ({
  ...workshop, pages: 4, downloadUrl: '/api/plants/workshops/' + workshop.id + '.pdf'
}));

// The calling route has verified this teacher and their current educational-use consent.
export async function servePlantWorkshop(request, env, id) {
  const selected = plantWorkshopManifest.find(workshop => workshop.id === id);
  if (!selected) fail(404, 'not_found');
  if (!['GET', 'HEAD'].includes(request.method)) fail(405, 'method');
  const url = new URL('/private/classroom-workshops/' + selected.id + '.pdf', request.url);
  const asset = await env.ASSETS.fetch(new Request(url, {method: request.method}));
  if (!asset.ok || !asset.headers.get('Content-Type')?.toLowerCase().startsWith('application/pdf')) {
    fail(503, 'file_temporarily_unavailable');
  }
  const headers = new Headers(SECURITY);
  headers.set('Content-Type', 'application/pdf');
  headers.set('Content-Disposition', 'attachment; filename="The-Glenolia-' + selected.id + '.pdf"');
  headers.set('Content-Security-Policy', "sandbox; default-src 'none'; frame-ancestors 'none'");
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  const length = asset.headers.get('Content-Length');
  if (length) headers.set('Content-Length', length);
  return new Response(request.method === 'HEAD' ? null : asset.body, {headers});
}
