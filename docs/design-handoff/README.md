# Handoff: Kosmiczny Śmieciarz

## Overview

**Kosmiczny Śmieciarz** to przeglądarkowa narracyjna gra-parodia w estetyce retro-DOS / VGA. Gracz wciela się w **kosmicznego śmieciarza-urzędnika** sortującego odpady, formularze i kosmiczne niepotrzebne rzeczy wg absurdalnych, ewoluujących reguł — odwiedza 4 planety, rozmawia z NPC-ami, rozwiązuje 2 zagadki i odkrywa, że **nie jest wybrańcem**.

Pełny design doc znajduje się w `design_doc.md`. Ten handoff zawiera **interaktywny prototyp HTML** (`Kosmiczny Smieciarz.html`) demonstrujący docelowy look-and-feel + przykład rozgrywki dla planety 1.

## About the Design Files

Pliki w tym pakiecie to **referencje wizualne stworzone w HTML** — prototypy pokazujące intencję wyglądu i zachowania, **nie kod produkcyjny do skopiowania 1:1**. Zadaniem implementacji jest **odtworzenie tych designów w docelowym środowisku** zgodnie z design dokiem (Vite + React 18 + TypeScript + Zustand + Framer Motion + dnd-kit + Web Audio API + localStorage).

Prototyp HTML pokazuje:
- ekrany boot/title, sortownię (Planeta 1), system dialogów, day-end, transit, finale
- shareable moment "test Pani Heleny"
- wizualne podglądy palet 4 planet (zakładki na dole ekranu)
- panel Tweaks (toggle ⚙ TWEAKS w prawym górnym rogu)

## Fidelity

**High-fidelity** dla Planety 1 (BIUROKRACJA-7), **low-fidelity** dla planet 2-4 (palety + nazwy zon, bez pełnej zawartości).

Prototyp jest pixel-perfect referencją dla:
- typografii (VT323 + Press Start 2P)
- kolorów per planeta (zmienne CSS — patrz Design Tokens)
- chunky-pixel framingu (3D bevel borders à la DOOM/DOS)
- CRT scanlines + winieta (przezroczystość regulowana, default 0.2 wg ustawień użytkownika)
- proceduralnego SFX z Web Audio API
- pixel-art portretów 16×16 (hand-coded grid)

Dla planet 2-4 implementacja powinna stosować ten sam visual system z paletami zdefiniowanymi w `applyPalette()`.

## Screens / Views

### 00 · Boot Screen
- **Cel:** parodia bootu DOS-a, wprowadzenie tonu gry
- **Layout:** czarne tło, monospace tekst od top-left, 60-80px padding
- **Zawartość:**
  - Linijki ładujące (sekwencyjnie, ~380ms na linijkę): "LOADING ASSETS .......... OK", "LOADING AUDIO ........... OK", "DETECTING VGA ........... OK (640x400)", "CHECKING MEMORY ......... 47/48 MB"
  - Po zakończeniu: prompt `WARNING: Insufficient memory.  Continue? [T/N]` z migającym kursorem (1s blink)
- **Typografia:** VT323 22px, kolor `#c9c9c9`
- **Akcja:** klawisze T/Y/Enter/Space → przejście do Title

### 01 · Title Screen
- **Layout:** flex column centered, gap 32px
- **Logo:** Press Start 2P 56px, kolor `#d8c34c`, letter-spacing 6px, drop-shadow `4px 4px 0 #552c00, 8px 8px 0 #2a1600` (3D pixel)
- **Tagline:** VT323 28px `#9ae29a` "— parodia hero complexu w grach —"
- **Press-any-key:** Press Start 2P 14px `#e3d76a`, blink animation
- **Tło:** czarne z animowanymi gwiazdkami (60 sztuk, twinkle 3s)
- **Akcja:** dowolny klawisz / klik → start P1

### 02 · Sorting Station (główny ekran rozgrywki)
- **Grid wierszowy:** `72px 1fr 210px` (top bar / mid / zones)
- **Top bar (72px):**
  - Portret 56×56 px (canvas 16×16 scaled, image-rendering: pixelated), z 4-warstwowym pixel bevel borderem
  - Nazwa planety (Press Start 2P 10px accent yellow) + sub (VT323 18px)
  - Stat "Kontyngent X/15" (Press Start 2P 9px label + VT323 28px wartość)
  - Stat "Kredyty X ₢"
