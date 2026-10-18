"""Contract and privacy regressions for the public native-app content export.

All mutations and builds use temporary fixtures; the website release dist is
never written by this suite. Run with python -m unittest discover -s scripts
-p test_mobile_content.py.
"""
from __future__ import annotations

import contextlib
import copy
import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
EXPORTER = ROOT / "scripts" / "export_website_content.py"
PUBLIC_FILES = ("content.json", "content-additions.json", "config.json", "programme-content.json")
LOCALES = {"en": ("en-AU", ""), "zh": ("zh-Hant", "zh-hant/"), "ja": ("ja", "ja/")}
DEPARTMENTS = ["cafe", "coffee", "workshops", "local"]
ORIGIN = "https://theglenolia.com.au"
PRIVATE_MARKER = "UNPUBLISHED_PRIVATE_SENTINEL_DO_NOT_EXPORT"
FOUNDER = {
    "en": "The Glenolia's vision reflects founder Dr Justin's care for people and belief in shared learning. We are shaping a welcoming place where coffee, the land and time together can bring people closer.",
    "zh": "The Glenolia 以創辦人 Dr Justin 對人的關懷與分享所知的心意為出發點。我們正用心籌備一處溫暖的空間，讓咖啡、土地與一起度過的時光，拉近人與人的距離。",
    "ja": "The Glenoliaの出発点は、創設者のDr Justinが大切にしてきた、人への思いやりと学びを分かち合う心です。コーヒー、この土地、そして一緒に過ごす時間を通じて、人と人がつながる温かな場所を準備しています。",
}


