# Trasig men Hel - Podcast Website

This is the official website for the "Trasig men Hel" podcast.

## Development

To run the development server:

```bash
npm run dev
```

## Deployment

The website is deployed to GitHub Pages and accessible at [trasigmenhel.se](https://trasigmenhel.se).

To deploy a new version:

```bash
npm run deploy
```

## Technologies Used

- React
- Vite
- TypeScript
- Tailwind CSS
- Shadcn UI

## Sidor, sökbarhet och transkript

Sajten är en React-app, men den serveras inte som en. Varje sida skrivs till
disk som färdig HTML av `scripts/prerender-routes.mjs` efter bygget:

| URL | Vad den är |
| --- | --- |
| `/` | Startsidan med hela registret |
| `/avsnitt/<slug>` | Ett avsnitt: beskrivning, spelare och hela transkriptet |
| `/lankar` | Länksidan för Instagram- och TikTok-profilen |

Varför det spelar roll: GitHub Pages serverar filer, inte en applikation. Utan
prerenderingen finns bara `index.html`, och en sökmotor som inte kör
JavaScript ser en tom sida. Varje prerenderad sida får sin egen `<title>`,
beskrivning, canonical-URL, Open Graph-taggar och schema.org-data
(`PodcastSeries` på startsidan, `PodcastEpisode` på avsnittssidorna). Datan
som sidan renderades från bäddas in som `window.__PRELOAD__`, så webbläsaren
börjar med färdig lista i stället för att blinka till och hämta om den.

`sitemap.xml` genereras i samma steg och listar exakt de sidor som faktiskt
skrevs — den kan alltså inte peka på en sida som inte finns.

### Avsnittens URL:er och titlar

`EPISODE_PAGES` i `src/config/site.ts` styr tre saker per avsnitt: dess
permanenta slug, titeln sajten visar, och metabeskrivningen.

En slug som redan är publicerad ändras aldrig — varje delad länk slutar
fungera och sidans ranking nollställs. Lägg till en ny post i stället.

Titeln är värd mest av allt i den här filen. "Avsnitt 1 Del 2" går inte att
söka på; ingen skriver det. Skriv vad avsnittet handlar om, med orden en
lyssnare skulle använda, och sätt **samma titel i Spotify for Creators** — det
mesta av poddupptäckt sker i Spotifys och Apples egna sökrutor, inte i Google.

### Klipp på startsidan

Klippen hämtas från YouTube-kanalens öppna RSS-flöde till `public/youtube.json`
av `scripts/fetch-youtube.mjs` — före varje bygge och på schema i
`Uppdatera avsnitt`. Ett nytt klipp syns alltså av sig självt, utan att någon
rör koden.

Bara YouTube, och det är ett medvetet val. Instagram, TikTok och Facebook
kräver var sin OAuth-app med token som måste förnyas — Instagrams var 60:e dag
— och den dagen en token tyst slutar fungera står det ingenting på startsidan
utan att någon märker det. Publicerar du på YouTube också, vilket du redan
gör, fångas allt den vägen.

Inget bäddas in: sektionen är bilder och länkar, så ingen YouTube-spelare
laddas och ingen besökare får en kaka av Google.

### Delningsbilder

```bash
npm run og          # ritar bilder för avsnitt som saknar en
npm run og -- --force   # ritar om allihop, t.ex. efter en titeländring
```

Varje avsnitt har en egen bild i `public/og/<slug>.png` som visas när någon
delar länken. Utan den previewas alla fem avsnitt som samma omslag, och
previewbilden är det mesta av det som avgör om någon klickar. Bilderna
genereras lokalt och committas; ett avsnitt utan bild faller tillbaka på
omslaget, så en missad körning blir aldrig en trasig preview.

Typsnittet ligger i `assets/fonts/` (Familjen Grotesk, OFL-licensierat).

### IndexNow

`public/<nyckel>.txt` och `scripts/ping-indexnow.mjs` talar om för Bing,
DuckDuckGo, Yandex och Seznam att adresserna ändrats, i stället för att vänta
på att de tittar förbi. Deploy-flödet kör det automatiskt efter varje lyckad
publicering. Nyckeln är ingen hemlighet — protokollet bygger på att den ligger
publikt på domänen, det är så en sökmotor kontrollerar vem som skickat in.

### Search Console

Domänen är verifierad som **domänegendom** (`sc-domain:trasigmenhel.se`) och
`https://trasigmenhel.se/sitemap.xml` är inskickad under *Webbplatskartor*.
Sitemapen behöver aldrig skickas in igen — Google läser om den av sig själv när
den ändras.

Ett nytt avsnitt hittas alltså på egen hand, men det går fortare att be om det:
klistra in avsnittets adress i sökrutan högst upp i Search Console och välj
*Begär indexering*. Kvoten är cirka tio adresser per dygn.

### Transkript

```bash
brew install whisper-cpp   # en gång
npm run transcribe
```

Transkriberingen körs lokalt på din Mac med whisper.cpp. Inget ljud lämnar
datorn och det kostar ingenting. Resultatet hamnar i
`public/transcripts/<slug>.json` och committas.

Ett avsnitt utan transkriptfil fungerar precis som vanligt — sidan visar bara
beskrivningen. **Vill du ta bort ett publicerat transkript räcker det att
radera filen och deploya om.**

Ett transkript är det enda på sajten som kan ranka på något annat än poddens
eget namn: en timme tal är runt 9 000 ord formulerade precis som en lyssnare
skulle söka. Det gör också avsnittet läsbart för den som inte kan eller vill
lyssna. Texten är maskinskriven och innehåller felhörningar, framför allt i
namn — det står på sidan, men läs igenom innan du publicerar ett avsnitt som
nämner personer vid namn.

## Nyhetsbrev

Prenumerationsformuläret registrerar adresser i Brevo-lista `3` och skickar
Brevos bekräftelsemall `5` direkt efter registreringen. Formuläret skickar även
det samtyckesfält (`OPT_IN`) som Brevos inbäddningskod kräver.

Två GitHub Actions-jobb håller resten automatiskt:

- `Uppdatera avsnitt` hämtar RSS-flödet och uppdaterar både
  `public/episodes.json` och Brevos välkomstmall med de tre senaste avsnitten.
- `Skicka nyhetsbrev vid nytt avsnitt` skapar ett utskick till listan när ett
  nytt riktigt avsnitt publiceras. En tom lista markeras som hanterad i stället
  för att orsaka återkommande fel.

API-nyckeln ligger endast i GitHub-secret `BREVO_API_KEY`. Inga hemliga nycklar
eller prenumerantadresser sparas i webbläsaren eller repot.

Lokala kontroller:

```bash
npm test
npm run lint
DRY_RUN=true npm run newsletter:sync
DRY_RUN=true npm run newsletter:notify
```

## Custom Domain Setup

The website uses a custom domain (trasigmenhel.se) configured through GitHub Pages.

## Zoho Verification

The website includes Zoho verification for email services.
