# Concordia PWA

## Opdater arrangementer

Alle arrangementer og næste besøgsdato redigeres i `arrangementer.json`.

- Kopiér et objekt i listen `arrangementer` for at tilføje endnu et arrangement.
- Sæt `"active": false` for at skjule et arrangement uden at slette det.
- Læg et nyt billede i samme mappe og skriv filnavnet i feltet `image`.
- Redigér `besoeg` nederst i filen, når næste besøgsdato ændres.
- Bevar kommaer, anførselstegn og klammer; filen skal fortsat være gyldig JSON.

Efter ændringer skal `CACHE_NAME` i `service-worker.js` hæves, fx. fra `v11` til `v12`, så installerede PWA'er får den nye version med det samme.

## Filstruktur

- `index.html`: sidens indhold og struktur
- `styles.css`: alt design og responsivt layout
- `app.js`: funktioner, menu, modaler, installation og indlæsning af arrangementer
- `arrangementer.json`: arrangementer og næste besøgsdato
- `service-worker.js`: offline-cache
- `manifest.webmanifest`: PWA-oplysninger
