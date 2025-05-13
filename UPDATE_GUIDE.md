# Guide för att uppdatera din webbplats

Denna guide visar hur du uppdaterar din webbplats och publicerar ändringarna på trasigmenhel.se.

## Steg för att uppdatera webbplatsen

### 1. Gör dina ändringar

Börja med att göra de ändringar du vill i koden. Du kan ändra HTML, CSS, JavaScript, bilder, etc.

### 2. Testa dina ändringar lokalt

Kör utvecklingsservern för att se dina ändringar:

```bash
npm run dev
```

Detta startar en lokal server på http://localhost:8080 där du kan se dina ändringar.

### 3. Spara dina ändringar i Git

När du är nöjd med dina ändringar, spara dem i Git:

```bash
# Lägg till alla ändrade filer
git add .

# Spara ändringarna med en beskrivning
git commit -m "Beskrivning av dina ändringar"
```

### 4. Ladda upp ändringarna till GitHub

Skicka dina ändringar till GitHub:

```bash
git push origin master
```

### 5. Bygg och publicera webbplatsen

Nu är det dags att bygga och publicera den uppdaterade webbplatsen:

```bash
npm run deploy
```

Detta kommando gör två saker:
1. Bygger en produktionsversion av webbplatsen (`npm run build`)
2. Publicerar den till GitHub Pages (`gh-pages -d dist`)

### 6. Verifiera ändringarna

Efter några minuter bör dina ändringar vara synliga på:
- https://trasigmenhel.se (om du har konfigurerat din domän)
- https://mrpicki.github.io/Trasigmenhel/ (direkt från GitHub Pages)

## Snabbkommandon

För att göra processen enklare, här är alla kommandon i ett:

```bash
# Efter att ha gjort dina ändringar
git add .
git commit -m "Beskrivning av dina ändringar"
git push origin master
npm run deploy
```

## Vanliga uppdateringar

### Uppdatera text

För att uppdatera text, hitta rätt fil i `src`-mappen och ändra texten.

### Lägga till bilder

1. Lägg till bilden i `public`-mappen
2. Referera till bilden i koden med `/bildnamn.jpg`

### Ändra stilar

CSS-stilar finns i `src/index.css` och i komponentfilerna.

## Felsökning

Om du stöter på problem:

1. Kontrollera att alla ändringar är sparade
2. Verifiera att du har kört `git push` innan `npm run deploy`
3. Kontrollera GitHub-repositoryt för att se om ändringarna har laddats upp
4. Kontrollera GitHub Pages-inställningarna i ditt repository

Kom ihåg att det kan ta några minuter innan ändringarna syns på den publicerade webbplatsen.
