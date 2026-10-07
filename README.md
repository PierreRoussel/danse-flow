# Le Bal

Console de soirée pour un mariage sans DJ. Le bal suit votre playlist **Mariage (soirée)** : *Ordinary* (Alex Warren) jusqu’à *Mutter*, 43 titres.

Le **son** vient des MP3 (ou MP4) déposés dans le dossier `musique/`. Dès qu’un fichier est reconnu, YouTube est coupé et le lecteur joue le fichier local.

## MP3

1. Copiez vos fichiers dans `musique/` (à la racine du projet).
2. Ouvrez [http://127.0.0.1:4721/mp3](http://127.0.0.1:4721/mp3) pour voir ce qui a été reconnu.
3. Relancez le bal. Suivant enchaîne au fichier suivant.

Noms qui marchent : `Ordinary.mp3`, `Alex Warren - Ordinary.mp3`, `01 Ordinary.mp3`, ou l’id YouTube `u2ah9tWTkmk.mp3`.

Pour forcer une association, créez `musique/correspondances.json` (voir `musique/correspondances.exemple.json`).

Sans aucun fichier, le lecteur YouTube reste en secours.

## L’idée

1. **Remplit** la piste (Ordinary, Perfect, All of Me).
2. **Fait sourire** (September, Get Lucky, ABBA, Whitney, Queen).
3. **Allume** (Bruno Mars, The Weeknd, Dua Lipa, Black Eyed Peas).
4. **Passe en français** (Stromae, Angèle, IAM, Gala).
5. **Passe au rock** (Black Betty, Bon Jovi, Thunderstruck, Lonely Day).
6. **Mélange les générations** (MJ, Weather Girls, Wham!, a-ha, Bryan Adams, Mambo).
7. **Respire** (Johnny, Benson Boone, Thinking Out Loud).
8. **Relance** (Daft Punk, Rihanna, LMFAO, Rasputin).
9. **Sort le clou** (Hotel California, Les Lacs du Connemara).
10. **Ferme** (Journey, Mötley Crüe, Rammstein).

Environ **2 h 55**.

## Lancer en local

```bash
npm install
npm run dev -- --port 4721
```

Ouvrez [http://127.0.0.1:4721](http://127.0.0.1:4721).