- **Mid (grid 1fr 380px, padding 14px, gap 14px):**
  - **Workstation (lewa):** taśma kasowa stylizowana — repeating-linear-gradient pasów ciemnozielonych + paski z kropek na górze i dole. Border 4px chunky bevel. Karta formularza (paper) 360×440 absolutely-centered, draggable.
  - **Side col (prawa, 380px, flex column):**
    - Panel REGULAMIN — Press Start 2P 12px header `var(--p-accent)`, lista reguł VT323 20px na ciemnym tle z lewym borderem `var(--p-accent)`. Nowo odblokowane reguły mają animację `newRule` 1.2s (flash żółty → fade).
    - Panel INVENTORY — chipy "X butelki KBK-3", "X F-17/B" itp.
    - Panel AKTYWNY QUEST — tekst zadania.
- **Zones (210px, grid 1fr 1fr 1fr auto, padding 12px 14px 14px, gap 10px):**
  - 3 strefy: AKCEPT (zielona `#1e3a1e`), ODRZUT (czerwona `#3a1e1e`), PRZEKAŻ WYŻEJ (niebieska `#1e2a3a`)
  - Każda: 4px chunky bevel border, ikona Press Start 2P 14px, sub-label VT323 20px, hint klawisza w rogu
  - Hover: `transform: translateY(-4px); filter: brightness(1.3)`
  - Plus kolumna z przyciskami DALEJ ▸ + ? PODPOWIEDŹ

### 02a · Karta formularza (drag target)
- **Wymiary:** 360×440 px
- **Tło:** kremowy papier `#e3dcc0` z poziomymi liniami (repeating-linear-gradient 22px+1px)
- **Border:** 3px solid `#8a8262` + inset highlights (paper bevel)
- **Box-shadow:** `6px 6px 0 rgba(0,0,0,.4)` (DOS drop-shadow)
- **Zawartość:**
  - Header: numer formularza (Press Start 2P 11px) + data (VT323 20px), border-bottom dashed
  - Photo placeholder: 58×70 stylizowane zdjęcie ID (gradient paint głowa + tors)
  - SPRAWA (Press Start 2P 12px)
  - Wiersze danych: Obywatel / Pochodzenie / Data / Pieczątka / Stempel / Okienko (VT323 20px, white-space: nowrap, ellipsis na wartości)
  - Footer: podpis + egz.
  - Stamp: rotate(-12deg), Press Start 2P 10px, kolor wg pieczątki (niebieska/czerwona/czarna), dashed border jeśli "suchy"
- **Drag:** mousedown/touchstart → relative translate, hover-detect strefy via `elementFromPoint`, drop → `chooseZone(zoneId)`

### 02b · Dialog overlay
- **Tło:** semi-transparent `rgba(0,0,0,.55)`
- **Box:** 1160×~200px na dole ekranu, grid `156px 1fr` (portret + treść)
- **Portret NPC:** 140×140 canvas pixel-art z 3px chunky bevel
- **WHO label:** Press Start 2P 12px accent yellow
- **Tekst:** VT323 26px line-height 1.2, **typewriter effect** (configurable speed, default ~33 chars/s), klik = skip
- **Choices:** flex column, VT323 22px na tle `#1a2a1a`, 4px lewy border accent yellow, hover → `#2a3e26` + tekst `#fff5c0`. Każdy z prefixem `[1]`/`[2]`/`[3]` (klawisze 1-3 też działają).
- **Hero variant** (Helena test): złoty bevel border zamiast zielonego.

### 03 · Day End Screen
- **Tło:** `#0c1a0c`, centered
- **Card:** ~560px, frame z chunky bevel
- **Header:** Press Start 2P 18px accent yellow "▸ KONIEC DNIA ROBOCZEGO ◂"
- **Wiersze (border-bottom dotted):** Poprawne sortowania / Błędy / Wypłata / Premia za quest / RAZEM
- **Animacja:** cyfry brzęczą — increment co 90ms z dźwiękiem `coin` (chiptune square wave)
- **CTA:** "▸ LECĘ NA HYPER-MART ◂" primary button (yellow `#7a6b1a`)

### 04 · Transit
- **Tło:** czarne, gwiazdki sliding leftwards (translateX 200px linear 2.5s)
- **Statek:** 64×32 px srebrny, clip-path strzałka, animowany drift up/down 3s
- **Caption:** VT323 28px green "Lecę na HYPER-MART GALAKTYCZNY..."

### 05 · Finale
- **Tło:** `#060606`, flex column centered, gap 20px
- **"KONIEC."**: Press Start 2P 56px red `#d94d4d`, letter-spacing 10px, text-shadow 4px 4px
- **Numerek:** Press Start 2P 92px accent yellow w żółtym frame: "00847"
- **Tekst:** VT323 26px szary, max-width 780px, centered: "Gratulacje. Nie jesteś wybrańcem. Jesteś śmieciarzem."
- **Helena slide-in:** po 6s (skrócone z 30s w docu) Pani Helena wjeżdża z dołu z dymkiem: "Pan jeszcze tu? Ja już kończę dniówkę. Niech pan zamknie. **Numerek pan ma?**"

