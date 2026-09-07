# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Svensktalande lyssnare, i praktiken nästan alltid på mobil. De kommer sällan hit
via sökning — de kommer från länken i Instagram- och TikTok-bion, från en delad
länk i ett DM, eller för att någon nämnde podden. De är inte här för att läsa en
webbplats; de är här för att avgöra på några sekunder om podden är värd att följa,
och i så fall lägga till den där de redan lyssnar (Spotify, Apple Podcasts).

En mindre men viktig andra publik: personer som känner igen sig i ämnet — trauma,
missbruk, destruktiva mönster, föräldraskap — och som vill ha kontinuerlig kontakt.
Det är de som skriver upp sig på nyhetsbrevet.

## Product Purpose

`trasigmenhel.se` är poddens egen adress: den enda ytan avsändaren själv äger,
mellan plattformarna. Den ska (1) göra det uppenbart vad podden är och vem som
pratar, (2) skicka besökaren till Spotify eller Apple Podcasts som prenumerant,
och (3) fånga e-postadresser till nyhetsbrevet för dem som vill ha mer.

Framgång = antal följare på Spotify/Apple som kom via sajten, och antal
nyhetsbrevsprenumeranter. Sajten är en avfart, inte en destination.

## Positioning

En ärlig och osminkad podcast om att bryta negativa mönster och hitta styrka i
sårbarheten. Värden Christoffer "Picki" berättar sin egen resa från en uppväxt
präglad av trauma och missbruk till en pappa som kämpar för förändring — det är
förstahandsberättelse, inte expertpanel. Nya avsnitt varannan vecka.
En Ncom-produktion.

## Operating Context

- Besökaren kommer i regel från en app (Instagram, TikTok, Spotify) på mobil, ofta
  i mörk miljö, ofta med ljud redan igång.
- `/lankar` är link-in-bio-sidan som ligger i sociala profiler. Adressen är spridd
  och får inte ändras.
- Avsnitten publiceras via Anchor/Spotify for Creators; RSS-flödet är sanningen om
  vilka avsnitt som finns.

## Capabilities and Constraints

- Statisk sajt: React 18 + Vite + TypeScript + Tailwind, byggd och publicerad till
  GitHub Pages via `.github/workflows/deploy.yml` vid push till `master`. Egen
  domän via `public/CNAME`.
- Ingen backend. Allt som ser dynamiskt ut måste lösas i klienten eller vid bygget.
- Avsnitt: `public/episodes.json` genereras av `scripts/fetch-episodes.mjs` från
  Anchor-flödet före varje bygge och på schema; `api.rss2json.com` används enbart
  som färskhetslager i klienten och får aldrig kunna fälla sidan.
- Nyhetsbrev: Brevo-formulär som POSTas direkt från klienten. Måste ligga kvar på
  startsidan och fortsätta fungera exakt som idag (användarens uttryckliga krav).
- Rutter: `/` och `/lankar` (+ alias `/links`). `/lankar` prerendras av
  `scripts/prerender-routes.mjs` så att sociala crawlers får riktiga taggar.
  Rutten `/lankar` måste finnas kvar (användarens uttryckliga krav).
- Enda e-postadressen är `mail@trasigmenhel.se` (`src/config/site.ts`).
- Innehållsvolymen är låg: i skrivande stund **ett** publicerat avsnitt. Varje
  layout måste se avsiktlig ut med ett enda avsnitt, inte som ett tomt rutnät.

## Brand Commitments

- Namnet **Trasig men Hel** och ordmärket i fet grotesk.
- Monokrom identitet: svart och benvitt, inga varumärkesfärger utöver det.
- Det spruckna glaset är identitetens bärande motiv (omslaget, ordmärket).
- Rösten är rak, personlig och osminkad. Ingen terapi-jargong, inga löften om
  mirakel, ingen säljröst.
- Språket är svenska, genomgående.

## Evidence on Hand

- Poddomslag: `public/lovable-uploads/podcast-cover.jpg` (+ `-og.jpg` för delning).
- Ordmärke på svart med sprucket glas:
  `public/lovable-uploads/48ab1909-f9ce-40d6-94df-3a02b4d7bcba.png`.
- Publicerade avsnitt: `public/episodes.json` — för närvarande ett avsnitt,
  "Premiär Avsnitt 1 Del 1", 1 sep 2026, ~49 min.
- Riktiga kanaler: Spotify, Apple Podcasts (id6807401829), Instagram
  (@trasigmenhel.podd), TikTok (@trasigmenhel), YouTube (@Trasigmenhel), Facebook.
- Det finns **inga** lyssnarsiffror, recensioner, betyg, gästnamn eller citat att
  visa. Sådant får inte hittas på.

## Product Principles

1. Sajten är en avfart till Spotify/Apple — inte en plats att stanna kvar på.
2. Mobil först, i mörker, med tummen. Allt som kräver en muspekare är fel.
3. Ett avsnitt ska se lika avsiktligt ut som trettio.
4. Ingen påhittad social bevisning. Trovärdigheten kommer från rösten, inte siffror.
5. Redaktionellt innehåll (länkar, meddelande, utvalt avsnitt) styrs från
   `src/config/site.ts` så att ändringar aldrig kräver komponentkod.

## Accessibility & Inclusion

Svensk språkmärkning genomgående, riktig tangentbordsnavigering, respekt för
`prefers-reduced-motion`, och kontrast som håller på en telefon i solljus.
Ämnet är tungt — inga blinkande eller aggressiva effekter.
