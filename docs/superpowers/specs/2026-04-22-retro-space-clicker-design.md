# Kosmiczny Śmieciarz — Design Doc

**Data:** 2026-04-22
**Working title:** Kosmiczny Śmieciarz (retro sci-fi parody clicker)
**Autor:** Brono + Claude (brainstorming session)

---

## 1. Podsumowanie

Przeglądarkowa gra-kliker w stylu retro sci-fi, parodia gier podróży kosmicznej i typowych questów z gier RPG. Gracz wciela się w kosmicznego śmieciarza/wędrowca, który zbiera surowce z asteroid, sprzedaje je na planetach, wykonuje prześmiewcze questy NPC-ów i podróżuje dalej, aż dotrze do finału.

**Kluczowe decyzje (z brainstormingu):**
- Platforma: przeglądarka, shareowalny link (deploy → Netlify Drop)
- Rozmiar: **mały** (15-30 min grania, 4 planety, ~8 NPC-ów)
- Język: **polski**
- Estetyka: **Doom 1993 / DOS VGA pixel art**, paleta czerwono-brązowa + ciemne szarości
- Mechanika: kliker + ulepszenia + idle (drony) + losowe eventy (wszystko w lekkiej dawce)
- Dialog NPC: **2-3 odpowiedzi do wyboru**
- Audio: SFX (proceduralnie Web Audio) + chiptune music (pliki z OpenGameArt / CC0)
- Save: auto-save do **localStorage**
- Humor: **mix stylów per planeta** — Bareja / English absurd / Slapstick / Mix

**Stack:**
- **Vite + React 18 + TypeScript**
- **Zustand** (stan gry)
- **Canvas 2D** (viewport asteroid)
- **Web Audio API** (SFX proceduralnie) + `<audio>` tagi (chiptune)
- **localStorage** (save)
- Deploy: `npm run build` → `dist/` → Netlify Drop

---

## 2. Pętla rozgrywki i progresja

### Główna pętla

1. **Faza "kosmos":** gracz w przestrzeni. Na canvasie pływają asteroidy. Klik = rozbicie asteroidy, drop surowców do ładowni.
2. **Ulepszenia w locie:** gdy uzbiera kasę, kupuje ulepszenia statku (drill, magnet, dron auto-zbieracz, skaner rzadkich, większy zbiornik paliwa).
3. **Eventy losowe w kosmosie:** co kilkadziesiąt sekund szansa na event (pirat, przemytnik, kontroler butelek). Blokuje klikanie — gracz wybiera 2-3 odpowiedzi.
4. **Faza "planeta":** gdy gracz zdecyduje (lub ładownia pełna), leci na aktualną planetę. Sklep (sprzedaje surowce, kupuje paliwo/ulepszenia) + NPC z dialogiem (i czasem questem) + przycisk "Leć dalej" (aktywny po spełnieniu wymagań).
5. **Wymagania do wylotu:** każda planeta wymaga określonej kasy + skończonego questa, aby odblokować następną.

### Progresja — 4 planety

| # | Nazwa | Klimat humoru | Wymagania do wylotu |
|---|-------|---------------|---------------------|
| 1 | BIUROKRACJA-7 | Bareja (polska absurdalna biurokracja) | 300 ₢ + quest Pani Heleny |
| 2 | HYPER-MART GALAKTYCZNY | English absurd / Hitchhiker / korpo | 800 ₢ + quest Officera 4782-B |
| 3 | FLARGLEBLOOP-IV | Slapstick / Futurama | 1500 ₢ + quest Blorgonauty |
| 4 | STACJA KOŃCOWA | Mix / parodia finału | 3000 ₢ + quest finalny |

### Koniec gry

Po Planecie 4 — ekran zwycięstwa (parodia typowego "THE END" z gier retro). Gra przechodzi w **tryb infinite** — gracz może grać dalej klikając, bez nowego contentu.

---

## 3. Layout UI (Doom-style)

### Układ ekranu

