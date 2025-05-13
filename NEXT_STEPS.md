# Nästa steg för att slutföra publiceringen av trasigmenhel.se

Webbplatsen har nu laddats upp till GitHub Pages! Här är de sista stegen för att få din webbplats att fungera med din egen domän:

## 1. Konfigurera GitHub Pages-inställningar

1. Gå till ditt GitHub-repository på: https://github.com/MrPicki/Trasigmenhel
2. Klicka på "Settings" (Inställningar) i den övre menyn
3. Scrolla ner till sektionen "GitHub Pages"
4. Under "Source", kontrollera att "gh-pages" är vald som källa
5. Under "Custom domain", ange `trasigmenhel.se`
6. Markera kryssrutan "Enforce HTTPS" (Rekommenderas för säkerhet)
7. Klicka på "Save" (Spara)

## 2. Konfigurera DNS-inställningar

Gå till din domänleverantör (där du köpte trasigmenhel.se) och uppdatera DNS-inställningarna:

### Alternativ 1: A-Records (Rekommenderas)

Lägg till följande A-records som pekar din domän till GitHub Pages servrar:

```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

### Alternativ 2: CNAME-Record

Om du föredrar att använda CNAME, lägg till:

```
CNAME    www    mrpicki.github.io
```

## 3. Vänta på DNS-propagering

Det kan ta upp till 24 timmar för DNS-ändringarna att spridas över internet. Under denna tid kanske din webbplats inte är tillgänglig på din domän.

## 4. Verifiera Zoho

När webbplatsen är tillgänglig på din domän:

1. Gå tillbaka till Zoho
2. Slutför verifieringsprocessen genom att klicka på "Verifiera"-knappen
3. Zoho kommer att kontrollera att verifieringsfilen finns på din domän

## 5. Testa webbplatsen

När DNS-ändringarna har propagerats, besök din webbplats på:
- https://trasigmenhel.se

## Framtida uppdateringar

När du vill göra ändringar i webbplatsen i framtiden:

1. Gör dina ändringar i koden
2. Testa lokalt med `npm run dev`
3. Bygg och publicera med `npm run deploy`

Grattis! Din webbplats är nu publicerad och tillgänglig på din egen domän!
