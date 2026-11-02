# Concordia · digital brochure

## Opdater arrangementer

Alle arrangementer og næste besøgsdato redigeres i `arrangementer.json`.

- Kopiér et objekt i listen `arrangementer` for at tilføje endnu et arrangement.
- Sæt `"active": false` for at skjule et arrangement uden at slette det.
- Læg et nyt billede i samme mappe og skriv filnavnet i feltet `image`.
- Redigér `besoeg` nederst i filen, når næste besøgsdato ændres.
- Bevar kommaer, anførselstegn og klammer; filen skal fortsat være gyldig JSON.

Efter ændringer skal `CACHE_NAME` i `service-worker.js` hæves, fx. fra `v16` til `v17`, så installerede PWA'er får den nye version med det samme.

## Filstruktur

- `index.html`: sidens indhold og struktur
- `styles.css`: alt design og responsivt layout
- `app.js`: sideskift, swipe, modaler, installation og indlæsning af arrangementer
- `arrangementer.json`: arrangementer og næste besøgsdato
- `service-worker.js`: offline-cache
- `manifest.webmanifest`: PWA-oplysninger

## Brochurevisning

Brochuren viser én side ad gangen med swipe, pile og sidetal. PWA’en bruger almindelig appvisning (`standalone`) uden fuldskærmsknap.

Repoet indeholder kun de billeder, som den aktuelle brochure bruger. Tidligere billeder og plakater findes i Git-historikken. Ved ændring af arrangementer skal det nye billede også tilføjes til `CORE_ASSETS`, hvis det skal være tilgængeligt offline fra første åbning.
