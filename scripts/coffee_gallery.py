"""Small static coffee-trial gallery from the reviewed published programme only."""
from html import escape
from export_website_content import public_snapshots

HEADINGS = {
    'en': 'From the Paraíso pilot.',
    'zh': 'Paraíso 試種的片段。',
    'ja': 'Paraísoの試験栽培の記録。',
}
PUBLIC_IMAGES = 'https://glenolia-newsletter.theglenolia.workers.dev/public/programme/images/'


def render_gallery(language, programme):
    """Render validated public snapshot metadata; never accept a caller image URL."""
    if language not in HEADINGS:
        raise ValueError('Unsupported coffee gallery language')
    items = public_snapshots(programme['initial']['departments']['coffee'].get('snapshots', []))
    if not items:
        return ''
    date_label = programme['copy'][language]['snapshots']['capturedOn']
    if not isinstance(date_label, str) or not date_label.strip() or len(date_label) > 80:
        raise ValueError('Missing localized coffee photo date label')
    figures = []
    for item in items:
        translated = item['translations'][language]
        caption = f'<p>{escape(translated["caption"])}</p>' if translated['caption'] else ''
        if item['kind'] == 'photo' and item['capturedOn']:
            caption += f'<time datetime="{item["capturedOn"]}">{escape(date_label)} {item["capturedOn"]}</time>'
        if caption:
            caption = '<figcaption>' + caption + '</figcaption>'
        figures.append(
            f'<figure data-coffee-image="{item["imageId"]}">'
            f'<img src="{PUBLIC_IMAGES}{item["imageId"]}" alt="{escape(translated["alt"])}" '
            'width="1200" height="1600" loading="lazy" decoding="async" '
            'referrerpolicy="no-referrer" crossorigin="anonymous">' + caption + '</figure>'
        )
    return (
        '<section class="section coffee-gallery" data-coffee-gallery aria-labelledby="coffee-gallery-title">'
        f'<h2 id="coffee-gallery-title">{escape(HEADINGS[language])}</h2>'
        '<div class="coffee-gallery-grid">' + ''.join(figures) + '</div></section>'
    )
