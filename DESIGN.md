# Design

Systemet som faktiskt ligger i koden efter omgörningen 2026-09. Skrivet från
det byggda resultatet, inte från en plan. Ändras något här, ändras det i
`src/index.css` och `tailwind.config.ts` först.

## Idén: akten

Sajten är byggd som **en akt som har öppnats**. Två grunder i sidbredd, inte en
grund med accentfärger; strikta linjaler i stället för kort och rutnät; fält som
är märkta för att något faktiskt är registrerat (datum, längd, nummer). Den
vägrar kategorins standardsida: omslagsbild i ett rundat kort, en rad
"lyssna på"-piller och ett rutnät av avsnittskort.

Ordmärket är levande text. Den gamla sajten sträckte en 126 kB PNG-skärmdump av
krossat glas över hela toppen — den är borta.

## Grunder

Sidan växlar **en gång**, hårt, utan gradient:

| Roll | Token | Värde | Var |
|---|---|---|---|
| Rösten | `ink` | `#0B0B0D` | Hjälten, nyhetsbrevet, kanalerna, `/lankar`, spelaren |
| Akten | `paper` | `#EDE9E1` | Registret och Om podden |

Stödvärden (`tailwind.config.ts`):

- `ink-900 #050506` spelarlisten · `ink-700 #141417` fält · `ink-600 #222227`
  hårfin linjal på svart · `ink-500 #35353D` starkare avdelare
- `paper-100 #F7F5F1` hover · `paper-300 #DFDAD0` · `paper-400 #C6C0B4` linjal
  på papper · `paper-500 #A29B8D` dämpad text på svart (7,1:1) ·
  `paper-600 #6E685E` dämpad text på papper (4,6:1) · `paper-700 #4A463F`
  brödtext på papper (7,8:1)

Monokromt av beslut, inte av glömska. Betoning kommer från invertering, vikt och
yta. Den primära åtgärden är sidan inverterad — aldrig en färgad knapp.

## Typsnitt

Två familjer, **självhostade** via `@fontsource-variable` och buntade av Vite
(`src/main.tsx`). Ingen tredjeparts-stylesheet i kritiska vägen och ingen
besökar-IP till Googles font-CDN. `unicode-range` gör att en svensk besökare
bara hämtar latin-subsetet (~20 + ~24 kB).

- **Familjen Grotesk Variable** (400–700) — allt en människa läser. Display
  sätts stort och tight: `.display` = 700, `-0.045em`, radhöjd 0.88. Rubriker
  ärver `-0.03em` och radhöjd 0.94.
- **Martian Mono Variable** — bara det en maskin registrerade: datum, längd,
  avsnittsnummer, tidkoder. Klassen `.label` (versaler, `0.14em` spärr,
  9–10 px) är den enda tillåtna användningen i löpande gränssnitt.

Typskalan är fluid: hjälten `clamp(3.25rem, 16.5vw, 12.5rem)`, avsnittstitel
`clamp(1.75rem, 6vw, 3rem)`, pull quote `clamp(1.5rem, 4.6vw, 2.5rem)`.

## Form

- **Radie 0.** `borderRadius` lg/md/sm är alla `0px`. Runt hörn förekommer bara
  där formen är ett hjul: spela/pausa-cirklarna och omslagens ingenting.
- **Inga skuggor, inga glöd, inga kort.** Det som behöver avskiljas får en
  hårfin linjal som går hela mättet.
- **`.shell`** är sajtens enda mått: `max-w-[64rem]`, `px-5 sm:px-8`.
- **`.bar`** är den fullbredda åtgärdsraden (min 64/72 px). Fylld = inverterad
  sida (primär). Ruled = ram i `ink-500` (sekundär).
- **Fältgrid**: `sm:grid-cols-[5.5rem_1fr]` — etikett vänster, innehåll höger.
  Samma grammatik i registret, Om podden och nyhetsbrevet, så sidan läses som
  ett dokument.

## Rörelse

En författad rörelse, inte utspridda hover-effekter:

1. **Sprickan ritar sig själv** utåt från nedslagspunkten vid inladdning
   (`src/components/Fracture.tsx`, `stroke-dashoffset` över 1,5 s). Ritad
   geometri, ~3 kB, skarp i alla storlekar — femton radiella sprickor plus de
   ackord som binder ihop dem, med radiell uttoning så rutan läser som krossad
   på ett ställe i stället för jämnt rastrerad.
2. **`.stage`** låter hjälten monteras uppifrån och ner, en gång.
3. **Spelarlisten dockar** upp från nederkanten när uppspelning startar.

Inget nedanför vecket har inträdesanimation. Allt respekterar
`prefers-reduced-motion`.

## Komponenter

- `Hero` — ordmärket i levande typ, löftet på en rad, Spotify (fylld) och Apple
  Podcasts (ruled) sida vid sida på `sm+`. Att lyssna på plats är den tysta
  tredje dörren.
- `StickyFollow` — den enda beständiga kromen. Smal remsa som visas först när
  hjälten lämnat vyn (IntersectionObserver på `#hero-end`), med ordmärke och
  Följ-knapp. Utan den saknar en läsare långt ner på sidan väg till Spotify.
- `PlayerBar` + `player/PlayerProvider` — **ett** `<audio>` för hela sajten,
  ovanför routern, så uppspelning överlever navigering till `/lankar`.
  Framstegsraden *är* listens övre linjal; range-inputen ovanpå är genomskinlig
  men äkta, alltså dragbar, fokuserbar och uppläst. Media Session ger
  låsskärm och headsetknappar. Vid fel: paus + väg till Spotify, aldrig en knapp
  som inte gör något.
- `EpisodeRow` — ett avsnitt som **numrerad post**, inte kort i rutnät. Med ett
  publicerat avsnitt läser ett rutnät som en tom mall; ett register läser som
  påbörjat.
- `ChannelList` — kanalerna som linjerade rader, delade mellan startsidan och
  `/lankar`. `emphasizePrimary` ger Spotify den fyllda behandlingen.

## Regler som gäller framåt

1. Ingen ny färg. Behöver något sticka ut invertera det.
2. Ingen ny typsnittsfamilj. Behövs en till röst, ändra vikt eller storlek.
3. Mono används bara till registrerade värden — aldrig som dekorativ etikett.
4. Inga rundade kort. En linjal räcker.
5. Ett avsnitt ska se lika avsiktligt ut som trettio.
6. Ingen påhittad social bevisning: inga lyssnarsiffror, betyg eller citat som
   inte finns.
