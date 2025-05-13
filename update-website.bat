@echo off
echo ===================================
echo Uppdatera Trasig men Hel webbplats
echo ===================================
echo.

echo Steg 1: Lägger till alla ändrade filer...
git add .
echo.

echo Steg 2: Sparar ändringarna...
set /p commit_message="Ange en beskrivning av dina ändringar: "
git commit -m "%commit_message%"
echo.

echo Steg 3: Laddar upp ändringarna till GitHub...
git push origin master
echo.

echo Steg 4: Bygger och publicerar webbplatsen...
npm run deploy
echo.

echo ===================================
echo Klart! Din webbplats har uppdaterats.
echo.
echo Dina ändringar bör vara synliga inom några minuter på:
echo - https://trasigmenhel.se
echo - https://mrpicki.github.io/Trasigmenhel/
echo ===================================

pause
