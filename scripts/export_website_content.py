#!/usr/bin/env python3
"""Export only approved public website data; never import website executable code.

Run from the website build, or with --website pointing to the public site source.
Only four explicitly named public JSON files are read. No env, config secrets,
private documents, admin code, database files, or recursive copies are used.
The website source is read-only. All generated files go into --output.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import os
import re
import tempfile
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit


LANGUAGES = ("en", "zh", "ja")
LOCALE_PATHS = {"en": ("en-AU", ""), "zh": ("zh-Hant", "zh-hant/"), "ja": ("ja", "ja/")}
DEPARTMENTS = ("cafe", "coffee", "workshops", "local")
PUBLIC_FILES = ("content.json", "content-additions.json", "config.json", "programme-content.json")
ROOT = Path(__file__).resolve().parents[1]
MAGNOLIA_ALT = {
    "en": "Illustrative concept of a magnolia branch with a white flower and green leaves",
    "zh": "白色木蘭花與綠葉枝條的概念示意",
    "ja": "白い花と緑の葉をつけたマグノリアの枝のイメージ",
}


def read_public_json(root: Path, name: str):
    if name not in PUBLIC_FILES:
        raise ValueError("Only named public JSON sources may be read")
    path = root / name
    if path.is_symlink():
        raise ValueError(f"Refusing symlinked source: {name}")
    if path.stat().st_size > 2_000_000:
        raise ValueError(f"Source too large: {name}")
    return json.loads(path.read_text(encoding="utf-8"))


def text(value, *, maximum=12000):
    if not isinstance(value, str):
        raise ValueError("Expected plain text")
    if len(value) > maximum or re.search(r"[<>\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", value):
        raise ValueError("Only bounded plain text is exported")
    return value


def https(value):
    value = text(value, maximum=2048)
    parsed = urlsplit(value)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("Public URL must be HTTPS without credentials")
    if parsed.query or parsed.fragment:
        raise ValueError("Public URL must not contain a token/query/fragment")
    return value.rstrip("/")


def email(value, expected):
    value = text(value, maximum=254)
    if value != expected:
        raise ValueError("Review a changed public contact address")
    return "mailto:" + value


def paragraph(value):
    return {"title": text(value["title"]), "body": text(value["body"])}


def entries(value, maximum):
    if not isinstance(value, list) or len(value) > maximum:
        raise ValueError("Public collection exceeds the version 1 contract")
    return value


def iso_date(value, *, allow_empty=False):
    if allow_empty and value == "":
        return value
    if not isinstance(value, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        raise ValueError("Expected a calendar date in YYYY-MM-DD format")
    date.fromisoformat(value)
    return value


def public_programme(value):
    """Project a strict public baseline, dropping all unrecognised fields."""
    if value["version"] != 1 or set(value["departments"]) != set(DEPARTMENTS):
        raise ValueError("Unsupported programme schema")
    iso_date(value["updatedAt"])
    departments = {}
    for department in DEPARTMENTS:
        item = value["departments"][department]
        if item["status"] not in ("planning", "developing", "trialling", "ready"):
            raise ValueError("Unsupported programme status")
        translations = {}
        for language in LANGUAGES:
            entry = item["translations"][language]
            if not isinstance(entry["done"], list) or len(entry["done"]) > 4:
                raise ValueError("Invalid programme checklist")
            translations[language] = {
                "now": text(entry["now"], maximum=280),
                "next": text(entry["next"], maximum=280),
                "done": [text(line, maximum=120) for line in entry["done"]],
            }
        departments[department] = {"status": item["status"], "translations": translations}
    coffee = value["coffee"]
    if coffee["seedVarieties"] != ["IPR107", "NR25", "Marsellesa"] or coffee["trialName"] != "Paraíso":
        raise ValueError("Review changed coffee trial identity")
    stages = ("seed", "germinating", "seedling", "grafting", "growing", "flowering", "cherries", "harvest")
    if coffee["seedStage"] not in stages or coffee["trialStage"] not in stages:
        raise ValueError("Unsupported coffee stage")
    height = coffee["heightCm"]
    if type(height) not in (int, float) or not 0 <= height <= 300:
        raise ValueError("Invalid coffee observation height")
    iso_date(coffee["observedOn"], allow_empty=True)
    return {
        "version": 1, "updatedAt": value["updatedAt"], "departments": departments,
        "coffee": {key: copy.deepcopy(coffee[key]) for key in ("seedVarieties", "seedStage", "trialName", "trialStage", "heightCm", "observedOn")},
        "publishedAt": None,
    }


def write_json(output: Path, name: str, value):
    """Replace atomically without following an existing file alias."""
    target = output / name
    if target.is_symlink():
        raise ValueError("Refusing symlinked output")
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output, prefix=".content-", delete=False) as handle:
            temporary = Path(handle.name)
            handle.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
        temporary.chmod(0o644)
        os.replace(temporary, target)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def export(website: Path, output: Path, *, include_programme_snapshot=False):
    if output.resolve() == website.resolve():
        raise ValueError("Output cannot overwrite website source JSON")
    sources = {name: read_public_json(website, name) for name in PUBLIC_FILES}
    content = sources["content.json"]
    additions = sources["content-additions.json"]
    config = sources["config.json"]
    programme = sources["programme-content.json"]
    origin = https(config["canonicalOrigin"])
    api_origin = https(config["programmeApiOrigin"])
    # Restrict external links and media to the existing official production hosts.
    if origin != "https://theglenolia.com.au":
        raise ValueError("Review an official-domain change before exporting")
    if api_origin != "https://glenolia-newsletter.theglenolia.workers.dev":
        raise ValueError("Review a public API host change before exporting")
    if config["instagramUrl"] != "https://www.instagram.com/theglenolia/":
        raise ValueError("Review a changed public Instagram account")
    iso_date(config["updated"])
    hero_image = config.get("mobileHeroImage", "magnolia.webp")
    if hero_image != "magnolia.webp":
        raise ValueError("A hero change must also update the website's approved hero")

    languages = {}
    for language in LANGUAGES:
        c = {**content[language], **additions[language]}
        prefix = c["prefix"]
        if (c["lang"], prefix) != LOCALE_PATHS[language]:
            raise ValueError("Unexpected locale/prefix mapping")
        base = origin + "/" + prefix
        directions = []
        if len(c["directions"]) != len(DEPARTMENTS):
            raise ValueError("New department requires a reviewed content mapping")
        for department, value in zip(DEPARTMENTS, c["directions"]):
            if value["title"] != programme["copy"][language]["departments"][department]["title"]:
                raise ValueError("Review a changed department ordering or title")
            image = value["image"]
            if not re.fullmatch(r"[a-z0-9-]+\.webp", image):
                raise ValueError("Unexpected public image path")
            directions.append({
                "id": department,
                "title": text(value["title"]),
                "summary": text(value["short"]),
                "body": text(value["body"]),
                "imageURL": origin + "/assets/images/" + image,
                "imageAlt": text(value["alt"]),
            })
        languages[language] = {
            "locale": text(c["lang"]),
            "name": text(c["name"]),
            "tagline": text(c["tagline"]),
            "heroTitle": " ".join(text(line) for line in c["hero"]),
            "heroText": text(c["heroText"]),
            "heroImageAlt": text(c.get("heroImageAlt", c.get("heroAlt", MAGNOLIA_ALT[language]))),
            "status": text(c["status"]),
            "openingTarget": text(c["target"]),
            "openingNote": text(c["dateNote"]),
            "location": text(c["location"]),
            "founder": {
                "title": text(c["visionTitle"]),
                "intro": text(c["visionIntro"]),
                "body": text(text(c["storyIntro"]) + "\n\n" + text(c["foundationIntro"])),
                "values": [paragraph(value) for value in entries(c["values"], 12)],
            },
            "directions": directions,
            "coffee": {
                "title": text(c["coffeeTitle"]),
                "intro": text(c["coffeeIntro"]),
                "sections": [paragraph(value) for value in entries(c["coffeeSections"], 30)],
            },
            "faqs": [{"question": text(value["q"]), "answer": text(value["a"])} for value in entries(c["faqs"], 50)],
            "newsletter": {
                "title": text(c["signupTitle"]),
                "intro": text(c["signupIntro"]),
                "note": text(c["signupNote"]),
                "url": base + "register/",
                "privacyURL": base + "privacy/",
            },
            "links": {
                "home": base,
                "privacy": base + "privacy/",
                "contact": email(config["contactEmail"], "info@theglenolia.com.au"),
                "partner": email(config["partnerEmail"], "partner@theglenolia.com.au"),
                "instagram": https(config["instagramUrl"]) + "/",
            },
            "imageDisclosure": text(c["conceptNote"]),
        }

    feed = {
        "schemaVersion": 1,
        "updatedAt": config["updated"],
        "canonicalOrigin": origin,
        "programmeEndpoint": api_origin + "/public/programme",
        "instagramFeedURL": origin + "/instagram.json",
        "locales": list(LANGUAGES),
        "languages": languages,
        "assets": {
            "logoEnURL": origin + "/assets/logos/logo-en-web.svg",
            "logoZhURL": origin + "/assets/logos/logo-zh-web.svg",
            "compactLogoURL": origin + "/assets/logos/logo-compact-web.svg",
            "leafURL": origin + "/assets/logos/leaf.svg",
            "heroImageURL": origin + "/assets/images/" + hero_image,
            "heroImageSmallURL": origin + "/assets/images/" + hero_image,
            "aerialImageURL": origin + "/assets/images/aerial-1600.webp",
            "aerialImageSmallURL": origin + "/assets/images/aerial-800.webp",
        },
    }
    # Hash only the exported editorial projection, before adding its own hash.
    # Live staff notes have their own endpoint and must not version this file.
    digest = hashlib.sha256(json.dumps(feed, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    feed["contentVersion"] = digest
    seed = public_programme(programme["initial"]) if include_programme_snapshot else None
    output.mkdir(parents=True, exist_ok=True)
    write_json(output, "content.json", feed)
    if include_programme_snapshot:
        # An explicitly requested offline baseline; never published as live notes.
        write_json(output, "programme.snapshot.json", seed)
    print(f"Exported 3 languages, 4 departments to {output}")
    print(f"Public source updated {feed['updatedAt']}; contentVersion {digest}")
    return feed


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--website", type=Path, required=True, help="Public website source directory")
    parser.add_argument("--output", type=Path, default=ROOT / "dist" / "api" / "v1", help="Output directory (default: website dist/api/v1)")
    parser.add_argument("--include-programme-snapshot", action="store_true", help="Also export a labelled offline baseline; not needed by website builds")
    args = parser.parse_args()
    export(args.website.resolve(strict=True), args.output.resolve(), include_programme_snapshot=args.include_programme_snapshot)
