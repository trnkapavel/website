# Hero textura + FAQ sekce — design

**Datum:** 2026-07-05
**Inspirace:** [collectiveos.vercel.app](https://collectiveos.vercel.app/) — jemná textura v hero pozadí, accordion FAQ sekce.
**Rozsah:** pouze hero textura a FAQ sekce. Testimonials nejsou součástí tohoto zadání.

## Kontext

Web `trnkapavel/website` je editorialní, čistě CSS (žádné utility frameworky), jednojazyčný (EN), s kapitolovou navigací (`SectionRail`: 01 Hello, 02 Process, 03 Work, 04 Writing, 05 Services). Hero sekce (`01 Hello`) má animovanou pen-line SVG kresbu na pozadí, plochu `--paper` (#f4f1ec) a serifové nadpisy.

Cíl: přidat (1) jemnou texturu do hero pozadí a (2) novou FAQ sekci `06` před footer, obojí v souladu se stávajícím edičním stylem — ne v bold SaaS stylu Collective OS.

## 1. Hero textura

**Přístup:** čistě CSS, žádný nový obrázkový asset. Na `.hero` (nebo jeho pozadí wrapperu) přidat vrstvený `background`:

- 2 vrstvy `repeating-linear-gradient` s velmi jemným úhlem (např. 100–110°) a nízkým kontrastem — barvy odvozené od `--paper` posunuté o pár jednotek světlosti (ne nová proměnná navíc, pokud stávající paleta stačí; jinak přidat `--paper-shade` do `global.css`).
- Textura sedí **pod** pen-line SVG kresbou (ta zůstává beze změny, jen dostane texturované pozadí místo plochého).
- `opacity` nízká (řádově 0.4–0.6), aby nekonkurovala textu ani kresbě.
- Respektuje `prefers-reduced-motion` — textura je statická (žádná animace), takže zde není co vypínat; pokud by se přidala jemná animace posunu, musí být za `@media (prefers-reduced-motion: no-preference)`.
- Mobil: textura zůstává, pouze se ověří čitelnost nadpisu (kontrast).

**Zásah do kódu:** `src/pages/index.astro` (styly `.hero`/hero wrapperu), případně `src/styles/global.css` pokud přibude CSS proměnná pro odstín.

## 2. FAQ sekce

**Umístění:** nová sekce `06 FAQ`, mezi `05 Services` a footerem. Přidat `{ id: 'faq', num: '06' }` do `src/components/SectionRail.astro`, aby fungoval scroll-spy.

**Markup:** nativní `<details>/<summary>` accordion — bez JS, funguje i s vypnutým JS, konzistentní s minimalistickým stackem. Vizuální styl navazuje na kapitolový systém webu: číslování `06.1`–`06.6` v serifové kurzívě (stejný vizuální jazyk jako `data-chapter` vodoznaky u ostatních sekcí), ne zaoblené karty ve stylu Collective OS.

**Obsah (EN, tón odpovídá stávajícímu About/Services textu — věcný, bez marketingového balastu):**

1. **How does a project typically start?** — krátká odpověď navazující na proces Research → Design → Build ze sekce 02.
2. **Do you design and build, or hand off Figma files?** — reflektuje důraz webu na "hand-coded CSS"/craft.
3. **Do you work with teams outside the Czech Republic?** — remote/timezone overlap.
4. **How do you use AI in your process?** — stručně, věcně, bez hype (podle tónu About sekce).
5. **What kind of projects do you specialize in?** — hospitality/subscription platforms.
6. **Are you available for new work?** — obecná odpověď bez konkrétních cen/dat (ty se mění častěji než kód).

Finální anglický text napíšu při implementaci a necháš si ho zkontrolovat/upravit — přesné formulace nejsou předmětem schválení tohoto spec dokumentu.

**Zásah do kódu:** nový soubor `src/components/Faq.astro` (nebo sekce přímo v `index.astro`, podle toho, co je konvencí u ostatních sekcí — ověřit při psaní plánu), + úprava `SectionRail.astro`.

## Testování / ověření

- Vizuální kontrola v prohlížeči (light mode – web nemá dark mode dle spec): hero textura nekonkuruje čitelnosti, FAQ accordion se otevírá/zavírá klávesnicí i myší.
- Scroll-spy v `SectionRail` správně zvýrazní `06` při scrollu na FAQ.
- Responsivní chování (mobil): textura i accordion čitelné a použitelné.

## Mimo rozsah

- Testimonials sekce.
- Jakékoli změny FTP deploy workflow (řešeno samostatně).
- Změna barevné palety mimo případný jeden nový odstín pro texturu.