### Tweaks Panel (overlay)
- Toggle przycisk ⚙ TWEAKS prawy-górny róg (DOS-button styled)
- Panel 300px szeroki: CRT intensity slider, Paleta select (P1-P4), Tempo reguł, Mood override, SFX on/off, Tekst speed, RESET / SKIP DO FINAŁU buttons

## Interactions & Behavior

### Sortowanie
- Drag-drop karty na strefę **lub** klik strefy **lub** klawisz `1`/`2`/`3`
- Po wyborze: `evaluateItem(item, zoneId, rules, unlocked)` → expected zone
- Correct: SFX `stempel` + `ding`, `correct++`, `credits += 2`, ~22% szans drop "butelka KBK-3"
- Incorrect: SFX `error`, `errors++`, mood → `panicked` na 900ms, toast "✗ Zła strefa. Poprawnie: AKCEPT"
- Po sortowaniu: ewolucja reguł (sprawdza czy `correct >= rule.unlock` dla każdej zablokowanej reguły) + animacja "★ NOWA REGUŁA"
- Hero test trigger: `correct >= 6 && unlocked.has('r5') && !heroTestDone` → wstawienie formularza Heleny + otwarcie dialogu
- Zenek dialog trigger: `idx === 5 && !flags.zenek`
- Po `idx >= pool.length` → `endDay()`

### Reguły ewoluujące (BIUROKRACJA-7)
1. **R1 (start):** `numer === 'F-17/B'` → akcept, else odrzut
2. **R2 (po 3 poprawnych — pace 'normal'):** pieczątka czarna → odrzut; niebieska + F-17/B → akcept
3. **R3 (po 6):** data parzysta → przekaż wyżej
4. **R4 (po 9):** Marsjanin + czarna pieczątka → akcept (odwrotnie); Marsjanin + niebieska → odrzut
5. **R5 (po 12):** stempel mokry + okienko ≠ 12 → odrzut

Engine: ostatnia odblokowana reguła ma najwyższy priorytet; jeśli zwraca null → wcześniejsza; fallback do R1.

Pace presets: `fast` [2,3,5,7], `normal` [3,6,9,12], `slow` [5,8,11,14].

### Dialog system
- Typewriter z configurable speed (1000/textSpeed ms na char)
- Klik na tekst = skip do końca + show choices
- Klawisze 1-4 = wybór opcji
- Każdy choice może mieć `effect` (callback) i `go` (next nodeId, null = close)
- SFX `page` (white-noise sweep) na otwarciu node, `skan` na wyborze

### Audio lifecycle
- AudioContext tworzony **dopiero na pierwszy user gesture** (klik/keyboard)
- `visibilitychange` → `audioCtx.resume()` (Safari/iOS recovery)

### Save/load (pełna implementacja w docelowym kodzie)
- Klucz: `localStorage['kosmiczny-smieciarz:v1']` z version check
- Debounced 500ms
- Persist: pełny `itemsRemaining` (nie seed RNG), `firedInterruptionIds`, `puzzleProgress`, flags

## State Management

Patrz `design_doc.md` §5 (sekcja Architektura). Kluczowe punkty:

- **Mode vs overlay:** dialog/puzzle to **overlaye** nad `mode: 'sorting'`, **nie** osobne tryby. Zachowuje sortingState przy otwarciu.
- **Slices Zustand:** `sortingSlice`, `dialogSlice`, `inventorySlice`, `persistence` — od M1, nie później.
- **Portrait mood:** computed selector (pure fn od stanu), nie imperatywny `setMood`.
- **`itemPool: (state) => SortingItem[]`** — funkcja od stanu (P2 shareable wymaga warunkowego klienta z butelkami).
- **`Rule.evaluate: (item) => string | null`** + content validation test sprawdza pokrycie wszystkich itemów.

## Design Tokens

### Typografia
- **VT323** (Google Font) — całość tekstu narracyjnego, dialogi, dane. Sizes: 18 / 20 / 22 / 26 / 28 / 32px.
- **Press Start 2P** (Google Font) — labels, headers, buttons, logo. Sizes: 9 / 10 / 11 / 12 / 14 / 18 / 56 / 92px.
- Letter-spacing: 1-2px na labelach Press Start 2P, 6-10px na logo/finale.

