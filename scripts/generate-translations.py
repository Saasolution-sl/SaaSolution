"""Generate the checked-in website translation catalogue from rendered English copy.

This is a maintainer utility, not a runtime dependency. It uses locally installed
Argos Translate models so visitors never send page content to a translation API.
"""

from __future__ import annotations

import html.parser
import json
import re
import urllib.request
from pathlib import Path

from argostranslate import translate


ROUTES = ("/", "/drive", "/drive/privacy", "/drive/terms")
LOCALES = ("es", "nl", "ar", "pt", "fr", "de")
OUTPUT = Path(__file__).parents[1] / "app" / "i18n" / "translations.json"
MANUAL_OVERRIDES = Path(__file__).parents[1] / "app" / "i18n" / "manual-overrides.json"
SKIP_ELEMENTS = {"script", "style", "noscript"}
PROTECTED = (
    "SaaSolution Drive",
    "Drive",
    "SaaSolutions SL",
    "SaaSolutions",
    "hospitalityOS",
    "HospitalityOps",
    "HospitalityTV",
    "Delicious Fitness",
    "Huawei AppGallery",
    "Google Play",
    "Apple App Store",
    "AppGallery",
    "Mithaq",
    "Viyra",
    "Asunción",
    "Ceuta",
    "Cebu City",
    "Olivia",
    "Signal",
    "macOS",
    "Windows",
    "Linux",
)
UNCHANGED = {
    "SaaSolutions", "SL", "SaaSolution Drive", "hospitalityOS", "HospitalityOps",
    "HospitalityTV", "Mithaq", "Viyra", "Delicious Fitness", "Google Play",
    "Apple App Store", "Huawei AppGallery", "AppGallery", "macOS", "Windows",
    "Linux",
    "Asunción", "Ceuta", "Cebu City", "Olivia", "Signal", "S3", "YOU", "DRIVE",
    "OS", "API", "GB", "EN", "ES", "NL", "AR", "PT", "FR", "DE",
}
OVERRIDES = {
    "es": {
        "Home": "Inicio", "Back to SaaSolutions home": "Volver al inicio de SaaSolutions",
        "Back to Drive": "Volver a Drive", "Explore Drive": "Explorar Drive",
        "SaaSolution Drive home": "Inicio de SaaSolution Drive", "Coming to Huawei AppGallery": "Próximamente en Huawei AppGallery",
        "Coming to Google Play": "Próximamente en Google Play", "Coming to the Apple App Store": "Próximamente en Apple App Store",
        "Mobile releases in preparation": "Lanzamientos móviles en preparación",
        "Native Linux desktop roadmap": "Hoja de ruta para la aplicación de escritorio nativa de Linux",
        "Linux is also on the desktop roadmap.": "Linux también forma parte de la hoja de ruta para escritorio.",
    },
    "nl": {
        "Home": "Home", "Back to SaaSolutions home": "Terug naar de SaaSolutions-homepagina",
        "Back to Drive": "Terug naar Drive", "Explore Drive": "Ontdek Drive",
        "SaaSolution Drive home": "SaaSolution Drive-startpagina", "Coming to Huawei AppGallery": "Binnenkort in Huawei AppGallery",
        "Coming to Google Play": "Binnenkort op Google Play", "Coming to the Apple App Store": "Binnenkort in de Apple App Store",
        "Native Linux desktop roadmap": "Routekaart voor de native Linux-desktopapp",
        "Linux is also on the desktop roadmap.": "Linux staat ook op de roadmap voor desktop.",
    },
    "ar": {
        "Home": "الرئيسية", "Back to SaaSolutions home": "العودة إلى الصفحة الرئيسية لـ SaaSolutions",
        "A private cloud-drive experience for files, photos and messaging backups—designed by SaaSolutions in Spain for the devices you use every day.": "تجربة تخزين سحابي خاصة للملفات والصور والنسخ الاحتياطية للمراسلات—صممتها SaaSolutions في إسبانيا للأجهزة التي تستخدمها كل يوم.",
        "A provider-neutral foundation designed to keep storage and the app experience independent.": "أساس محايد لمزوّدي التخزين، مصمم لإبقاء التخزين وتجربة التطبيق مستقلين عن بعضهما.",
        "YOU": "أنت", "DRIVE": "درايف",
        "Back to Drive": "العودة إلى Drive", "Explore Drive": "استكشف Drive",
        "SaaSolution Drive home": "الصفحة الرئيسية لـ SaaSolution Drive", "Coming to Huawei AppGallery": "قريبًا على Huawei AppGallery",
        "Coming to Google Play": "قريبًا على Google Play", "Coming to the Apple App Store": "قريبًا على Apple App Store",
        "Native Linux desktop roadmap": "خريطة طريق تطبيق Linux الأصلي لسطح المكتب",
        "Linux is also on the desktop roadmap.": "Linux مدرج أيضًا في خريطة طريق سطح المكتب.",
    },
    "pt": {
        "Home": "Início", "Back to SaaSolutions home": "Voltar ao início da SaaSolutions",
        "Back to Drive": "Voltar ao Drive", "Explore Drive": "Explorar o Drive",
        "SaaSolution Drive home": "Início do SaaSolution Drive", "Coming to Huawei AppGallery": "Em breve na Huawei AppGallery",
        "Coming to Google Play": "Em breve no Google Play", "Coming to the Apple App Store": "Em breve na Apple App Store",
        "Native Linux desktop roadmap": "Roteiro da aplicação nativa para Linux",
        "Linux is also on the desktop roadmap.": "O Linux também faz parte do roteiro para computadores.",
    },
    "fr": {
        "Home": "Accueil", "Back to SaaSolutions home": "Retour à l’accueil de SaaSolutions",
        "Back to Drive": "Retour à Drive", "Explore Drive": "Découvrir Drive",
        "SaaSolution Drive home": "Accueil de SaaSolution Drive", "Coming to Huawei AppGallery": "Bientôt sur Huawei AppGallery",
        "Coming to Google Play": "Bientôt sur Google Play", "Coming to the Apple App Store": "Bientôt sur l’Apple App Store",
        "Native Linux desktop roadmap": "Feuille de route de l’application Linux native",
        "Linux is also on the desktop roadmap.": "Linux figure également sur la feuille de route des versions de bureau.",
    },
    "de": {
        "Home": "Startseite", "Back to SaaSolutions home": "Zurück zur SaaSolutions-Startseite",
        "Back to Drive": "Zurück zu Drive", "Explore Drive": "Drive entdecken",
        "SaaSolution Drive home": "SaaSolution Drive-Startseite", "Coming to Huawei AppGallery": "Demnächst in der Huawei AppGallery",
        "Coming to Google Play": "Demnächst bei Google Play", "Coming to the Apple App Store": "Demnächst im Apple App Store",
        "Terms & Conditions": "Allgemeine Geschäftsbedingungen",
        "Native Linux desktop roadmap": "Roadmap für die native Linux-Desktop-App",
        "Linux is also on the desktop roadmap.": "Linux steht ebenfalls auf der Desktop-Roadmap.",
    },
}


