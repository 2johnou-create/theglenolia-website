"""Published coffee gallery contract and safe, language-specific HTML rendering."""
import copy
from html.parser import HTMLParser
import unittest
from coffee_gallery import HEADINGS, PUBLIC_IMAGES, render_gallery


class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.tags, self.text = [], []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def handle_data(self, value):
        self.text.append(value)


def image(index):
    return {
        'imageId': f'12345678-1234-4abc-8def-{index:012d}',
        'kind': 'photo', 'capturedOn': '2026-11-01',
        'translations': {
            'en': {'caption': f'Paraíso pilot photo {index}.', 'alt': f'Young Paraíso plants in photo {index}.'},
            'zh': {'caption': f'Paraíso 試種照片 {index}。', 'alt': f'照片 {index} 中的 Paraíso 幼苗。'},
            'ja': {'caption': f'Paraísoの試験栽培の写真{index}。', 'alt': f'写真{index}に写るParaísoの苗。'},
        },
    }


def source(count=3):
    return {
        'initial': {'departments': {
            'coffee': {'snapshots': [image(i+1) for i in range(count)]},
            'cafe': {'snapshots': [image(99)], 'private': 'NEVER_EXPORT_OTHER_AREA'},
        }},
        'copy': {language: {'snapshots': {'capturedOn': label}} for language, label in
                 [('en', 'Photo reported'), ('zh', '照片日期'), ('ja', '写真の日付')]},
        'draft': {'departments': {'coffee': {'snapshots': [image(88)]}}},
    }


class CoffeeGalleryTests(unittest.TestCase):
    def test_three_languages_render_only_their_public_captions_alt_dates_and_fixed_image_urls(self):
        for language in HEADINGS:
            with self.subTest(language=language):
                programme = source()
                original = copy.deepcopy(programme)
                html = render_gallery(language, programme)
                document = Document(html)
                images = [attrs for tag, attrs in document.tags if tag == 'img']
                self.assertEqual(len(images), 3)
                self.assertEqual(len([1 for tag, _ in document.tags if tag == 'section']), 1)
                self.assertIn(HEADINGS[language], ''.join(document.text))
                for index, attrs in enumerate(images):
                    item = programme['initial']['departments']['coffee']['snapshots'][index]
                    self.assertEqual(attrs['src'], PUBLIC_IMAGES + item['imageId'])
                    self.assertEqual(attrs['alt'], item['translations'][language]['alt'])
                    self.assertEqual((attrs['width'], attrs['height']), ('1200', '1600'))
                    self.assertEqual((attrs['loading'], attrs['decoding']), ('lazy', 'async'))
                    self.assertEqual(attrs['referrerpolicy'], 'no-referrer')
                    self.assertIn(item['translations'][language]['caption'], html)
                times = [attrs for tag, attrs in document.tags if tag == 'time']
                self.assertEqual([t['datetime'] for t in times], ['2026-11-01']*3)
                self.assertIn(programme['copy'][language]['snapshots']['capturedOn'], html)
                self.assertNotIn('NEVER_EXPORT_OTHER_AREA', html)
                self.assertNotIn(image(99)['imageId'], html)
                self.assertNotIn(image(88)['imageId'], html)
                self.assertFalse(any(tag in ('script', 'canvas', 'iframe') for tag, _ in document.tags))
                self.assertEqual(programme, original)

    def test_empty_or_omitted_public_images_produce_no_section(self):
        for language in HEADINGS:
            self.assertEqual(render_gallery(language, source(0)), '')
            programme = source()
            del programme['initial']['departments']['coffee']['snapshots']
            self.assertEqual(render_gallery(language, programme), '')

    def test_quotes_and_ampersands_are_escaped_and_decoded_correctly(self):
        programme = source(1)
        text = 'A "pilot" & its leaves.'
        programme['initial']['departments']['coffee']['snapshots'][0]['translations']['en'] = {'caption': text, 'alt': text}
        html = render_gallery('en', programme)
        self.assertIn('&quot;pilot&quot; &amp;', html)
        self.assertEqual(next(attrs['alt'] for tag, attrs in Document(html).tags if tag == 'img'), text)

    def test_optional_photo_date_and_caption_never_get_fabricated(self):
        programme = source(1)
        item = programme['initial']['departments']['coffee']['snapshots'][0]
        item['capturedOn'] = ''
        item['translations']['en']['caption'] = ''
        html = render_gallery('en', programme)
        self.assertNotIn('<time', html)
        self.assertNotIn('<figcaption', html)
        item.update(kind='concept', capturedOn='2026-11-01')
        self.assertNotIn('<time', render_gallery('en', programme))

    def test_order_is_source_order_and_four_images_are_supported(self):
        programme = source(4)
        programme['initial']['departments']['coffee']['snapshots'].reverse()
        html = render_gallery('en', programme)
        self.assertEqual([a['data-coffee-image'] for t, a in Document(html).tags if t == 'figure'],
                         [i['imageId'] for i in programme['initial']['departments']['coffee']['snapshots']])

    def test_unsafe_or_incomplete_source_metadata_fails_closed_in_every_language(self):
        mutations = [
            lambda p: p['initial']['departments']['coffee'].update(snapshots='not a list'),
            lambda p: p['initial']['departments']['coffee']['snapshots'].append(image(5)),
            lambda p: p['initial']['departments']['coffee']['snapshots'][0].update(imageId='../../private'),
            lambda p: p['initial']['departments']['coffee']['snapshots'][0].update(imageId='https://evil.example/photo'),
            lambda p: p['initial']['departments']['coffee']['snapshots'][0].update(imageUrl='https://evil.example/photo'),
            lambda p: p['initial']['departments']['coffee']['snapshots'][0].update(capturedOn='2026-02-30'),
            lambda p: p['initial']['departments']['coffee']['snapshots'][0].update(capturedOn='2026-W44-7'),
            lambda p: p['initial']['departments']['coffee']['snapshots'][0].update(kind='verified'),
            lambda p: p['initial']['departments']['coffee']['snapshots'][0]['translations']['ja'].update(alt=''),
            lambda p: p['initial']['departments']['coffee']['snapshots'][0]['translations']['zh'].update(caption='x'*121),
            lambda p: p['initial']['departments']['coffee']['snapshots'][0]['translations']['en'].update(alt='<script>alert(1)</script>'),
            lambda p: p['initial']['departments']['coffee']['snapshots'][0]['translations'].update(private={'caption': 'private', 'alt': 'private'}),
        ]
        for language in HEADINGS:
            for mutate in mutations:
                with self.subTest(language=language, mutation=mutate):
                    programme = source(4)
                    mutate(programme)
                    with self.assertRaises((ValueError, TypeError, KeyError)):
                        render_gallery(language, programme)

    def test_duplicate_ids_and_missing_locale_or_copy_fields_are_rejected(self):
        programme = source(2)
        programme['initial']['departments']['coffee']['snapshots'][1]['imageId'] = image(1)['imageId']
        with self.assertRaises(ValueError):
            render_gallery('en', programme)
        programme = source(1)
        del programme['initial']['departments']['coffee']['snapshots'][0]['translations']['ja']
        with self.assertRaises(ValueError):
            render_gallery('en', programme)
        with self.assertRaises(ValueError):
            render_gallery('fr', source())
        programme = source(1)
        programme['copy']['en']['snapshots']['capturedOn'] = ''
        with self.assertRaises(ValueError):
            render_gallery('en', programme)


if __name__ == '__main__':
    unittest.main()
