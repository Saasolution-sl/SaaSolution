"""Generate lib/consulting/translations.json for the Consulting & Auditing pages.

Maintainer utility (like generate-translations.py): uses locally installed Argos Translate
models, so no page content is sent to an external API. English and Spanish are authored
natively in lib/consulting/*.ts; this fills the other site languages (nl, ar, pt, fr, de),
keyed by the exact English string, reusing the site's protected-name handling.

Run from the repo root:  python scripts/generate-consulting-translations.py
"""

from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).parents[1]
spec = importlib.util.spec_from_file_location("gen", ROOT / "scripts" / "generate-translations.py")
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

SOURCES = [
    *sorted((ROOT / "lib" / "consulting").glob("*.ts")),
    ROOT / "lib" / "health-check" / "questions.ts",
    *sorted((ROOT / "components" / "consulting").glob("*.tsx")),
]
OUTPUT = ROOT / "lib" / "consulting" / "translations.json"
LOCALES = ("nl", "ar", "pt", "fr", "de")

# Extra protected terms for this section (kept verbatim in every language).
gen.PROTECTED = tuple(sorted(set(gen.PROTECTED) | {"PROCESA Ceuta", "Ley 9/2017", "AEPD", "GDPR", "SaaSolution", "AI", "IT"}, key=len, reverse=True))

STRING = r"""'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)\""""


def unescape(value: str) -> str:
    value = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), value)
    return value.replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\\\", "\\")


def strings_in(chunk: str) -> list[str]:
    return [unescape(a or b) for a, b in re.findall(STRING, chunk)]


def collect() -> list[str]:
    found: list[str] = []
    for path in SOURCES:
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(r"\ben:\s*(\[)", text):  # arrays: en: [ 'a', 'b' ]
            depth, i = 0, m.start(1)
            while i < len(text):
                if text[i] == "[":
                    depth += 1
                elif text[i] == "]":
                    depth -= 1
                    if depth == 0:
                        break
                elif text[i] in "'\"":  # skip over a string literal
                    q = text[i]
                    i += 1
                    while text[i] != q:
                        i += 2 if text[i] == "\\" else 1
                i += 1
            found += strings_in(text[m.start(1) : i])
        for m in re.finditer(r"\ben:\s*(?:'((?:\\.|[^'\\])*)'|\"((?:\\.|[^\"\\])*)\")", text):  # single strings
            found.append(unescape(m.group(1) or m.group(2) or ""))
    seen: dict[str, None] = {}
    for s in found:
        if s and s not in seen and gen.should_translate(s) and not re.search(r"\{\w+\}", s):
            seen[s] = None
    return list(seen)


# Templates with {placeholders} are translated by hand so the tokens survive.
TEMPLATES = {
    "Step {n} of {total}": {"nl": "Stap {n} van {total}", "ar": "الخطوة {n} من {total}", "pt": "Passo {n} de {total}", "fr": "Étape {n} sur {total}", "de": "Schritt {n} von {total}"},
    "{k} of {t} answered with a known value": {
        "nl": "{k} van {t} beantwoord met een bekende waarde", "ar": "تمت الإجابة على {k} من {t} بقيمة معروفة",
        "pt": "{k} de {t} respondidas com um valor conhecido", "fr": "{k} sur {t} avec une réponse connue", "de": "{k} von {t} mit bekanntem Wert beantwortet"},
    "{n} not sure": {"nl": "{n} onzeker", "ar": "{n} غير متأكد", "pt": "{n} não sei", "fr": "{n} incertaines", "de": "{n} unsicher"},
    "{n} skipped": {"nl": "{n} overgeslagen", "ar": "{n} تم تخطيها", "pt": "{n} ignoradas", "fr": "{n} ignorées", "de": "{n} übersprungen"},
}
MANUAL = {
    "Clear answer": {"nl": "Antwoord wissen", "ar": "مسح الإجابة", "pt": "Limpar resposta", "fr": "Effacer la réponse", "de": "Antwort löschen"},
}


def main() -> None:
    copy = collect()
    print(f"{len(copy)} strings", flush=True)
    catalogue: dict[str, dict[str, str]] = {}
    for locale in LOCALES:
        print(f"Translating {locale}...", flush=True)
        entries = {s: gen.translate_preserving_names(s, locale) for s in copy}
        for table in (TEMPLATES, MANUAL):
            for source, values in table.items():
                entries[source] = values[locale]
        catalogue[locale] = entries
    OUTPUT.write_text(json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT}", flush=True)


if __name__ == "__main__":
    main()