class CopyCollector(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.values: list[str] = []

    def add(self, value: str | None) -> None:
        if not value:
            return
        text = value.strip()
        if text and text not in self.values:
            self.values.append(text)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in SKIP_ELEMENTS:
            self.skip_depth += 1
        if not self.skip_depth:
            attributes = dict(attrs)
            self.add(attributes.get("aria-label"))
            self.add(attributes.get("title"))

    def handle_endtag(self, tag: str) -> None:
        if tag in SKIP_ELEMENTS and self.skip_depth:
            self.skip_depth -= 1

    def handle_data(self, data: str) -> None:
        if not self.skip_depth:
            self.add(data)


def collect_copy() -> list[str]:
    collector = CopyCollector()
    for route in ROUTES:
        with urllib.request.urlopen(f"http://localhost:4173{route}", timeout=30) as response:
            collector.feed(response.read().decode("utf-8"))
    return [value for value in collector.values if should_translate(value)]


def should_translate(value: str) -> bool:
    if value in UNCHANGED or "@" in value:
        return False
    if not re.search(r"[A-Za-z]", value):
        return False
    if re.fullmatch(r"[A-Z0-9+·.−:/\s]+", value):
        return False
    return True


def translate_preserving_names(text: str, locale: str) -> str:
    pattern = "(" + "|".join(re.escape(term) for term in PROTECTED) + ")"
    pieces = re.split(pattern, text)
    translated: list[str] = []
    for piece in pieces:
        if not piece:
            continue
        if piece in PROTECTED or not re.search(r"[A-Za-z]", piece):
            translated.append(piece)
        else:
            whitespace = re.match(r"^(\s*)([\s\S]*?)(\s*)$", piece)
            prefix, content, suffix = whitespace.groups() if whitespace else ("", piece, "")
            translated.append(prefix + translate.translate(content, "en", locale) + suffix)
    return "".join(translated).strip()


def main() -> None:
    copy = collect_copy()
    print(f"Collected {len(copy)} unique translatable strings", flush=True)
    catalogue: dict[str, dict[str, str]] = {}
    for locale in LOCALES:
        print(f"Translating {locale}...", flush=True)
        catalogue[locale] = {}
        for index, source in enumerate(copy, start=1):
            catalogue[locale][source] = translate_preserving_names(source, locale)
            if index % 25 == 0:
                print(f"  {index}/{len(copy)}", flush=True)
        catalogue[locale].update(OVERRIDES.get(locale, {}))
    if MANUAL_OVERRIDES.exists():
        manual = json.loads(MANUAL_OVERRIDES.read_text(encoding="utf-8"))
        for locale in LOCALES:
            catalogue[locale].update(manual.get(locale, {}))
    OUTPUT.write_text(json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT}", flush=True)


if __name__ == "__main__":
    main()