def load_exporter():
    spec = importlib.util.spec_from_file_location("glenolia_mobile_content_test_exporter", EXPORTER)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class MobileContentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.exporter = load_exporter()

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="glenolia-content-test-")
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.website = self.base / "website"
        self.website.mkdir()
        self.output = self.base / "export"
        self.originals = {name: json.loads((ROOT / name).read_text(encoding="utf-8")) for name in PUBLIC_FILES}
        self.sources = copy.deepcopy(self.originals)
        self.write_sources()

    def write_sources(self):
        for name, value in self.sources.items():
            (self.website / name).write_text(json.dumps(value, ensure_ascii=False), encoding="utf-8")

    def merged(self, language):
        return {**self.sources["content.json"][language], **self.sources["content-additions.json"][language]}

    def export(self, output=None, **options):
        with contextlib.redirect_stdout(io.StringIO()):
            return self.exporter.export(self.website, output or self.output, **options)

    def reject(self, mutate, **options):
        self.sources = copy.deepcopy(self.originals)
        mutate(self.sources)
        self.write_sources()
        with self.assertRaises(ValueError):
            self.export(**options)
        self.assertFalse(self.output.exists(), "Invalid input must not publish a partial feed")

    def test_import_is_side_effect_free(self):
        with patch.object(Path, "read_text", side_effect=AssertionError("import read source data")), \
                patch.object(Path, "write_text", side_effect=AssertionError("import wrote a file")), \
                patch.object(Path, "mkdir", side_effect=AssertionError("import created output")), \
                contextlib.redirect_stdout(io.StringIO()) as captured:
            module = load_exporter()
        self.assertTrue(callable(module.export))
        self.assertEqual(captured.getvalue(), "")

    def test_default_export_writes_only_one_public_feed(self):
        feed = self.export()
        self.assertEqual({p.name for p in self.output.iterdir()}, {"content.json"})
        self.assertEqual(json.loads((self.output / "content.json").read_text()), feed)
        self.assertEqual(feed["schemaVersion"], 1)
        self.assertRegex(feed["contentVersion"], r"^[a-f0-9]{64}$")
        self.assertLess((self.output / "content.json").stat().st_size, 1_048_576)
        self.assertNotIn(str(self.website), json.dumps(feed))

    def test_founder_wording_and_source_paragraphs_are_verbatim_in_all_languages(self):
        feed = self.export()
        for language in LOCALES:
            with self.subTest(language=language):
                c, result = self.merged(language), feed["languages"][language]
                self.assertEqual(c["visionIntro"], FOUNDER[language])
                self.assertEqual(result["founder"]["intro"], FOUNDER[language])
                self.assertEqual(result["founder"]["body"], c["storyIntro"] + "\n\n" + c["foundationIntro"])
                self.assertEqual(result["openingNote"], c["dateNote"])
                self.assertEqual(result["imageDisclosure"], c["conceptNote"])
                self.assertEqual([d["id"] for d in result["directions"]], DEPARTMENTS)
                for original, direction in zip(c["directions"], result["directions"]):
                    self.assertEqual(direction["body"], original["body"])
                    self.assertEqual(direction["imageAlt"], original["alt"])

    def test_locale_registration_privacy_and_home_routes_align(self):
        feed = self.export()
        self.assertEqual(feed["locales"], list(LOCALES))
        for language, (locale, prefix) in LOCALES.items():
            with self.subTest(language=language):
                item, base = feed["languages"][language], ORIGIN + "/" + prefix
                self.assertEqual(item["locale"], locale)
                self.assertEqual(item["links"]["home"], base)
                self.assertEqual(item["links"]["privacy"], base + "privacy/")
                self.assertEqual(item["newsletter"]["privacyURL"], base + "privacy/")
                self.assertEqual(item["newsletter"]["url"], base + "register/")
                self.assertEqual(item["links"]["contact"], "mailto:info@theglenolia.com.au")
                self.assertEqual(item["links"]["partner"], "mailto:partner@theglenolia.com.au")

    def test_output_has_explicit_nested_field_allowlists(self):
        feed = self.export()
        self.assertEqual(set(feed), {"schemaVersion", "contentVersion", "updatedAt", "canonicalOrigin", "programmeEndpoint", "instagramFeedURL", "locales", "languages", "assets"})
        self.assertEqual(set(feed["languages"]), set(LOCALES))
        self.assertEqual(set(feed["assets"]), {"logoEnURL", "logoZhURL", "compactLogoURL", "leafURL", "heroImageURL", "heroImageSmallURL", "aerialImageURL", "aerialImageSmallURL"})
        for item in feed["languages"].values():
            self.assertEqual(set(item), {"locale", "name", "tagline", "heroTitle", "heroText", "heroImageAlt", "status", "openingTarget", "openingNote", "location", "founder", "directions", "coffee", "faqs", "newsletter", "links", "imageDisclosure"})
            self.assertEqual(set(item["founder"]), {"title", "intro", "body", "values"})
            self.assertEqual(set(item["coffee"]), {"title", "intro", "sections"})
            self.assertEqual(set(item["newsletter"]), {"title", "intro", "note", "url", "privacyURL"})
            self.assertEqual(set(item["links"]), {"home", "privacy", "contact", "partner", "instagram"})
            for value in item["founder"]["values"] + item["coffee"]["sections"]:
                self.assertEqual(set(value), {"title", "body"})
            for direction in item["directions"]:
                self.assertEqual(set(direction), {"id", "title", "summary", "body", "imageURL", "imageAlt"})
            for faq in item["faqs"]:
                self.assertEqual(set(faq), {"question", "answer"})

    def test_only_four_named_public_sources_are_read(self):
        for name in (".env", "subscribers.csv", "private-research.json", "integrations/admin-state.json"):
            target = self.website / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(PRIVATE_MARKER)
        seen, read_text = [], Path.read_text

        def observe(file, *args, **kwargs):
            seen.append(file.resolve())
            return read_text(file, *args, **kwargs)

        with patch.object(Path, "read_text", observe):
            feed = self.export()
        self.assertEqual(tuple(self.exporter.PUBLIC_FILES), PUBLIC_FILES)
        self.assertCountEqual(seen, [(self.website / name).resolve() for name in PUBLIC_FILES])
        self.assertNotIn(PRIVATE_MARKER, json.dumps(feed))

    def test_source_reader_rejects_paths_outside_the_named_public_inputs(self):
        for name in (".env", "../private.json", "integrations/admin-state.json", "/private.json"):
            with self.subTest(name=name), self.assertRaises(ValueError):
                self.exporter.read_public_json(self.website, name)

    def test_unknown_private_fields_never_leak_or_change_version(self):
        before = self.export()
        baseline = (self.output / "content.json").read_bytes()
        self.sources["config.json"].update({"BREVO_API_KEY": PRIVATE_MARKER, "adminUrl": "https://private.invalid/"})
        for language in LOCALES:
            c, a = self.sources["content.json"][language], self.sources["content-additions.json"][language]
            c["subscriberList"] = [PRIVATE_MARKER]
            a["draft_json"] = {"owner": PRIVATE_MARKER}
            a["directions"] = copy.deepcopy(self.merged(language)["directions"])
            a["directions"][0]["supplierCost"] = PRIVATE_MARKER
        p = self.sources["programme-content.json"]
        p["ownerActor"] = PRIVATE_MARKER
        p["initial"]["auditHistory"] = [PRIVATE_MARKER]
        self.write_sources()
        after = self.export()
        self.assertEqual(after["contentVersion"], before["contentVersion"])
        self.assertEqual((self.output / "content.json").read_bytes(), baseline)
        self.assertNotIn(PRIVATE_MARKER, json.dumps(after))

    def test_repeat_exports_are_byte_for_byte_deterministic(self):
        first = self.export()
        first_bytes = (self.output / "content.json").read_bytes()
        second = self.export(self.base / "different-output")
        self.assertEqual(first, second)
        self.assertEqual(first_bytes, (self.base / "different-output/content.json").read_bytes())

    def test_public_additions_update_feed_and_version(self):
        before = self.export()
        changes = {"heroText": "A fresh public update with a natural tone.", "visionIntro": "A reviewed founder update."}
        self.sources["content-additions.json"]["en"].update(changes)
        self.write_sources()
        after = self.export()
        self.assertEqual(after["languages"]["en"]["heroText"], changes["heroText"])
        self.assertEqual(after["languages"]["en"]["founder"]["intro"], changes["visionIntro"])
        self.assertNotEqual(before["contentVersion"], after["contentVersion"])
        self.assertEqual(before["languages"]["zh"], after["languages"]["zh"])

    def test_hero_stays_aligned_with_the_existing_approved_magnolia_homepage(self):
        feed = self.export()
        self.assertEqual(feed["assets"]["heroImageURL"], ORIGIN + "/assets/images/magnolia.webp")
        self.assertEqual(feed["assets"]["heroImageSmallURL"], feed["assets"]["heroImageURL"])
        for language in LOCALES:
            self.assertTrue(feed["languages"][language]["heroImageAlt"].strip())
        self.output.joinpath("content.json").unlink()
        self.output.rmdir()

        def mutate(s):
            s["config.json"]["mobileHeroImage"] = "coffee.webp"
            for language in LOCALES:
                s["content-additions.json"][language]["heroImageAlt"] = "Reviewed image description · " + language

        self.reject(mutate)

    def test_public_department_image_edit_updates_feed_and_version(self):
        before = self.export()
        directions = copy.deepcopy(self.merged("en")["directions"])
        directions[0].update({"image": "shoot.webp", "alt": "A reviewed public image description."})
        self.sources["content-additions.json"]["en"]["directions"] = directions
        self.write_sources()
        after = self.export()
        self.assertEqual(after["languages"]["en"]["directions"][0]["imageURL"], ORIGIN + "/assets/images/shoot.webp")
        self.assertEqual(after["languages"]["en"]["directions"][0]["imageAlt"], directions[0]["alt"])
        self.assertNotEqual(before["contentVersion"], after["contentVersion"])

    def test_department_reordering_cannot_relabel_the_app_ids(self):
        for language in LOCALES:
            with self.subTest(language=language):
                def mutate(s):
                    current = {**s["content.json"][language], **s["content-additions.json"][language]}
                    directions = copy.deepcopy(current["directions"])
                    directions[0], directions[1] = directions[1], directions[0]
                    s["content-additions.json"][language]["directions"] = directions
                self.reject(mutate)

    def test_programme_changes_use_separate_endpoint_not_editorial_version(self):
        before = self.export()
        self.sources["programme-content.json"]["initial"]["departments"]["cafe"]["translations"]["en"]["now"] = "A new reviewed programme note."
        self.write_sources()
        self.assertEqual(self.export(), before)
        self.assertEqual(before["programmeEndpoint"], "https://glenolia-newsletter.theglenolia.workers.dev/public/programme")

    def test_optional_baseline_is_explicit_and_has_no_private_metadata(self):
        initial = self.sources["programme-content.json"]["initial"]
        initial["owner"] = PRIVATE_MARKER
        initial["coffee"]["supplierSecret"] = PRIVATE_MARKER
        initial["departments"]["cafe"]["translations"]["en"]["draft"] = PRIVATE_MARKER
        self.write_sources()
        self.export(include_programme_snapshot=True)
        self.assertEqual({p.name for p in self.output.iterdir()}, {"content.json", "programme.snapshot.json"})
        snapshot = json.loads((self.output / "programme.snapshot.json").read_text())
        self.assertEqual(set(snapshot), {"version", "updatedAt", "publishedAt", "departments", "coffee"})
        self.assertIsNone(snapshot["publishedAt"])
        self.assertNotIn(PRIVATE_MARKER, json.dumps(snapshot))
        self.assertEqual(set(snapshot["coffee"]), {"seedVarieties", "seedStage", "trialName", "trialStage", "heightCm", "observedOn"})

    def test_official_hosts_credentials_and_token_urls_are_enforced(self):
        cases = {
            "canonicalOrigin": ["http://theglenolia.com.au", "https://private.invalid", "https://user:password@theglenolia.com.au", ORIGIN + "?token=secret", ORIGIN + "#secret", ORIGIN + "/../private", ORIGIN + ":444"],
            "programmeApiOrigin": ["https://private.invalid", "https://user:password@glenolia-newsletter.theglenolia.workers.dev", "https://glenolia-newsletter.theglenolia.workers.dev?key=secret"],
            "instagramUrl": ["https://www.instagram.com/another-account/", "https://www.instagram.com/theglenolia/?token=secret", "https://user:password@www.instagram.com/theglenolia/"],
        }
        for field, values in cases.items():
            for value in values:
                with self.subTest(field=field, value=value):
                    self.reject(lambda s: s["config.json"].update({field: value}))

    def test_only_the_two_contract_public_email_addresses_are_exported(self):
        for field in ("contactEmail", "partnerEmail"):
            for value in ("owner@private.invalid", "info@theglenolia.com.au?subject=private", "info@theglenolia.com.au\r\nBcc:private", "mailto:info@theglenolia.com.au"):
                with self.subTest(field=field, value=value):
                    self.reject(lambda s: s["config.json"].update({field: value}))

    def test_prefix_and_locale_cannot_be_swapped_between_languages(self):
        for language in LOCALES:
            for field in ("prefix", "lang"):
                wrong = LOCALES["ja" if language != "ja" else "en"][0 if field == "lang" else 1]
                with self.subTest(language=language, field=field):
                    self.reject(lambda s: s["content-additions.json"][language].update({field: wrong}))

    def test_image_basenames_reject_traversal_external_urls_and_token_paths(self):
        values = ("../private.webp", "/private.webp", "%2e%2e-private.webp", "https://private.invalid/photo.webp", "photo.webp?key=secret", "photo.svg", "..\\private.webp")
        for value in values:
            with self.subTest(kind="hero", value=value):
                self.reject(lambda s: s["config.json"].update({"mobileHeroImage": value}))
            with self.subTest(kind="department", value=value):
                def mutate(s):
                    current = {**s["content.json"]["en"], **s["content-additions.json"]["en"]}
                    s["content-additions.json"]["en"]["directions"] = copy.deepcopy(current["directions"])
                    s["content-additions.json"]["en"]["directions"][0]["image"] = value
                self.reject(mutate)

    def test_invalid_calendar_and_noncanonical_dates_are_rejected(self):
        for value in ("2026-02-30", "2026-99-01", "20261017", "2026-W42-6"):
            with self.subTest(value=value):
                self.reject(lambda s: s["config.json"].update({"updated": value}))
        for value in (None, False, 0, "20261017", "2026-W42-6", "2026-02-30"):
            with self.subTest(observation=value):
                self.reject(lambda s: s["programme-content.json"]["initial"]["coffee"].update({"observedOn": value}), include_programme_snapshot=True)

    def test_untrusted_markup_control_characters_and_oversized_text_fail_closed(self):
        for value in ("<script>private()</script>", "text\x00hidden", "text\x7fhidden", "x" * 12001):
            with self.subTest(value=value[:30]):
                self.reject(lambda s: s["content-additions.json"]["ja"].update({"heroText": value}))

    def test_public_collections_respect_the_app_contract_bounds(self):
        for field, count in (("values", 13), ("coffeeSections", 31), ("faqs", 51)):
            with self.subTest(field=field):
                def mutate(s):
                    current = {**s["content.json"]["en"], **s["content-additions.json"]["en"]}
                    s["content-additions.json"]["en"][field] = [copy.deepcopy(current[field][0]) for _ in range(count)]
                self.reject(mutate)

    def test_failure_in_last_language_preserves_previous_atomic_feed(self):
        self.export()
        before = (self.output / "content.json").read_bytes()
        self.sources["content-additions.json"]["ja"]["heroText"] = "<script>invalid</script>"
        self.write_sources()
        with self.assertRaises(ValueError):
            self.export()
        self.assertEqual((self.output / "content.json").read_bytes(), before)

    def test_symlinked_source_is_rejected(self):
        target = self.base / "aliased-source.json"
        source = self.website / "content.json"
        source.rename(target)
        source.symlink_to(target)
        with self.assertRaises(ValueError):
            self.export()
        self.assertFalse(self.output.exists())

    def test_oversized_public_source_is_rejected_before_output(self):
        self.sources["content.json"]["privatePadding"] = "x" * 2_000_001
        self.write_sources()
        with self.assertRaises(ValueError):
            self.export()
        self.assertFalse(self.output.exists())

    def test_source_directory_cannot_be_used_as_output(self):
        before = (self.website / "content.json").read_bytes()
        with self.assertRaises(ValueError):
            self.export(self.website)
        self.assertEqual((self.website / "content.json").read_bytes(), before)

    def test_output_aliases_cannot_overwrite_an_unrelated_file(self):
        for kind in ("symlink", "hardlink"):
            with self.subTest(kind=kind):
                target = self.base / (kind + "-private.json")
                target.write_text(PRIVATE_MARKER)
                output = self.base / (kind + "-output")
                output.mkdir()
                destination = output / "content.json"
                if kind == "symlink":
                    destination.symlink_to(target)
                else:
                    os.link(target, destination)
                try:
                    self.export(output)
                except ValueError:
                    pass
                self.assertEqual(target.read_text(), PRIVATE_MARKER)
                if not destination.is_symlink() and destination.read_text() != PRIVATE_MARKER:
                    self.assertEqual(json.loads(destination.read_text())["schemaVersion"], 1)

    def test_build_hook_regenerates_feed_after_cleaning_dist_and_preserves_routes(self):
        scripts = self.website / "scripts"
        scripts.mkdir()
        for name in ("build.py", "progress_markup.py", "programme_markup.py", EXPORTER.name, "mobile-content-v1.schema.json"):
            shutil.copyfile(ROOT / "scripts" / name, scripts / name)
        shutil.copyfile(ROOT / "progress-content.json", self.website / "progress-content.json")
        public = self.website / "public"
        (public / "assets/progress").mkdir(parents=True)
        for name in ("progress.css", "programme.css"):
            shutil.copyfile(ROOT / "public/assets/progress" / name, public / "assets/progress" / name)
        (public / "style.css").write_text("body{color:#2F4A3C}")
        (self.website / "src/progress").mkdir(parents=True)
        (self.website / "src/progress/fixture.js").write_text("// Lightweight build fixture\n")
        dist = self.website / "dist"
        (dist / "api/v1").mkdir(parents=True)
        (dist / "stale-private-marker.txt").write_text(PRIVATE_MARKER)
        (dist / "api/v1/content.json").write_text('{"stale":true}')
        environment = dict(os.environ, SITE_BASE_PATH="")

        def build():
            result = subprocess.run([sys.executable, str(scripts / "build.py")], cwd=self.website, env=environment, text=True, capture_output=True, timeout=30)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertFalse((dist / "stale-private-marker.txt").exists())
            self.assertFalse((dist / "api/v1/programme.snapshot.json").exists())
            self.assertTrue((dist / "api/v1/content.schema.json").is_file())
            self.assertEqual(len(list(dist.rglob("*.html"))), 31)
            for _, prefix in LOCALES.values():
                for route in ("", "privacy/", "register/", "progress/", "progress/programmes/"):
                    self.assertTrue((dist / prefix / route / "index.html").is_file())
            return json.loads((dist / "api/v1/content.json").read_text())

        first = build()
        self.assertEqual(first["languages"]["en"]["founder"]["intro"], FOUNDER["en"])
        self.sources["content-additions.json"]["en"]["heroText"] = "A public edit made before the next site build."
        self.write_sources()
        second = build()
        self.assertEqual(second["languages"]["en"]["heroText"], "A public edit made before the next site build.")
        self.assertNotEqual(first["contentVersion"], second["contentVersion"])


if __name__ == "__main__":
    unittest.main()
