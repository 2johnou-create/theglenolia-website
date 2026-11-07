import json
import unittest
from html.parser import HTMLParser

import programme_markup as markup


class Elements(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.nodes = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.nodes.append((tag, dict(attrs)))

    def marked(self, name):
        return [(tag, attrs) for tag, attrs in self.nodes if name in attrs]


class WeatherPlayMarkupTests(unittest.TestCase):
    def test_each_locale_offers_the_same_accessible_opt_in_tools_and_reset(self):
        for language in ('en', 'zh', 'ja'):
            with self.subTest(language=language):
                source = markup.world(markup.DATA['copy'][language])
                page = Elements(source)
                self.assertEqual(len(page.marked('data-weather-game')), 1)
                self.assertEqual(len(page.marked('data-weather-game-details')), 1)
                self.assertNotIn('open', page.marked('data-weather-game-details')[0][1])
                tools = page.marked('data-weather-tool')
                self.assertEqual([a['data-weather-tool'] for _, a in tools], ['bucket', 'cloud', 'wind', 'storm', 'blizzard'] * 2)
                for tag, attrs in tools:
                    self.assertEqual(tag, 'button')
                    self.assertEqual(attrs.get('type'), 'button')
                    self.assertEqual(attrs.get('aria-pressed'), 'false')
                    self.assertIn('disabled', attrs)
                self.assertEqual(len(page.marked('data-weather-game-reset')), 1)
                # Reset remains in the scene badge if the visitor folds the tools.
                quick = page.marked('data-weather-game-quick-reset')
                self.assertEqual(len(quick), 1)
                self.assertEqual(quick[0][1]['aria-label'], markup.GAME_DATA['copy'][language]['reset'])
                self.assertIn('hidden', page.marked('data-weather-game-mode')[0][1])
                quick_tools = page.marked('data-weather-game-quick-tools')
                self.assertEqual(len(quick_tools), 1)
                self.assertEqual(quick_tools[0][1]['role'], 'group')
                self.assertIn('hidden', quick_tools[0][1])
                quick_buttons = [a for _, a in tools if a.get('class') == 'weather-play-quick-tool']
                self.assertEqual(len(quick_buttons), 5)
                for attrs in quick_buttons:
                    self.assertEqual(attrs['aria-label'], markup.GAME_DATA['copy'][language]['tools'][attrs['data-weather-tool']])
                    self.assertEqual(attrs['title'], attrs['aria-label'])
                under = page.marked('data-weather-game-underground')[0][1]
                self.assertEqual(under['aria-pressed'], 'false')
                self.assertEqual(page.marked('data-weather-game-status')[0][1]['role'], 'status')

    def test_game_is_not_added_to_the_compact_home_world(self):
        for language in ('en', 'zh', 'ja'):
            page = Elements(markup.world(markup.DATA['copy'][language], compact=True))
            self.assertFalse(page.marked('data-weather-game'))
            self.assertFalse(page.marked('data-weather-game-mode'))
            self.assertFalse(page.marked('data-weather-tool'))

    def test_game_copy_is_separate_from_authoritative_public_progress(self):
        for language in ('en', 'zh', 'ja'):
            payload = markup.payload(language, 'https://public.example', '/progress/programmes/')
            data = json.loads(payload.split('>', 1)[1].rsplit('<', 1)[0])
            self.assertEqual(data['initial'], markup.DATA['initial'])
            self.assertEqual(data['copy'], markup.DATA['copy'][language])
            self.assertEqual(data['gameCopy'], markup.GAME_DATA['copy'][language])
            self.assertNotIn('gameCopy', data['initial'])

    def test_all_three_languages_have_complete_matching_controls_and_statuses(self):
        self.assertEqual(set(markup.GAME_DATA['copy']), {'en', 'zh', 'ja'})
        expected = set(markup.GAME_DATA['copy']['en'])
        for language, copy in markup.GAME_DATA['copy'].items():
            self.assertEqual(set(copy), expected)
            self.assertEqual(set(copy['states']), {'bucket', 'cloud', 'wind', 'storm', 'blizzard', 'flood', 'active'})
            self.assertTrue(all(isinstance(value, str) and value.strip() for value in copy['tools'].values()))
            self.assertTrue(copy['separation'].strip())
            if language != 'en':
                self.assertNotEqual(copy['reset'], markup.GAME_DATA['copy']['en']['reset'])

    def test_new_copy_cannot_close_the_inert_json_payload(self):
        copy = markup.GAME_DATA['copy']['en']
        original = copy['intro']
        try:
            copy['intro'] = '</script><script>unexpected()</script>'
            source = markup.payload('en', 'https://public.example', '/progress/programmes/')
            self.assertEqual(source.count('</script>'), 1)
            self.assertIn('\\u003c/script>', source)
            content = json.loads(source.split('>', 1)[1].rsplit('<', 1)[0])
            self.assertEqual(content['gameCopy']['intro'], copy['intro'])
        finally:
            copy['intro'] = original


if __name__ == '__main__':
    unittest.main()