### Kolory — BIUROKRACJA-7 (P1)
- `--p-bg: #1a2a1a` — main background
- `--p-bg-2: #223322` — frames
- `--p-ink: #b8d9b0` — text default
- `--p-ink-dim: #6c8a66` — labels
- `--p-paper: #e3dcc0` — kremowy papier formularzy
- `--p-paper-dk: #c6bf9f`
- `--p-stamp-b: #2c4a8a` — niebieska pieczątka
- `--p-stamp-r: #9a2a2a` — czerwona
- `--p-stamp-k: #1b1b1b` — czarna
- `--p-accent: #d8c34c` — żółty formularzowy (akcent globalny)
- `--p-ok: #5bbd5b`, `--p-err: #d94d4d`
- `--p-frame: #8a9f7a` (jasny bevel)
- `--p-frame-dk: #324a2e` (ciemny bevel)
- `--p-frame-hi: #d9eac8` (highlight)

### Kolory — pozostałe planety
- **P2 Hyper-Mart:** bg `#cfccbf`, bg-2 `#e8e8e0`, ink `#1c1c1c`, frame `#ffffff`, frame-dk `#8a8070`, accent `#e03a7a` (jaskrawy róż neon)
- **P3 Flarglebloop:** bg `#2b1740`, bg-2 `#3a1f5a`, ink `#e7d6ff`, frame `#8a5ab0`, frame-dk `#1a0a2a`, accent `#5ad0d8` (cyjan)
- **P4 Stacja Końcowa:** bg `#1a1a1a`, bg-2 `#2a2a2a`, ink `#c9c9c9`, frame `#6a6a6a`, frame-dk `#0c0c0c`, accent `#d8c34c`

### Spacing
- Padding/gap: 6 / 8 / 10 / 12 / 14 / 16 / 22 / 32px
- Bevel borders: 3-4px solid

### Shadows
- Drop-shadow papieru: `6px 6px 0 rgba(0,0,0,.4)` (zero-blur DOS-style)
- Frame inset bevel: `inset 2px 2px 0 var(--p-frame), inset -2px -2px 0 #0c1a0c`
- Frame outer: `6px 6px 0 rgba(0,0,0,.5)`

### CRT effect
- Scanlines: `repeating-linear-gradient(to bottom, rgba(0,0,0,.22) 0 2px, transparent 2px 4px)`
- Vignette: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)`
- Mix-blend-mode: `multiply`, opacity togglowalne (default 0.2 wg testów użytkownika)

### Animacje
- newRule (1.2s): żółty flash → fade do ciemnego z slide-in
- toast (2.6s): translateY(-20px) → 0 → translateY(10px), fade
- twinkle gwiazd (3s)
- ship drift (3s ease-in-out infinite)
- portrait flash (panicked 900ms cooldown)

## Assets

Wszystkie assety **inline** w prototypie:
- **Pixel-art portrety:** hand-coded 16×16 string grids w `FACES` object → renderowane na `<canvas>` przez `renderFace()`. Zawiera: `pl_normal/tired/greedy/surprised/panicked` (gracz), `helena`, `officer`, `blorg`, `arbiter`. Pixel palette w `PALETTE` (16 kolorów).
- **Tła planet:** brak — używa kolorów z palette + chunky frame'y (placeholder dla finalnych pixel-art teł 640×400).
- **Ikony przedmiotów:** brak — formularz renderowany jako struktura HTML z paletą.
- **Audio:** całość proceduralna w `sfx(kind)` — Web Audio API oscillators. Brak plików.

W docelowej implementacji wg design doca: AI-generated pixel art (Midjourney/DALL-E "Doom 1993 pixel art portrait, chunky VGA, 64×64") jako placeholder MVP, finalne w M7.

## Files

- **`Kosmiczny Smieciarz.html`** — interaktywny prototyp (wszystko w jednym pliku: HTML + CSS + JS)
- **`design_doc.md`** — pełny design dokument v2 (943 linie) z: pętlą rozgrywki, contentem 4 planet, layoutami UI, architekturą, milestones M1-M8, definition of done, playtest plan, ryzyka CTO

## Implementacja — quick start

```bash
npm create vite@latest kosmiczny-smieciarz -- --template react-ts
cd kosmiczny-smieciarz
npm i zustand framer-motion @dnd-kit/core @dnd-kit/sortable
```

Patrz design doc §5 (struktura projektu) i §7 (milestone order — zaczynaj od M1: pure `sortingEngine` + unit testy).

**Kluczowe decyzje architektoniczne** (design doc §12.5):
- dnd-kit (touch + mouse + keyboard z jednej biblioteki)
- Overlay pattern dla dialog/puzzle (nie mode stack)
- Keyboard shortcuts dla settings (F1, M)
- TS strict od M1
- AudioContext na first user gesture
- `Rule.evaluate` zwraca `string | null` + content validation test