```
┌────────────────────────────────────────────────┐
│                                                │
│       ASTEROID VIEWPORT (Canvas 2D)            │
│       ~70% wysokości                           │
│       Czarne tło, gwiazdki, asteroidy          │
│                                                │
├──┬────────────┬──────────┬────────────┬────────┤
│Ł │  KREDYTY   │          │ ULEPSZENIA │ PLANET │
│A │  42 ₢      │ PORTRET  │ [drill mk1]│  Nr 1  │
│D │  PALIWO    │ ŚMIECIARZA│ [magnet]  │        │
│O │  ▓▓▓░░ 60% │ (face)   │ [dron x2]  │ QUEST: │
│W │            │          │            │ aktywny│
│N │ złom:  12  │          │            │        │
│I │ platyna: 3 │          │            │        │
│A │ rzadkie: 0 │          │            │        │
│  │ butelki: 7 │          │            │        │
└──┴────────────┴──────────┴────────────┴────────┘
      ← HUD w stylu Doom, ~28% wysokości →
```

### HUD (dół ekranu, chunky Doom-style)

- **Ładownia** (lewo, pionowo): ikony surowców + liczby, wypełnia się wizualnie
- **Kredyty + paliwo:** duże cyfry w pixelowym fontcie, pasek paliwa jak health w Doomie
- **Portret śmieciarza** (środek, **ikona!**): 5 wariantów:
  - `normal` — domyślny
  - `tired` — paliwo < 20%
  - `greedy` — kasa > 1000 ₢
  - `surprised` — rzadki drop z asteroidy
  - `panicked` — trwa event
- **Ulepszenia:** małe ikony posiadanych ulepszeń
- **Kierunek + quest:** aktualna planeta + status aktywnego questa

### Nakładki (overlays)

- **EventPopup** — półprzezroczysty tint + okno z portretem NPC + tekst + 2-3 przyciski
- **PlanetScreen** — statyczne tło planety, NPC centrum, przyciski: "Sprzedaj", "Porozmawiaj", "Sklep", "Leć dalej"
- **Shop** — lista ulepszeń/paliwa + "kup" + powrót
- **DialogBox** — komponent dialog-tree, portret + tekst + 2-3 choice buttons
- **TitleScreen** — parodia DOS boot screen ("PRESS ANY KEY TO START ZBIERANIE")
- **EndScreen** — parodia "THE END"

### Styl graficzny

