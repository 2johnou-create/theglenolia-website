"""The public teacher introduction must never become a restricted-pack export."""
import copy
from html.parser import HTMLParser
import unittest

import teachers_markup


class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


def resource(public=True):
    return {'id':'s4-u4','title':'Water & weather','stage':'S4',
            'summary':'A public summary with a careful classroom question.',
            'availability':'public' if public else 'teacher'}


class PublicTeachersTests(unittest.TestCase):
    def test_public_sample_does_not_export_unrecognised_full_pack_fields(self):
        source=resource()
        source.update(lessons=[{'model':'RESTRICTED_MODEL_SENTINEL'}],
                      studentSheets=[{'prompt':'RESTRICTED_WORKSHEET_SENTINEL'}],
                      privateNotes='PRIVATE_NOTE_SENTINEL',pdf='/private/full-pack.pdf')
        original=copy.deepcopy(source)
        html=teachers_markup.public_resource_page(source)
        self.assertIn(source['summary'],html)
        self.assertIn(teachers_markup.APP_URL+'/#resource/s4-u4',html)
        self.assertFalse(any(x in html for x in ['RESTRICTED_','PRIVATE_NOTE_','/private/']))
        self.assertEqual(source,original)

    def test_restricted_resource_cannot_become_a_public_sample(self):
        with self.assertRaises(ValueError):
            teachers_markup.public_resource_page(resource(False))

    def test_landing_only_displays_public_samples_and_escapes_metadata(self):
        public=resource(); public['title']='<script>bad()</script>'
        private=resource(False); private['title']='RESTRICTED_TITLE_SENTINEL'
        html=teachers_markup.landing([public,private])
        doc=Document(html)
        self.assertIn('&lt;script&gt;',html)
        self.assertNotIn('RESTRICTED_TITLE_SENTINEL',html)
        self.assertFalse(any(t in ['script','canvas','iframe','form','video'] for t,_ in doc.tags))
        self.assertEqual(sum(t=='h1' for t,_ in doc.tags),1)

    def test_invalid_sample_ids_cannot_escape_the_resource_route(self):
        for rid in ['../secret','x#signout','x?admin=1','x/../../file','x\" onmouseover=\"bad']:
            source=resource();source['id']=rid
            with self.subTest(rid=rid),self.assertRaises(ValueError):
                teachers_markup.public_resource_page(source)


if __name__=='__main__':
    unittest.main()
