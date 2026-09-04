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