- **Base resolution:** 640×400 (2× Doom 320×200), skalowane CSS do okna
- `image-rendering: pixelated` — ostre piksele
- **Paleta:** dark reds (#8B0000), browns (#5C3317), grays (#3C3C3C), muted greens (#0A2F0A), dirty white (#D8C8B8)
- **Pixel font:** VT323 lub Press Start 2P (Google Fonts, darmowe)
- **CRT efekty:** CSS scanlines (`linear-gradient` overlay) + opcjonalnie curvature

---

## 4. Content — Planety, NPC, Questy, Eventy

### Planeta 1 — BIUROKRACJA-7 (Bareja)

**Asteroidy:** głównie zwykły złom (szary, 1 klik).
**Exit:** 300 ₢ + quest Pani Heleny.

**NPC #1 — Pani Helena z Okienka** (starsza urzędniczka, portret w okularach):
> "Pan do którego okienka? Bo to okienko jest do innego okienka. Numerek pan ma?"

Quest: *"Przynieś 5 pustych formularzy F-17/B. Nie ma ich w kosmosie. Musi pan sobie wyprodukować. Termin do piątku."*

Dialog (2-3 odpowiedzi):
- "Gdzie znaleźć te formularze?" → "W aktówce mojego szwagra. Ale on jest na urlopie."
- "A co jeśli nie znajdę?" → "To się pan nie zmieści w kolejce do nieznalezienia."
- *"No bez przesady..."* → "Proszę się nie denerwować. **NASTĘPNY!**"

**NPC #2 — Pan Zenek ze Skupu Butelek** (zrzędliwy dziadek, papieros za uchem):
> "Witam. Pan z butelkami? *mruży oczy* **Bez kapsla nie biorę. Pęknięte nie biorę. W skrzynce po 6 mają być. I etykieta oryginalna.**"

Quest: *"Uzbieraj 30 butelek zwrotnych KBK-3. Dam po 5 groszy. Znaczy po 4. Trzy. Dobra, po 2."*

Dialog:
- "Tylko 2 grosze?" → "Taka taryfa. Sąsiad na Marsie płaci mniej."
- "A nie można inaczej?" → "Może pan sam otworzyć skup. Zezwolenie 40 formularzy."
- *"Pan Zenek..."* → "Co pan tak spoufala?! Następny!"

Completion: *"O, popatrz. Wszystkie w skrzynkach. Szacunek. ...Sto cztery grosze... trzymaj pan, i nie mów nikomu za ile."*

### Planeta 2 — HYPER-MART GALAKTYCZNY (English absurd / korpo)

**Asteroidy:** pojawia się platynowa (srebrna, 3 kliki).
**Exit:** 800 ₢ + quest.

**NPC — Customer Happiness Officer 4782-B** (humanoid w krawacie, sztuczny uśmiech):
> "Witamy w HyperMart Galaktycznym! Czy zainteresowałby Pana nasz program lojalnościowy 'ŚMIECIARZ PREMIUM' z 0.3% zwrotem na paliwo w nieparzyste wtorki?"

Quest: *"Proszę podpisać tę klauzulę w 17 miejscach. Druga strona. W dół. Ostrożnie — jeśli Pan podpisze samym inicjałem, zrzekamy się Pana duszy oraz 23% drugich kończyn."*

Easter egg: próba sprzedaży butelek zwrotnych →
> "Butelki? Ach, **pan z Ziemi**. Uroczo. My tego nie przyjmujemy, to przestarzały system. Ale polecamy program 'ZWRÓĆ ZA PUNKTY' — 12 butelek za 1 punkt, który można wymienić na 0.02 ₢ zniżki."

### Planeta 3 — FLARGLEBLOOP-IV (Slapstick / Futurama)

**Asteroidy:** pojawia się rzadka (fioletowa, 5 klików, rzadkie materiały).
**Exit:** 1500 ₢ + quest.

**NPC — Blorgonauta Xyzzy** (trzy oczy, macka zamiast ręki):
> "BLURFLE! Moja żona mnie opuściła dla radiatora od lodówki! Pomożesz mi ją odzyskać?? Mam na myśli żonę, nie radiator! ...Chociaż radiator też ładny."

Quest: *"Zdobądź mi surowiec NAPRAWDĘ ŻÓŁTY PODCZAS WTORKU. Albo jakikolwiek kamień. Ja już nie pamiętam po co."*

### Planeta 4 — STACJA KOŃCOWA (Mix / finał)

**Asteroidy:** rzadkie + legendarny "zagubiony portfel" (dropuje losowo).
**Exit:** 3000 ₢ + quest finalny.

**NPC — Najwyższy Arbiter Śmieci we Wszechświecie** (wielki, płaszcz, pompa):
> "Wędrowcze... po tylu planetach... przybyłeś by spotkać... **MNIE**. Jestem najwyższym arbitrem śmieci we wszechświecie. Mam dla Ciebie quest ostateczny. Epicki."

Quest finalny: *"Przynieś mi... MÓJ ZAGUBIONY PORTFEL. Zostawiłem go gdzieś w nebuli. W środku jest 12 złotych groszy i paragon z 1987."*

**Ekran zwycięstwa:**
> "KONIEC. / Dziękujemy za zbieranie śmieci. / Twój tytuł: HONOROWY ŚMIECIARZ GALAKTYKI *(nie obejmuje zniżek na paliwo)*. / Grasz dalej? Klikaj. Tryb nieskończony."

### Eventy losowe (7 szt.)

1. **Pirat Kosmiczny** — "Oddaj połowę kasy!" → zapłać / walcz (klik) / przekonaj
2. **Przemytnik** — "Kupię 'specjalne ulepszenie' za 50 ₢, nie pytaj skąd" (50/50 legit/scam)
3. **Kosmita w kryzysie egzystencjalnym** — "Czemu TY to w ogóle robisz?" → filozofuj / zignoruj / daj klapsa
4. **Kosmiczny Jehowa** — "Dobra nowina GLOX-a?" → przyjmij / nie / zainteresuj się
5. **Zgubiona turystka** — "Gdzie Tatooine?" → "To inne uniwersum, pani."
6. **Kometa szczęścia** — 10s × 2 drop rate (bez wyboru, bonus)
7. **Kontroler Skupu Butelek** — "Dowód zwrotu!" → pokaż / udawaj niewiedzę / "spadaj"

### Typy surowców i asteroid

Każda asteroida ma typ (zwykła / platynowa / rzadka / butelkowa / portfel). Typ asteroidy = typ dropa. **"Spawn rate"** oznacza jaki udział procentowy asteroid danego typu pojawia się na danej planecie (suma = 100% per planeta).

| Zasób | Kolor asteroidy | HP | Wartość sprzedaży (shop) |
|-------|-----------------|-----|--------------------------|
| Złom (zwykły) | szary | 1 | 1 ₢ |
| Platyna | srebrny | 3 | 5 ₢ |
| Rzadki | fioletowy | 5 | 15 ₢ |
| Butelki KBK-3 | przezroczysty | 1 | 2 ₢ (każdy shop — HyperMart marudzi) |
| Zagubiony portfel | złoty blik | 1 | — (quest item, nie sprzedawalny) |

**Spawn rate per planeta** (suma 100%):

| Planeta | Złom | Platyna | Rzadki | Butelki | Portfel |
|---------|------|---------|--------|---------|---------|
| 1 (BIUROKRACJA-7) | 92% | 0% | 0% | 8% | 0% |
| 2 (HYPER-MART) | 70% | 25% | 0% | 5% | 0% |
| 3 (FLARGLEBLOOP-IV) | 50% | 30% | 15% | 5% | 0% |
| 4 (STACJA KOŃCOWA) | 35% | 30% | 30% | 4.5% | 0.5% |

**Pan Zenek a butelki — uwaga designowa:** Pan Zenek NIE jest sklepem. To NPC z questem. Quest: "przynieś 30 butelek → dostaniesz ~1 ₢" (humor: polski skup butelek płacący pennies). **Ekonomicznie bezużyteczne** (w sklepie dostałbyś 60 ₢), ale quest jest *side-humor* — bonus kontentu, nie główna ścieżka. Nagroda symboliczna, główna wartość = dialog.

### Ulepszenia (6 szt.)

| ID | Nazwa | Efekt | Cena |
|----|-------|-------|------|
| drill-mk2 | Lepsze wiertło | klik = 2× damage | 150 ₢ |
| magnet | Magnes grawitacyjny | zbieranie z większego promienia | 200 ₢ |
| drone-1 | Dron auto-zbieracz | zbiera 1 surowiec / 5s | 400 ₢ |
| drone-2 | Drugi dron | zbiera 1 surowiec / 5s | 800 ₢ |
| scanner | Skaner rzadkich | +5% drop rate platyna/rzadkie | 600 ₢ |
| fuel-tank | Większy zbiornik | +50% pojemność paliwa | 250 ₢ |

---

## 5. Architektura techniczna

### Struktura projektu

```
apka-test/
├── index.html, package.json, tsconfig.json, vite.config.ts
├── public/
│   ├── sprites/       (portrety, tła planet — PNG)
│   └── audio/music/   (chiptune loopy .mp3/.ogg)
├── src/
│   ├── main.tsx, App.tsx, index.css
│   ├── components/
│   │   ├── AsteroidViewport.tsx        # Canvas 2D — klikacz
│   │   ├── HUD/                        # CargoBay, Credits, FuelBar, PlayerPortrait, UpgradesList, QuestStatus
│   │   ├── Overlays/                   # EventPopup, PlanetScreen, Shop, DialogBox, TitleScreen, EndScreen
│   │   └── UI/                         # PixelButton, PixelFrame, PortraitFrame
│   ├── state/
│   │   ├── gameStore.ts                # Zustand — stan + actions
│   │   ├── persistence.ts              # localStorage load/save (debounced)
│   │   └── selectors.ts
│   ├── game/
│   │   ├── asteroidSpawner.ts
│   │   ├── eventScheduler.ts
│   │   ├── droneLoop.ts                # idle auto-collect
│   │   ├── economy.ts
│   │   └── questLogic.ts
│   ├── audio/
│   │   ├── sfx.ts                      # Web Audio API
│   │   └── music.ts                    # <audio> controller
│   ├── content/
│   │   ├── planets.ts, npcs.ts, quests.ts, events.ts
│   │   ├── upgrades.ts, resources.ts, asteroids.ts
│   │   └── dialogs/                    # dialogi per NPC
│   ├── types/game.ts
│   └── utils/rng.ts, format.ts
└── docs/superpowers/specs/
```

**Zasada:** wszystkie teksty/dialogi w `src/content/` w **TS** (nie JSON) — autocomplete, sprawdzanie refów, łatwe dodawanie NPC.

### State shape (Zustand)

```ts
interface GameState {
  // Player
  credits: number;
  fuel: number;                        // 0-100
  portraitMood: 'normal'|'tired'|'greedy'|'surprised'|'panicked';

  // Cargo — sum(cargo) musi być ≤ cargoCapacity; po przekroczeniu klikanie zablokowane
  cargo: { zlom: number; platyna: number; rzadkie: number; butelki: number; portfel?: number; };
  cargoCapacity: number;                 // initial = 100; bez upgrade w MVP (wystarcza na ~20 asteroid)

  // Progression
  currentPlanetId: string;
  unlockedPlanets: string[];
  completedQuestIds: string[];
  activeQuestIds: string[];             // wiele równoległych questów (np. Pani Helena + Pan Zenek na P1)

  // Upgrades — mapowanie: zakup "drill-mk2" ustawia drillLevel=2, "magnet" ustawia magnetRadius>0, etc.
  upgrades: {
    drillLevel: number;                  // 1 = base, 2 = mk2 (2× damage)
    magnetRadius: number;                // 0 = brak magnesu, 50 = kupiony magnet (px)
    droneCount: number;                  // 0-2 (drone-1, drone-2 kumulują się)
    scannerLevel: number;                // 0 = brak, 1 = kupiony (+5% rare drop)
    fuelTankLevel: number;               // 0 = base (100), 1 = kupiony (150)
  };

  // Mode / UI stack
  mode: 'title'|'space'|'planet'|'shop'|'dialog'|'event'|'end';
  currentEventId: string | null;
  currentDialogNodeId: string | null;
  currentNPCId: string | null;
  gameFinished: boolean;

  // Actions
  clickAsteroid(id: string): void;
  sellCargo(): void;
  buyUpgrade(id: string): void;
  startDialog(npcId: string): void;
  chooseDialog(choiceId: string): void;
  triggerEvent(eventId: string): void;
  resolveEvent(choice: string): void;
  travelToPlanet(planetId: string): void;
  landOnPlanet(): void;
  saveGame(): void;
  loadGame(): void;
  resetGame(): void;
}
```

### Content types (src/types/game.ts)

```ts
type Planet = {
  id: string;
  name: string;
  humorFlavor: 'bareja'|'english-absurd'|'slapstick'|'mix';
  asteroidTypes: string[];
  exitRequirement: { credits: number; completedQuestIds: string[]; };
  npcs: string[];
  shopItems: string[];
  backgroundSprite: string;
  musicTrack: string;
};

type NPC = {
  id: string;
  name: string;
  planetId: string;
  portraitSprite: string;
  greeting: string;
  questId?: string;
  dialogTree: Record<string, DialogNode>;
};

type DialogNode = {
  id: string;
  speaker: 'npc'|'player';
  text: string;
  choices?: DialogChoice[];
  effects?: Effect[];
  nextNode?: string;
};

type DialogChoice = {
  text: string;
  nextNode: string;
  effects?: Effect[];
  requires?: Condition;                  // warunek odblokowania choice (np. "mam 30 butelek")
};

type Condition =
  | { type: 'hasItem'; resource: string; qty: number }
  | { type: 'hasCredits'; value: number }
  | { type: 'hasQuestCompleted'; questId: string }
  | { type: 'hasQuestActive'; questId: string };

type Effect =
  | { type: 'addCredits'; value: number }
  | { type: 'removeCredits'; value: number }
  | { type: 'addQuest'; questId: string }
  | { type: 'completeQuest'; questId: string }
  | { type: 'addItem'; resource: string; qty: number }
  | { type: 'removeItem'; resource: string; qty: number }
  | { type: 'setDialogNode'; nodeId: string }
  | { type: 'endDialog' };

type Quest = {
  id: string;
  title: string;
  description: string;
  giverNPC: string;
  requirements: QuestReq[];
  reward: { credits: number; items?: Record<string, number>; };
  completionText: string;
};

type QuestReq =
  | { type: 'collectItem'; resource: string; qty: number }   // np. 30 butelek w cargo
  | { type: 'reachCredits'; value: number }                  // np. mieć 300 ₢
  | { type: 'talkTo'; npcId: string }                        // np. porozmawiać z innym NPC
  | { type: 'completeQuest'; questId: string };              // np. skończyć inny quest

type RandomEvent = {
  id: string;
  weight: number;                        // waga losowania (wyższa = częściej)
  planetFilter?: string[];               // jeśli podane, event leci tylko w kosmosie obok tych planet; inaczej wszędzie
  npcPortrait: string;                   // ID portretu (jak NPC.portraitSprite, ścieżka do PNG)
  opening: string;
  choices: EventChoice[];
};

type EventChoice = {
  text: string;
  outcomes: EventOutcome[];
};

type EventOutcome = {
  chance: number;
  text: string;
  effects: Effect[];
};
```

### Przepływ (przykłady)

**Kliknięcie asteroidy:**
1. `AsteroidViewport.onClick(e)` → wylicz jaki asteroid trafiony
2. → `gameStore.clickAsteroid(id)`
3. Reducer: damage = `drillLevel`, odejmij HP
4. Jeśli HP ≤ 0: wylosuj drop, dodaj do `cargo`; jeśli cargo full → "pełna ładownia" overlay
5. `sfx.playBlip()`
6. Re-render (React)
7. Debounced: `persistence.save()`

**Dialog choice:**
1. `DialogBox` button → `gameStore.chooseDialog(choiceId)`
2. Reducer: aplikuj `effects`, ustaw `currentDialogNodeId = choice.nextNode`
3. Jeśli `nextNode = null` → `mode = 'planet'`

**Event:**
1. `eventScheduler` co ~30s w trybie `space` losuje czy event trigger
2. Jeśli tak: wybierz z puli (ważony `weight`) → `gameStore.triggerEvent(id)`
3. Reducer: `mode = 'event'`, `currentEventId = id`
4. Po choice → `resolveEvent` → losuje outcome z `chance`, aplikuje `effects`, `mode = 'space'`

### Error handling

- **localStorage zablokowany** → fallback in-memory + ciche "save niedostępny"
- **Brak audio files (404)** → cicho, bez crash
- **Content refy zepsute** → TypeScript w compile; runtime: log warning + zamknij dialog
- **Window blur** → idle tick (drony) zatrzymuje się — oszczędność CPU

### Testing

- **Vitest** — lekkie
- **Content validation test** (kluczowy!) — walidacja wszystkich refów:
  - Każdy `nextNode` wskazuje istniejący `DialogNode`
  - Każdy `npcId` w planecie istnieje w `npcs.ts`
  - Każdy `questId` w dialogu istnieje w `quests.ts`
- **State reducer tests** — `clickAsteroid`, `sellCargo`, `completeQuest`, `travelToPlanet`
- **Smoke test** — symulacja pełnej ścieżki Planeta 1 → 4 + oczekiwane `gameFinished = true`
- **Brak** testów e2e / Playwright (overkill dla 15-30 min gry)

---

## 6. Strategia assetów

### Portrety NPC + gracza

- **MVP:** AI-generated pixel art (Midjourney / DALL-E z promptem "Doom 1993 face portrait, chunky VGA pixel art, 64×64, red/brown palette")
- **Zakres:** ~5 wariantów gracza (mood) + ~6 NPC + ~8 event-NPC = ~20 grafik
- **Placeholder fallback:** kolorowe kwadraty z inicjałami, finalne portrety podmieniane w M7
- **Fallback 2:** CC0 pixel art pack z Itch.io / OpenGameArt

### Asteroidy + ikony surowców

- **Asteroidy — proceduralnie w Canvasie** (koło z nieregularnym konturem, paleta zależna od typu) — **zero plików**
- **Ikony surowców w HUD:** PNG 16×16, ręcznie w Aseprite/Piskel lub AI — 4-5 sztuk

### Tła planet

- ~4 sztuki, 640×400, styl "pixel VGA, dark doom", AI-gen lub Aseprite

### Muzyka

- **Źródło:** OpenGameArt (CC0) — tagi: "chiptune", "8-bit", "space"; alt: Free-Chiptune.com
- **Zakres:** 1 loop kosmos + 4 per-planeta = 5 plików, <10 MB total
- **MVP:** 1 loop dla wszystkiego, rozbudowa stopniowo

### SFX

- **Web Audio API proceduralnie** — klik = square-wave blip, sprzedaż = arpeggio "ka-ching", lot = pink noise sweep
- **Zero plików** — ~50 linii w `audio/sfx.ts`

---

## 7. Milestones / Build order

Cel: **grywalne jak najszybciej**, potem rozbudowa.

1. **M1 — Setup + Core loop** (~1 dzień)
   - Vite+React+TS+Zustand boilerplate
   - Canvas z 1 asteroidą, klik → +1 kredyt, licznik w HUD

2. **M2 — HUD kompletny + warianty asteroid** (~1 dzień)
   - Wszystkie komponenty HUD (placeholder portrait), drop tables, pełna ładownia = blokada

3. **M3 — Pierwsza planeta end-to-end** (~1-2 dni)
   - PlanetScreen, Shop, DialogBox, quest Pani Heleny + Pan Zenek (oboje należą do P1), exit requirement → Planeta 2
   - Save/load localStorage
   - **Potwierdza że architektura działa** — jak P1 działa w całości, reszta planet to copy-paste z innym contentem

4. **M4 — Reszta planet + questy** (~1-2 dni)
   - Planety 2, 3, 4 kompletne z NPC i questami
   - Ekran zwycięstwa + infinite mode

5. **M5 — Eventy losowe + idle drony** (~1 dzień)
   - EventScheduler, 7 eventów, DroneLoop

6. **M6 — Audio** (~0.5 dnia)
   - Web Audio SFX + `<audio>` chiptune per-planeta (crossfade)

7. **M7 — Visuals polish** (~1 dzień)
   - Finalne portrety, animacje (particle burst), portrait mood transitions
   - CSS scanlines + CRT glow
   - TitleScreen + EndScreen

8. **M8 — Testy + deploy** (~0.5 dnia)
   - Content validation test, smoke test
   - `npm run build` + Netlify Drop

**Razem:** ~7-9 dni pełnego focusu. MVP (bez pełnego polishu M7) ~5 dni.

---

## 8. Definition of Done (MVP)

Gra jest "skończona" kiedy:

- [ ] 4 planety grywalne (każda: ≥1 NPC z dialogiem 2-3 choices, ≥1 quest, sklep, exit requirement)
- [ ] Clicker działa — cargo/upgrades/fuel synchronizują się z Zustand
- [ ] ≥5 eventów losowych z co najmniej 2 wyborami każdy
- [ ] Save/load w localStorage — odświeżenie karty zachowuje stan
- [ ] Audio: ≥1 chiptune loop + SFX proceduralny działają
- [ ] Ekran końca po Planecie 4 + tryb infinite
- [ ] Content validation test przechodzi
- [ ] `npm run build` → deploy na Netlify Drop → link działa na świeżej przeglądarce

---

## 9. Deploy

**Proces:**
1. `npm run build` → `dist/` (statyczne pliki HTML+JS+CSS)
2. Drag-drop `dist/` na [Netlify Drop](https://app.netlify.com/drop) → link za ~10 sek
3. Alternatywy: GitHub Pages, Vercel, itch.io

**Link = shareowalny.** Gracz klika → gra działa w przeglądarce. Zero instalacji, zero konta.

---

## 10. Otwarte kwestie / do rozważenia w planie implementacji

- **Muzyka per-planeta** — wymaga znalezienia 5 odpowiadających klimatom loopów CC0. Jeśli problematyczne, fallback do 1 loopa.
- **Portret gracza mood transitions** — płynne czy hard-cut? W MVP: hard-cut, polish = fade.
- **Krzywa trudności ekonomii** — ceny ulepszeń i wymagań planet zostały zaproponowane "na oko", może wymagać playtestingu i tweakingu.
- **Dodatkowe NPC-e na planetach 2-4** — w MVP 1 NPC per planeta, w rozbudowie można dodać 2-3 per planeta (jak Pan Zenek na P1).
