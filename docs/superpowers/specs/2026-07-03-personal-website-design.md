# Osobní web — design spec

**Datum:** 2026-07-03
**Stav:** schváleno v brainstormingu

## Shrnutí

Osobní web senior designera Pavla Trnky. Pozicování: **„Senior designer (brand + produkt), který s AI dodává od značky po funkční prototyp."** Web neprodává kvantitu portfolia (k dispozici 1–2 case studies), ale způsob přemýšlení a proces — AI-augmented workflow je hlavní diferenciátor.

## Cíle a publikum

- **Primární cíl:** získávání klientů (kombinace obchodu a osobního brandu). Návštěvník má pochopit, jak Pavel pracuje, a ozvat se s projektem.
- **Cílovka:** agentury a studia (subdodávky/spolupráce), český trh i zahraničí.
- **Jazyk webu:** pouze angličtina.
- **Tón:** věcný, sebevědomý základ (služby, case studies) + osobní vrstva (Writing, About). Žádné buzzwordy, žádné „passionate designer" klišé.

## Vizuální směr

**Editorial / Swiss** (vybráno ze 3 variant):

- Teplý papírový podklad (`#f4f1ec`), inkoustově tmavý text, případný decentní akcent.
- Velká serifová typografie pro titulky (licenčně volný font, vybere se při implementaci), grotesk pro UI texty a popisky.
- Přísná mřížka, číslované sekce (①②③), horizontální linky jako dělítka.
- Volitelně špetka technických detailů (monospace popisky) podtrhující AI/build stránku.
- Vlastní CSS, žádný výchozí vzhled frameworku — unikátnost je požadavek.
- Rychlost je součást dojmu: žádný frontend JS framework, minimalizovat assets.

## Struktura webu (IA)

```
/            Home
/work/[slug] Detail case study (samostatný výpis /work zatím není — s 1–2 projekty stačí sekce na Home)
/how-i-work  Stránka procesu — hlavní prodejní argument
/writing     Blog (detail: /writing/[slug])
/about       Osobní stránka + kontakt
```

### Home (6 sekcí)

1. **Hero** — ostré pozicování jednou větou („I design brands and products. AI makes me 10× faster at it." — finální copy se doladí), podtitulek pro agentury/týmy, CTA „See how I work".
2. **Proces ve zkratce** — 3 kroky: Understand → Design → Build, každý s AI rolí, link na /how-i-work.
3. **Vybraná práce** — 1–2 case studies velkoryse (žádná mřížka dlaždic).
4. **Writing** — poslední 3 články.
5. **Služby** — Brand identity & strategy · Product design (UI/UX) · AI-assisted prototyping & build · AI workflow consulting for teams.
6. **Kontakt/CTA** — osobní výzva, e-mail, sítě (LinkedIn, X, …).

### How I Work

Srdce webu, sdílatelný link místo CV.

- Úvod: názorový odstavec — proč AI + senior judgment poráží obojí zvlášť.
- 3 fáze (01 Understand, 02 Design, 03 Build), u každé: co dělá, jak konkrétně pomáhá AI, jaké nástroje, mini-ukázka reálného výstupu.
- Závěrečný blok „Pro týmy" — učím tento workflow → vede na kontakt/konzultace.

### Case study šablona

Pevná struktura, proces > výsledek:

- Meta řádek (typ, rok, délka projektu), titulek formulovaný jako výsledek (ne jméno klienta — funguje i pro NDA).
- Hero vizuál.
- Fakta: Role / Scope / Výsledek (číslo či dopad).
- Sekce: **Kontext & problém** → **Přístup** (klíčová rozhodnutí a proč) → **AI v procesu** (co konkrétně urychlila, s ukázkou) → **Výsledek** (čísla, citace klienta).
- Patička: další projekt + CTA „Chci něco podobného".

### Writing

- Chronologický seznam, bez kategorií (dokud není 10+ článků).
- Detail článku: čistá editorial typografie, důraz na čitelnost.
- RSS feed pro distribuci na sítě.

### About

- Jediné místo s výrazně osobním tónem: kdo jsem, cesta, fotka, hodnoty, kontakt.

## Technická architektura

- **Astro 5**, statický output. Obsah přes Content Collections (Markdown/MDX).
- **Keystatic** admin na `/keystatic`:
  - kolekce `work` (case studies), `writing` (články),
  - singletony: homepage texty, about, globální nastavení (kontakty, sítě).
  - Ukládá jako commity do repa — žádná databáze, žádné poplatky.
- **Hosting:** Vercel nebo Cloudflare Pages, deploy z GitHubu.
- **SEO/sdílení:** meta tagy, OG obrázky, sitemap, RSS.
- **Bez** cookie lišty a analytics třetích stran na start (Plausible případně později).

## Mimo rozsah (YAGNI)

- Dvojjazyčnost (web je EN-only).
- Kategorie/tagy článků, vyhledávání, newsletter.
- Dark mode (editorial papírový vzhled je záměrně jeden).
- Galerie/archiv menších projektů — přidá se, až bude obsah.

## Kritéria úspěchu

1. Build (`astro build`) projde bez chyb; všechny stránky vygenerované.
2. Obsah (case study, článek, homepage texty) je editovatelný přes Keystatic bez sahání do kódu.
3. Lighthouse 95+ (Performance, Accessibility, Best Practices, SEO) na Home a detailu článku.
4. Web vizuálně odpovídá směru Editorial/Swiss dle schválených wireframů (`.superpowers/brainstorm/`).

## Otevřené body (doladí se při implementaci)

- Výběr konkrétního serifového a groteskového fontu (licence zdarma, self-hosted).
- Finální anglické copy (hero, služby, proces).
- Doménové jméno a volba hostingu (Vercel vs Cloudflare).
- Podklady pro 1–2 case studies (dodá Pavel).
