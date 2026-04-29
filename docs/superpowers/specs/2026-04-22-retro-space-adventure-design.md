# Kosmiczny Śmieciarz — Design Doc v2

**Data:** 2026-04-22 (rev 2)
**Working title:** Kosmiczny Śmieciarz
**Gatunek:** narrative sorting game / parodia point-and-click adventure
**Autor:** Brono + Claude (brainstorming + CTO-maruda review)

---

## 1. Podsumowanie

Przeglądarkowa gra narracyjna w estetyce retro sci-fi / DOS, **parodia hero complexu w grach** — zamiast wybrańca ratującego galaktykę, jesteś **kosmicznym śmieciarzem-urzędnikiem** sortującym odpady, formularze i kosmiczne niepotrzebne rzeczy wg absurdalnych reguł. Gracz odwiedza 4 planety, na każdej obsługuje inny mini-game sortowania, rozmawia z NPC-ami, rozwiązuje 2 absurdalne zagadki i odkrywa że **nie jest i nigdy nie będzie wybrańcem**. To jest żart.

**Kluczowe decyzje:**
- **Nie jest to kliker.** Core loop = **sortowanie przedmiotów wg reguł** (Papers Please w kosmicznym śmieciu) + dialogi + 2 zagadki
- Platforma: przeglądarka, shareowalny link (Netlify Drop)
- Długość: **1-2h intensywnie** do przejścia, **bez** infinite mode
- Scope: **średni** — 4 planety × (mini-game sortowania + NPC + questy) + 2 zagadki + shareable moments + spójna narracja
- Język: **polski**
- Estetyka: **DOS VGA pixel art bazowy**, paleta **zmienia się per planeta** (nie tylko czerwone Doom)
- Dialog NPC: 2-3 odpowiedzi do wyboru
- Audio: Web Audio API SFX (stempel, skan, ding, error) + chiptune loop (1 globalny na MVP, 4 per-planeta jeśli starczy czasu)
- Save: auto-save do localStorage (debounced)

**The thing:** Gracz uświadamia sobie stopniowo że **szara rzeczywistość jest śmieszniejsza niż bycie wybrańcem**. Parodia gier RPG i space opera sterczy z każdego okna dialogowego.

**Shareable moments** (by gracz pokazał znajomemu): 4 + finale, patrz §4.

**Stack:**
- **Vite + React 18 + TypeScript**
- **Zustand** (stan gry)
- **Framer Motion** (animacje sortowania — bez tego gra będzie drętwa)
- **Web Audio API** (SFX proceduralne) + `<audio>` tag (chiptune)
- **localStorage** (save debounced + wersjonowanie klucza `kosmiczny-smieciarz:v1`)
- **dnd-kit** (drag-drop z supportem touch + mouse + keyboard — kluczowe dla mobile)
- TypeScript strict mode od M1 (`strict: true`, `strictNullChecks`, `noUncheckedIndexedAccess`)
- Deploy: `npm run build` → `dist/` → Netlify Drop

---

## 2. Pętla rozgrywki i progresja

### Główna pętla (per planeta)

1. **Lądowanie** — krótki intro planety (tło + voice-over/tekst NPC w tle)
2. **Mini-game sortowania** — gracz dostaje reguły po prawej stronie ekranu i strumień przedmiotów po lewej. Przeciąga przedmiot do jednej z 2-4 stref (akcept/odrzut/przekaż/itp.). Reguły **ewoluują** — co kilka poprawnych sortowań dochodzi nowa reguła, wcześniejsze nadal obowiązują
3. **Przerywniki dialogowe** — co 5-8 przedmiotów w kolejce pojawia się "klient NPC" z dialogiem (2-3 choices), potem powrót do sortowania
4. **Quest / zagadka** — w połowie sceny gracz dostaje quest od kluczowego NPC (np. Pani Helena "przynieś F-17/B"). Żeby go rozwiązać, musi odbyć 2-4 krótkie dialogi z innymi NPC-ami (odblokowalne z poziomu lobby planety)
5. **Kontyngent dzienny** — scenę kończy osiągnięcie kontyngentu (np. "25 poprawnych sortowań") + ukończenie questa
6. **Wypłata** — ekran końca dnia z liczeniem zarobku (brzęczące cyfry), portret gracza zmienia mood
7. **Lot** — krótki tranzyt (statyczny obraz + tekst "Lecę na [następną planetę]...") → lądowanie

### Progresja — 4 planety

| # | Nazwa | Klimat humoru | Paleta | Czas | Exit req. |
|---|-------|---------------|--------|------|-----------|
| 1 | BIUROKRACJA-7 | Bareja (polska absurdalna biurokracja) | zielono-biurowa jarzeniówka (#2D4A2D bazowa) | ~20-25 min | quest Heleny + zagadka F-17/B |
| 2 | HYPER-MART GALAKTYCZNY | English absurd / Hitchhiker / korpo | białe jarzeniowe blasy (#E8E8E0 + akcenty) | ~20 min | quest Officera 4782-B |
| 3 | FLARGLEBLOOP-IV | Slapstick / Futurama | fioletowe-cyjanowe vibe (#5A3A7A) | ~15 min | quest Blorgonauty |
| 4 | STACJA KOŃCOWA | Mix / parodia finału RPG | szare metaliczne (#3C3C3C, cienie) | ~15 min | zagadka portfela Arbitra + meta-moment |

**Żadnej ekonomicznej bramki na exit** (było "300 ₢ + quest"). Teraz: **tylko quest odblokowuje lot.** Kredyty są do symbolicznej opłaty za lot + niektóre purchase w zagadkach + łapówki w dialogach.

### Koniec gry

Po quest finalnym z Arbitrem — **meta-ending** (patrz §4, P4). Gra się **kończy**, napis "KONIEC. SERIO." Jeśli gracz czeka 30s, Pani Helena zamyka mu okno. **Nie ma infinite mode** — to jest część żartu.

### Ekonomia (po cięciu klikera)

- **Zarobek:** +2 ₢ za każde poprawne sortowanie. Błędne = portret zły + 0 ₢ (bez minusa — nie frustrujemy)
- **Nie da się farmować.** Kontyngent dzienny = skończona pula przedmiotów per scena (15-25 szt.). Po skończeniu **nie wraca**.
- **Koszty:** lot między planetami 20 ₢, niektóre przedmioty zagadek 10-50 ₢, łapówki w dialogach 5-20 ₢
- **Bilans:** gracz kończy grę z ~50-150 ₢, zarabia po drodze ~300 ₢. Nie ma grindingu, nie ma stock'owania. Kredyty to **diegetyczny żart**, nie mechanika.
- **Zenek** (P1): quest-item only — dostajesz 30 butelek KBK-3 za 2 grosze nagrody. **Butelki są MacGuffin** — potrzebne do shareable momentu na P2 ("Butelki z Ziemi"). To ratuje Zenka — nagroda jest absurdalnie mała, ale **obowiązkowa** do jednej z najlepszych scen w grze.

---

## 3. Layout UI (Doom-boot-style, ale adaptacyjne per planeta)

### Tryby ekranu

Każdy ekran ma swój layout (nie jeden główny HUD). Tryby:

1. **TitleScreen** — DOS boot parodia (patrz §4, hook)
2. **SortingStation** — główny tryb per planeta, różny look per planeta (patrz niżej)
3. **DialogScene** — pełny ekran z portretem NPC + dialog box + choices
4. **PuzzleScene** — scena zagadki (F-17/B, portfel) — statyczne tło z klikalnymi hotspotami + inventory
5. **TransitScreen** — statyczna animacja statku między planetami
6. **DayEndScreen** — "WYPŁATA DZIENNA" z liczbami (parodia końca dnia z Papers Please)
7. **EndScreen** — meta-ending

### SortingStation layout (główny)

```
┌──────────────────────────────────────────────────┐
│  [Portret 64×64]     KONTYNGENT: 12/25           │ ← top bar
│  mood: normal        KREDYTY: 24 ₢               │
├─────────────────────────────────┬────────────────┤
│                                 │                │
│    TAŚMA / WORKSTATION          │  REGUŁY        │
│    (aktualnie sortowany         │  1. Akcept     │
│     przedmiot tutaj)            │     F-17/B     │
│    [ drag-drop obiekt ]         │  2. Odrzut     │
│                                 │     bez stempla│
│                                 │  3. Przekaż    │
│                                 │     Marsjan    │
│                                 │                │
│                                 │  NOWA REGUŁA!  │
│                                 │  4. (ukryte do │
│                                 │   odblokowania)│
├─────┬──────────┬──────────┬─────┴────────────────┤
│ AKC │  ODRZUT  │ PRZEKAŻ  │  [ NAST. KLIENT ]    │ ← strefy
│     │          │          │                      │
└─────┴──────────┴──────────┴──────────────────────┘
```

- **Top bar:** portret (z moodem) + kontyngent + kredyty
- **Workstation (lewa-środek):** tu pojawia się przedmiot do sortowania. Duża ikona + opis (format per planeta różny)
- **Reguły (prawa):** lista aktywnych reguł. Odblokowują się w trakcie sceny (efekt "NOWA REGUŁA!" z dingiem)
- **Strefy (dół):** 2-4 drop-zones (zmieniają się per planeta)
- **Next client button:** gdy gracz zakończy sortowanie przedmiotu, przycisk "następny" pokazuje kolejną sytuację (czasem dialog zamiast przedmiotu)

### DialogScene layout

Pełny ekran, statyczne tło sceny, portret NPC duży (128×128) po lewej, tekst w bottom frame, 2-3 buttony choice. Portret gracza **w rogu** (żeby widoczny był mood).

### DayEndScreen layout

Parodia końca dnia z Papers Please:

```
┌─────────────────────────────────────┐
│        KONIEC DNIA ROBOCZEGO        │
│                                     │
│  Poprawne sortowania:  22           │
│  Błędy:                 3           │
│  Wypłata:           44 ₢            │  ← brzęczy cyfra po cyfrze
│  Premia za quest:   20 ₢            │
│  ─────────────────────              │
│  RAZEM:             64 ₢            │
│                                     │
│  [ Lecę dalej ]                     │
└─────────────────────────────────────┘
```

### Portret gracza — 5 moodów (zostaje)

- `normal` — domyślny
- `tired` — po 20+ sortowaniach w scenie
- `greedy` — kredyty > 200
- `surprised` — rzadki moment (shareable trigger)
- `panicked` — podczas zagadki gdy gracz klika w losowe hotspoty

### Styl graficzny

- **Base resolution:** 640×400, skalowane CSS do okna, `image-rendering: pixelated`
- **Per-planeta paleta** — każda ma ~5-kolorową paletę. Base pixel-VGA pozostaje
- **Pixel font:** VT323 + Press Start 2P (Google Fonts)
- **CRT efekty:** CSS scanlines (`linear-gradient` overlay), opcjonalne curvature — w settings togglowalne

---

## 4. Content — Planety, NPC, Mini-games, Questy, Zagadki, Shareable Moments

### Hook (TitleScreen + intro)

**Boot DOS:**
```
KOSMICZNY_SMIECIARZ.EXE v1.02
(c) 1993 BRONOSOFT INTERACTIVE
─────────────────────────────
LOADING ASSETS .......... OK
LOADING AUDIO ........... OK
CHECKING MEMORY ......... 47/48 MB
WARNING: Insufficient memory.
Continue? [T/N] _
```

Gracz naciska **T** → title screen "KOSMICZNY ŚMIECIARZ" w pixel fontcie + "PRESS ANY KEY TO START ZBIERANIE".

**Intro (15-20s, skippable):**
Czarny ekran. Głos (tekst pixel font + SFX budzika): *"Pobudka. 6:47. Stawić się na stację Q-4 do sortowania odpadów pozaziemskich."* → lądowanie na BIUROKRACJI-7.

**Zero "dawno temu w galaktyce". Zero cutscenek.** Pierwsza pieczątka w sekundzie ~15.

---

### Planeta 1 — BIUROKRACJA-7 (Bareja)

**Tło:** pixel art biura z PRL w kosmosie — okienka, rzędy krzeseł, rachityczna roślina doniczkowa, plakat "PIĄTEK JEST DNIEM FORMULARZY".

**Mini-game: Stemplowanie formularzy.** Drag-drop formularzy do stref: `AKCEPT` / `ODRZUT` / `PRZEKAŻ WYŻEJ`.

Przedmiot = formularz z cechami: **numer** (F-17/B, F-3, F-22, F-99), **kolor pieczątki** (niebieski/czarny/czerwony), **data** (parzysta/nieparzysta), **stempel** (mokry/suchy), **obywatel** (Ziemianin/Marsjanin/Inny).

**Reguły (ewoluują):**
1. [start] Akcept tylko F-17/B, odrzut reszta
2. [po 3 poprawnych] + Akcept tylko pieczątka niebieska (czarna = odrzut)
3. [po 6] + Data nieparzysta (parzysta = przekaż wyżej)
4. [po 10] + Marsjanie: czarna pieczątka, Ziemianie: niebieska (odwrotnie niż reguła 2 dla Marsjan)
5. [po 15, shareable trigger] + Stempel mokry = akcept tylko jeśli sprawdziłeś w okienku 12 (nieistniejące okienko)

**NPC #1 — Pani Helena z Okienka:**
> "Pan do którego okienka? Bo to okienko jest do innego okienka. Numerek pan ma?"

Quest: *"Przynieś 5 pustych formularzy F-17/B. Nie ma ich w kosmosie. Musi pan sobie wyprodukować."* → **Zagadka #1**.

**Zagadka #1 — Formularz F-17/B nie istnieje.**

Gracz opuszcza SortingStation, wchodzi w PuzzleScene (scena biura). Klikalne hotspoty:
- **Szwagier Heleny** (pracuje w składzie) — "Formularze są u stróża. Ja bym dał, ale bez pokwitowania nie mogę."
- **Stróż** — "Pokwitowanie wystawia tylko Pani Helena. Ale ona nie może, bo jest stroną w sprawie."
- **Okienko 12** (nieistniejące) — "BRAK" → ale **klikanie tu 3 razy** odsłania żart: "Okienko 12 było likwidowane w 1987."

**Rozwiązanie:** dialogowa pętla — gracz musi:
1. Porozmawiać z Heleną → prosić o pokwitowanie → "nie mogę, jestem stroną"
2. Porozmawiać ze stróżem → dostać formularz **F-3** (podanie o wydanie pokwitowania)
3. Wypełnić F-3 (w mini-game — to wpleciony moment) → dostać **F-9** (zgodę na pokwitowanie)
4. Wypełnić F-9 → dostać **F-22** (oryginał pokwitowania)
5. Wrócić do stróża z F-22 → dostać **puste formularze F-17/B** (5 szt.)
6. Zanieść Helenie

Wszystko w dialogach + jedno sortowanie specjalne (F-3 i F-9 przelatują na taśmie jako "specjalna sesja").

**NPC #2 — Pan Zenek ze Skupu Butelek** (opcjonalny side quest, ale shareable-istotny):
> "Witam. Pan z butelkami? Bez kapsla nie biorę. Pęknięte nie biorę. W skrzynce po 6 mają być. I etykieta oryginalna."

Quest: *"Uzbieraj 30 butelek zwrotnych KBK-3. Dam po 2 grosze."*

Butelki KBK-3 pojawiają się jako drop w sortowaniu (20% losowych formularzy "zawinięte w gazetę zawierającą butelkę"). Gracz zbiera je do inventory. Po 30 → oddać Zenkowi → nagroda **60 gr = 0.6 ₢** (tak, mniej niż 1 ₢).

**Completion dialog Zenka:**
> "O, popatrz. Wszystkie w skrzynkach. Szacunek. ...Sześćdziesiąt groszy... trzymaj pan, i nie mów nikomu za ile."

**To jest przygotowanie pod shareable moment P2!** Butelki zostają w inventory (cargo przenosi się między planetami).

#### Shareable moment P1 — "Pani Helena testuje"

Po 15 poprawnych sortowaniach (reguła 5 aktywna) na taśmę wjeżdża **formularz Pani Heleny** — wszystkie dane jej, stempel **mokry** ale **niesprawdzony w okienku 12**. Wg reguł: ODRZUT.

Pokazany jest dialog z Heleną **obok formularza** (hybrid overlay):
> "Proszę Pana, to mój formularz. Proszę się nie bać. Niech pan przeanalizuje."

Gracz odrzuca. Jej reakcja:
> "Dziękuję. Mój formularz to był test. Zdał Pan. Awansuje Pan do okienka odbioru awansów. **Numerek pan ma?**"

→ Portret surprised + odblokowanie wyjścia z planety. Screenshot-worthy.

---

### Planeta 2 — HYPER-MART GALAKTYCZNY (English absurd / korpo)

**Tło:** pixel art hipermarketu — taśmy kasowe, jaskrawe neony z reklamami, wózki sklepowe, plastikowe rośliny.

**Mini-game: Skan kasy.** Drag-drop produktów do stref: `SKANUJ` / `PROMOCJA` / `SUPERVISOR` / `ODMÓW`.

Produkty = ikony z metadanymi: **kategoria** (spożywcze/techniczne/usługi), **cena**, **status lojalnościowy klienta** (BRONZE/SILVER/GOLD/DELIGHTFUL), **kod promo** (Q1-Q4 / PREMIUM / NONE).

**Reguły zamaskowane korpo-żargonem:**
1. Apply PREMIUM CASHBACK if customer is TIER-SILVER and item is in PROMO-Q4
2. Flag items over 500 ₢ to SUPERVISOR
3. DECLINE items from DEPRECATED-EARTH-CATALOG (butelki, gazety, papierowe rachunki)
4. [po 8] + MONETIZE OPPORTUNITY: If TIER-BRONZE, always SUPERVISOR (żart z dyskryminacji korpo)

**NPC — Customer Happiness Officer 4782-B** (humanoid, sztuczny uśmiech):
> "Witamy w HyperMart Galaktycznym! Czy zainteresowałby Pana nasz program lojalnościowy 'ŚMIECIARZ PREMIUM' z 0.3% zwrotem na paliwo w nieparzyste wtorki?"

Quest (krótki, nie zagadka): *"Proszę podpisać tę klauzulę w 17 miejscach. Ostrożnie — jeśli Pan podpisze samym inicjałem, zrzekamy się Pana duszy oraz 23% drugich kończyn."*

Rozwiązanie: w dialogu 3 choice — podpisać pełnym nazwiskiem (OK, exit unlock), podpisać inicjałem (żart: portret panicked + "Pan właśnie zrzekł się duszy. Dziękujemy za lojalność. Kontynuacja możliwa." → exit unlock, ale sekretne flag "soldHisSoul" do endingu), odmówić (loop: officer prosi ponownie, 3 razy, potem sam akceptuje odmowę "okej, to zrobimy to bezumownie").

#### Shareable moment P2 — "Butelki z Ziemi"

Po 5 poprawnych skanach na taśmę wjeżdża klient (NPC nienazwany, pixel art staruszka) z **30 butelkami KBK-3 z inventory gracza** (jeśli zrobił quest Zenka — warunkowo; jeśli nie, normalny klient).

System ekran:
```
BŁĄD 418: OBIEKT PRZESTARZAŁY
Kategoria: DEPRECATED-EARTH-CATALOG
Akcja zalecana: ODMÓW
```

3 choice dla gracza:
1. **Odmów** → Officer 4782-B: "Doskonała decyzja. Państwa lojalność wzrasta."
2. **Przepisać jako "RECYKLOWANE ALTERNATYWNE CONTAINERS — EKO LINIA 2049"** → system akceptuje! Wypłata: **0.02 ₢** + achievement "Pan z Ziemi" (widoczny w rogu ekranu)
3. **Zgłoś do Supervisora** → loop przez 3 supervisorów, każdy wyższy, ostatni: "To sprawa dla Supervisora Najwyższego Arbitra Śmieci, proszę zachować butelki na P4." (easter egg przygotowujący P4)

**Screenshot moment:** system ekran z `BŁĄD 418` + przeliczenie **30 butelek → 0.02 ₢** widoczne jako "$0.02 ČA$HBACK!" w jaskrawym żółtym.

---

### Planeta 3 — FLARGLEBLOOP-IV (Slapstick / Futurama)

**Tło:** pixel art obcej planety — fioletowe niebo, cyjanowe rośliny-macki, stacja śmieciowa w kształcie trzech oczu.

**Mini-game: Segregacja kosmicznych śmieci wg koloru.** Drag-drop przedmiotów do 4 koszy: `ŻÓŁTY` / `BARDZO ŻÓŁTY` / `NAPRAWDĘ ŻÓŁTY` / `NIE-ŻÓŁTY`.

**Twist:** reguły kolorów są **nonsensowne** i **zmieniają się co 20 sekund**. Np.:
- [0-20s] "NAPRAWDĘ ŻÓŁTY znaczy żółty z fioletem"
- [20-40s] "BARDZO ŻÓŁTY znaczy żółty z zielonymi kropkami. NAPRAWDĘ ŻÓŁTY teraz znaczy cyjan."
- [40-60s] "Wszystko teraz NIE-ŻÓŁTE. Poza żółtym. Ale ten żółty jest BARDZO ŻÓŁTY."

Gracz nie może "wygrać" idealnie — ma ~50% trafień niezależnie od wysiłku. To jest zamierzone (żart).

**NPC — Blorgonauta Xyzzy** (trzy oczy, macka, pixel art):
> "BLURFLE! Moja żona mnie opuściła dla radiatora od lodówki! Pomożesz mi ją odzyskać?? Mam na myśli żonę, nie radiator! ...Chociaż radiator też ładny."

Quest: *"Zdobądź mi surowiec NAPRAWDĘ ŻÓŁTY PODCZAS WTORKU. Albo jakikolwiek kamień. Ja już nie pamiętam po co."*

Rozwiązanie: dowolne. **Każda decyzja akceptowana.** Dowolny przedmiot w inventory → Blorgonauta: "O, idealne. Chyba. To chyba żona. Dziękuję!"

#### Shareable moment P3 — "Żona albo radiator"

W trakcie sortowania (po ~10 przedmiotach) Blorgonauta przerywa dialogiem overlay:
> "BLURFLE! Moja żona wróciła! Była w kategorii NAPRAWDĘ ŻÓŁTE. Chcesz moją żonę?"

Choice:
1. **Tak, wezmę żonę** → Blorgonauta: "Dobra decyzja. Żona jest w twoim inventory. Jest to radiator. Żegnaj."
2. **Nie, dzięki** → Blorgonauta: "Ok, ale weź chociaż radiator. On jest w kategorii BARDZO SMUTNY." → **radiator w inventory**
3. **Obie rzeczy?** → "BLURFLE. Jesteś chciwy. Respekt." → radiator + "żona" (czyli drugi radiator) w inventory

**Screenshot moment:** portret Blorgonauty (3 oczy, macka) + dialog + ikona radiatora w inventory. Radiator pojedzie do P4 jako quest item opcjonalny.

---

### Planeta 4 — STACJA KOŃCOWA (Mix / meta-finale)

**Tło:** pixel art wielkiej, pustej sali tronowej. Na tronie siedzi **Arbiter Śmieci** — gigantyczna postać w płaszczu, pompa, pixel art w stylu retro-RPG boss.

**Mini-game: Meta-sortowanie życia.** Drag-drop **wszystkich przedmiotów z inventory gracza** (formularze z P1, kupony z P2, butelki, radiator od Blorgonauty, itp.) do 4 kategorii **nonsensownych**:

- `RZECZY ZEBRANE W LEWEJ RĘCE`
- `RZECZY KTÓRE PAMIĘTASZ Z DZIECIŃSTWA`
- `RZECZY FIOLETOWE (W SENSIE METAFIZYCZNYM)`
- `PORTFEL NAJWYŻSZEGO ARBITRA`

**Twist:** **Arbiter akceptuje wszystko**, niezależnie od wyboru gracza. Każda kategoria → identyczna reakcja: *"Tak, to tu. Doskonale."*

**Zagadka #2 — Zagubiony portfel Arbitra.**

Przed mini-gamem Arbiter mówi:
> "Wędrowcze, po tylu planetach przybyłeś by spotkać MNIE. Jestem najwyższym arbitrem śmieci we wszechświecie. Mam dla Ciebie quest ostateczny. Epicki. Przynieś mi... **MÓJ ZAGUBIONY PORTFEL**. Zostawiłem go w nebuli."

PuzzleScene — sala Arbitra z klikalnymi hotspotami:
- **Tron** — "nic"
- **Pompa** — "pompa Arbitra pompuje"
- **Szuflada pod tronem** — **portfel jest tutaj** (Arbiter zapomniał)
- **Paragon z 1987 na podłodze** — "Arbiter widocznie lubi herbatę"
- **Zdjęcie wklejone w formularzu** (z inventory gracza, formularz Heleny z P1) — "Arbiter i Helena? Romans?"
- **Kupon HyperMart** (z P2) — "Arbiter robił zakupy"

Żeby znaleźć portfel, gracz musi kliknąć:
1. Tron → nic
2. Pompa → nic
3. Szufladę → "zamknięta"
4. Poszlaki (paragon, zdjęcie, kupon) → otwierają dialog z Arbitrem: "Ach, Pan wie że robię zakupy? Że lubię herbatę? Że znam Helenę?" → portret panicked Arbitra
5. Po 3 poszlakach → szuflada "odblokowana"
6. Klik szuflady → portfel

Gracz wraca z portfelem → Arbiter: *"Ach. No tak. Spoko. Numerek ma pan?"*

#### Shareable moment P4 — Finale meta-żart

Po zagadce + meta-sortowaniu Arbiter mówi:
> "Oczekiwałeś finalnego bossa? Paragonu za zwycięstwo? Odznaki? Nie. Twoim nagrodą jest..."

Pokazuje okienko z numerkiem: **`00847`**
> "Proszę wrócić na BIUROKRACJĘ-7, okienko 12, po odbiór."

Choice:
1. **Iść po odbiór** → Okienko 12 wciąż nie istnieje. Gra się **kończy**.
2. **Odmówić** → "Dobrze. To Pan przepada. Jak wszyscy śmieciarze. Następny!" → Gra się **kończy**.

**Ekran końca:**
```
KONIEC

Gratulacje.
Nie jesteś wybrańcem.
Jesteś śmieciarzem.

(serio. to koniec. nie czekaj na post-credits.
to nie jest gra Marvela.)
```

**Jeśli gracz czeka 30s** na tym ekranie, wchodzi Helena:
> "Pan jeszcze tu? Ja już kończę dniówkę. Niech pan zamknie."

→ `window.close()` (lub redirect na stronę "do widzenia" jeśli przeglądarka nie pozwala zamknąć)

**Brak infinite mode. Brak NG+. Brak post-credits.** To jest świadomy design — żart domknięty.

**Screenshot moment:** numerek `00847` + text "Jesteś śmieciarzem" widoczny jednym ekranem.

---

### Inventory cross-planet

Przedmioty zbierane na wcześniejszych planetach przechodzą do następnych:
- Butelki KBK-3 (P1) → użyte w shareable P2
- Formularz Heleny z zdjęciem (P1) → użyty w zagadce P4
- Kupony HyperMart (P2) → użyte w zagadce P4
- Radiator od Blorgonauty (P3) → nic funkcjonalnego, ale można go "sortować" w P4 (żart)

---

## 5. Architektura techniczna

### Struktura projektu

```
apka-test/
├── index.html, package.json, tsconfig.json, vite.config.ts
├── public/
│   ├── sprites/
│   │   ├── portraits/        (NPC + player + moodów)
│   │   ├── planets/          (tła 4 planet)
│   │   └── items/            (ikony formularzy, produktów, śmieci)
│   └── audio/music/          (chiptune loop — 1-4 pliki)
├── src/
│   ├── main.tsx, App.tsx, index.css
│   ├── components/
│   │   ├── SortingStation/
│   │   │   ├── Workstation.tsx          # drag-drop logic
│   │   │   ├── RulesPanel.tsx
│   │   │   ├── DropZones.tsx
│   │   │   └── PortraitMood.tsx
│   │   ├── PuzzleScene/
│   │   │   ├── Hotspot.tsx
│   │   │   ├── Inventory.tsx
│   │   │   └── PuzzleRouter.tsx         # per-puzzle logic
│   │   ├── DialogScene/
│   │   │   ├── DialogBox.tsx
│   │   │   ├── ChoiceButton.tsx
│   │   │   └── PortraitFrame.tsx
│   │   ├── Screens/
│   │   │   ├── TitleScreen.tsx
│   │   │   ├── TransitScreen.tsx
│   │   │   ├── DayEndScreen.tsx
│   │   │   └── EndScreen.tsx
│   │   └── UI/                          # PixelButton, PixelFrame, CRTOverlay
│   ├── state/
│   │   ├── gameStore.ts                 # Zustand root
│   │   ├── sortingSlice.ts              # aktywne sortowanie state
│   │   ├── dialogSlice.ts
│   │   ├── inventorySlice.ts
│   │   ├── persistence.ts               # localStorage (debounced 500ms)
│   │   └── selectors.ts
│   ├── game/
│   │   ├── sortingEngine.ts             # pure fn: (item, rules) => correctZone
│   │   ├── rulesEvolution.ts            # odblokowanie reguł po N sortowaniach
│   │   ├── questLogic.ts
│   │   └── dayEndCalc.ts
│   ├── audio/
│   │   ├── sfx.ts                       # Web Audio API (stempel, skan, ding, error)
│   │   └── music.ts                     # <audio> tag controller, crossfade
│   ├── content/
│   │   ├── planets.ts
│   │   ├── npcs.ts
│   │   ├── dialogs/                     # per-NPC dialog trees (TS, nie JSON)
│   │   ├── quests.ts
│   │   ├── puzzles/
│   │   │   ├── formularzF17B.ts
│   │   │   └── arbiterWallet.ts
│   │   ├── sortingRules/
│   │   │   ├── biurokracja7.ts
│   │   │   ├── hyperMart.ts
│   │   │   ├── flargleBloop.ts
│   │   │   └── stacjaKoncowa.ts
│   │   └── items.ts                     # wszystkie przedmioty (formularze, butelki, itp.)
│   ├── types/
│   │   ├── game.ts
│   │   ├── sorting.ts
│   │   └── puzzle.ts
│   └── utils/rng.ts, format.ts
└── docs/superpowers/specs/
    └── 2026-04-22-retro-space-clicker-design.md
```

**Zasada:** content w `src/content/` w **TS** (autocomplete, type-check refów).

### Core types

```ts
// types/sorting.ts
type SortingItem = {
  id: string;
  displayName: string;
  iconSprite: string;
  attributes: Record<string, string | number | boolean>;  // cechy per planeta
  // np. formularz: { numer: "F-17/B", pieczatka: "niebieska", data: "parzysta", ... }
};

type SortingZone = {
  id: string;                            // "akcept" | "odrzut" | "przekaz"
  label: string;
  color: string;
};

type SortingRule = {
  id: string;
  description: string;                   // ludzki tekst (pokazany w panelu)
  unlockAfter: number;                   // po ilu poprawnych sortowaniach się odblokowuje
  evaluate: (item: SortingItem) => string;  // zwraca ID poprawnej zony
};

type SortingScene = {
  id: string;
  planetId: string;
  quota: number;                         // np. 25 poprawnych
  itemPool: SortingItem[];               // skończona pula (nie infinity)
  zones: SortingZone[];
  rules: SortingRule[];                  // evolve'ujące
  interruptions: Interruption[];         // dialogi lub quest triggery po N poprawnych
};

type Interruption = {
  afterCorrect: number;                  // po którym poprawnym się odpala
  type: 'dialog' | 'puzzle' | 'shareable';
  payload: { npcId?: string; puzzleId?: string; };
};

// types/game.ts
interface GameState {
  // Main mode = main screen. Dialog/puzzle to OVERLAYE nad main modem (patrz §12.2 — decyzja architektoniczna)
  mode: 'title'|'intro'|'sorting'|'transit'|'dayEnd'|'end';
  overlayMode: 'none'|'dialog'|'puzzle';

  // Player
  credits: number;
  portraitMood: 'normal'|'tired'|'greedy'|'surprised'|'panicked';
  inventory: Record<string, number>;     // itemId -> qty (cross-planet)

  // Progression
  currentPlanetId: string;
  completedSceneIds: string[];
  completedQuestIds: string[];
  activeQuestIds: string[];
  puzzleProgress: Record<string, PuzzleState>;

  // Scene-specific (tylko active, reszta cleared przy transicie)
  sortingState?: {
    sceneId: string;
    itemsRemaining: SortingItem[];
    currentItem: SortingItem | null;
    correctCount: number;
    errorCount: number;
    unlockedRuleIds: string[];
  };
  dialogState?: {
    npcId: string;
    nodeId: string;
  };

  // Flags (dla endingu i easter eggs)
  flags: {
    soldHisSoul?: boolean;
    acceptedZenkQuest?: boolean;
    acceptedBlorgonautaWife?: boolean;
    // ...
  };

  // Actions
  sortItem(zoneId: string): void;
  openDialog(npcId: string): void;
  chooseDialog(choiceId: string): void;
  enterPuzzle(puzzleId: string): void;
  clickHotspot(hotspotId: string): void;
  travelToPlanet(planetId: string): void;
  endDay(): void;
  saveGame(): void;
  loadGame(): void;
  resetGame(): void;
}
```

### Sorting engine (kluczowy, pure logic)

```ts
// game/sortingEngine.ts
export function evaluateSortedItem(
  item: SortingItem,
  chosenZoneId: string,
  activeRules: SortingRule[]
): { correct: boolean; expectedZoneId: string } {
  // najwyższy priorytet reguł: ostatnia unlocked (bo ewolucja nadpisuje)
  const sortedRules = [...activeRules].sort((a, b) => b.unlockAfter - a.unlockAfter);
  for (const rule of sortedRules) {
    const expected = rule.evaluate(item);
    if (expected) {
      return { correct: expected === chosenZoneId, expectedZoneId: expected };
    }
  }
  return { correct: false, expectedZoneId: 'akcept' };  // fallback
}
```

**Testable, pure, prosta.** Content (reguły) lives w `content/sortingRules/*.ts`.

### Przepływ (przykłady)

**Sortowanie przedmiotu:**
1. Gracz przeciąga item na zonę → `gameStore.sortItem(zoneId)`
2. Reducer wywołuje `evaluateSortedItem(current, zoneId, activeRules)`
3. Jeśli correct: `correctCount++`, `credits += 2`, SFX `ding`, portrait glance
4. Jeśli incorrect: `errorCount++`, SFX `error`, portrait `panicked` flash
5. Jeśli `correctCount >= quota`: `mode = 'dayEnd'`
6. Jeśli obecny `correctCount` matches interruption trigger: ustaw mode na `dialog`/`puzzle`
7. Inaczej: wyciągnij next item z `itemsRemaining`
8. Debounced save

**Dialog choice:**
1. `ChoiceButton` → `chooseDialog(choiceId)`
2. Reducer: aplikuj effects (add item, set flag, complete quest), ustaw `dialogState.nodeId`
3. Jeśli `nextNode = null` → powrót do poprzedniego modu (sorting zazwyczaj)

**Puzzle hotspot click:**
1. `Hotspot.onClick` → `clickHotspot(hotspotId)`
2. Reducer: sprawdza `puzzleProgress[puzzleId].unlockedHotspots`, aplikuje effect (dialog / add item / unlock)
3. Jeśli puzzle solved → advance quest state, return to sorting

### Error handling

- **localStorage zablokowany** → fallback in-memory + banner "save niedostępny (tryb prywatny?)"
- **Audio 404** → cicho, bez crash (pusta Promise)
- **Content ref zepsuty** → fail w compile (TS) + runtime fallback: "Błąd contentu — pomiń dialog"
- **Save mid-sort** → zapisywany jest `sortingState` w całości, po reload gra wraca do tego samego itema
- **Window blur** → no-op (nie ma już idle ticków bez dronów)

### Testing

- **Vitest** — reducer tests (`sortItem`, `chooseDialog`, `clickHotspot`, `endDay`, `travelToPlanet`)
- **Content validation test** (kluczowy!):
  - Każdy `nextNode` wskazuje istniejący `DialogNode`
  - Każdy `npcId` istnieje w `npcs.ts`
  - Każdy `questId` w dialogu / sortingu istnieje w `quests.ts`
  - **Każda reguła sortowania per planeta pokrywa wszystkie itemy w `itemPool`** (żaden item nie jest niesklasyfikowalny)
  - Każdy hotspot puzzle ma zdefiniowany effect
- **Smoke test** — symulacja pełnej ścieżki P1→P2→P3→P4 z minimum sortowań i wszystkimi questami. Weryfikacja: `mode === 'end'` na końcu.
- **Brak** e2e / Playwright — overkill.

---

## 6. Strategia assetów

### Portrety NPC + gracz

- **MVP:** AI-generated pixel art (Midjourney/DALL-E, prompt: "Doom 1993 pixel art portrait, chunky VGA, 64×64, [style per character]")
- **Zakres:**
  - Gracz: 5 moodów
  - NPC main: 6 (Helena, Zenek, Officer 4782-B, Blorgonauta, Arbiter, + 1-2 side)
  - NPC dialog-only: ~4 (stróż, szwagier Heleny, staruszka z butelkami, supervisorzy)
- **Placeholder fallback:** kolorowe kwadraty z inicjałami, finalne w M7

### Tła planet

- 4 sztuki, 640×400, pixel-VGA. AI-gen lub Aseprite (jeśli masz umiejętność). **Paleta per planeta** (patrz §2 tabela).

### Ikony przedmiotów sortowania

- **P1 formularze:** 5-6 wariantów (różne numery, kolory pieczątek, stemple) — mogą być proceduralnie renderowane z bazowego PNG + CSS tint/overlay
- **P2 produkty:** 10-15 ikon (puszki, butelki, gadgety, usługi) — 16×16 lub 24×24
- **P3 kosmiczne śmieci:** 8-10 abstrakcyjnych kształtów w różnych kolorach — **proceduralnie generowane w Canvas** (kolor + kształt + ornament)
- **P4 meta:** reużycie przedmiotów z P1-P3 z inventory

### Hotspoty puzzle

- Nie potrzeba oddzielnych sprite — hotspoty to **niewidzialne boxy na tle**, cursor zmienia się na pointer. Tooltipy tekstowe.

### Muzyka

- **MVP:** 1 chiptune loop (CC0, OpenGameArt) na całą grę
- **Full:** 4 loops per-planeta (różne vibe-y), crossfade przy transicie
- Budżet: <10 MB total

### SFX (Web Audio API, procedural, zero plików)

- **Stempel** — bass thump (low sine + envelope)
- **Skan** — beep + drobny chirp
- **Ding (correct)** — arpeggio major chord
- **Error** — buzz (sawtooth low + short)
- **Page turn** (dialog) — white noise sweep
- **Day end money count** — rapid beeps (pitched increments)

~70 linii w `audio/sfx.ts`.

---

## 7. Milestones / Build order

Cel: **grywalne od M3**, każdy milestone inkrementalnie testowalny.

1. **M1 — Setup + Sorting engine core** (~1-1.5 dnia)
   - Vite+React+TS+Zustand+Framer Motion boilerplate
   - Pure `sortingEngine` + unit testy
   - Proste 1 scena sortowania (placeholder rules, 5 itemów, console log)

2. **M2 — SortingStation UI kompletny** (~1.5 dnia)
   - Drag-drop workstation
   - RulesPanel z dynamicznym odblokowywaniem
   - Portret + moody + podstawowe SFX (stempel, ding, error)
   - DayEndScreen

3. **M3 — Planeta 1 end-to-end** (~2 dni)
   - Pełna zawartość BIUROKRACJI-7: 25-itemowy pool formularzy, 5 reguł evolve, dialog Heleny, dialog Zenka, side-quest butelki
   - Zagadka #1 (F-17/B) — PuzzleScene + hotspoty + inventory
   - Save/load localStorage
   - **Potwierdza architekturę.** Reszta = copy-paste z innym contentem.

4. **M4 — Planety 2, 3, 4 mini-games + questy** (~3-4 dni)
   - P2 SkanKasy (reguły, produkty, shareable Butelki z Ziemi)
   - P3 SegregacjaKolorów (chaotic rules, Blorgonauta shareable)
   - P4 MetaSortowanie + zagadka portfela + meta-ending
   - Cross-planet inventory pass-through

5. **M5 — Polish narracyjny + shareable moments** (~1-1.5 dnia)
   - Wszystkie 4 shareable moments domknięte (triggery, overlaye, voice-over tekst)
   - Ekran końca + 30s delay + Helena-close
   - Hook boot screen + intro

6. **M6 — Audio complete** (~0.5 dnia)
   - SFX dla wszystkich akcji (~6 dźwięków)
   - 1 chiptune loop (lub 4 jeśli znajdziesz)

7. **M7 — Visuals polish** (~1-1.5 dnia)
   - Finalne portrety (podmiana z placeholderów)
   - Framer Motion animacje (slide-in itemów, stempel press)
   - Per-planeta paleta + CSS scanlines + CRT glow toggle

8. **M8 — Playtest + fix + deploy** (~1-1.5 dnia)
   - **Playtest z 4 osobami** (patrz §10)
   - Iteracja na podstawie feedback (balans reguł, tempo, czytelność)
   - Content validation test, smoke test
   - `npm run build` + Netlify Drop

**Razem:** ~11-14 dni intensywnej pracy. Target 1-2h gameplay realny przy tym scopie.

---

## 8. Definition of Done (MVP)

Gra jest "skończona" kiedy:

- [ ] 4 planety grywalne (każda: mini-game sortowania z ewoluującymi regułami + ≥1 NPC z dialogiem + quest exit-blocker)
- [ ] 2 zagadki (F-17/B + portfel Arbitra) rozwiązywalne i testowane
- [ ] 4 shareable moments trigger się poprawnie i są **screenshot-worthy** (potwierdzone w playteście)
- [ ] Cross-planet inventory działa (butelki, formularz Heleny, kupony, radiator przepływają)
- [ ] Save/load w localStorage — odświeżenie mid-sort kontynuuje tam gdzie było
- [ ] Audio: 6 SFX procedural + ≥1 chiptune loop działają
- [ ] Ekran końca + 30s Helena-close działa
- [ ] Hook boot screen + intro (<30s do pierwszego sortowania)
- [ ] Content validation test przechodzi (wszystkie reguły pokrywają wszystkie itemy)
- [ ] Smoke test P1→P4 → `mode === 'end'`
- [ ] **Playtest z 4 osobami wykonany, feedback zaimplementowany** (patrz §10)
- [ ] `npm run build` → deploy na Netlify Drop → link działa na świeżej przeglądarce

---

## 9. Deploy

**Proces:**
1. `npm run build` → `dist/` (statyczne HTML+JS+CSS)
2. Drag-drop `dist/` na [Netlify Drop](https://app.netlify.com/drop) → link za ~10s
3. Alternatywy: GitHub Pages, Vercel, itch.io (**itch.io polecany** dla gier — social discovery)

**Link = shareowalny.** Zero instalacji, zero konta.

---

## 10. Playtest plan

**Kluczowy etap.** Gra komediowa bez playtestu to ślepy strzał. Masz 4 testerów — używamy wszystkich.

### Kiedy

- **Po M5** (narracja kompletna, polish niedokończony) — **1 tester, wczesny smoke test.** Weryfikacja że gra jest ukończalna, że podstawowe żarty ładują, że reguły sortowania są zrozumiałe
- **Po M7** (visuals + audio domknięte) — **3 testerów, pełny playtest.** Każdy niezależnie, **bez twojego nadzoru**

### Jak

**Metoda:** record screen + think-aloud (tester mówi co myśli podczas grania). Alternatywa: po sesji 15-min wywiad ze standardowymi pytaniami.

### Co mierzyć

**Feel (ilościowo):**
- Czas ukończenia (powinien być 60-120 min)
- Ile osób dotarło do końca (target: 4/4; jeśli ktoś odpadł — w którym miejscu?)
- Ile razy tester musiał się cofnąć / restart sceny

**Humor (jakościowo — najważniejsze):**
- **Który żart wywołał głośny śmiech?** Odnotuj z timestamp (screen recording)
- **Który żart zawiódł?** (tester skonsumował bez reakcji) — do usunięcia lub rewrite
- **Czy któryś screenshot testera wrzucił na Discord/znajomym?** (jeśli tak — to TWÓJ shareable moment, potwierdzony)

**Mechanika:**
- Czy reguły sortowania były **zrozumiałe po 3 itemach**? (Jeśli nie — upraszczamy)
- Czy zagadki były **solvable bez hintów**? Ile razy tester się zablokował?
- Czy tempo było OK? Gdzie się nudził?

### Fix priority

Po playteście priorytet fixów:
1. **Blockers** — gra się wiesza / nie da się ukończyć → fix zawsze
2. **Humor fails** — żart który nie zadziałał u 2+ testerów → rewrite lub wytnij
3. **Tempo** — sceny gdzie testerzy się nudzili >30s → przytnij lub przyspiesz reguły
4. **Reguły niejasne** — jeśli tester ma >30% błędów w scenie → uprość reguły lub dodaj lepsze onboardingowe

**Nie poprawiamy** visualsów w tym etapie (zrobione w M7). Nie dodajemy contentu. Tylko cięcia i rewrity.

---

## 11. Otwarte kwestie / do rozważenia

- **Muzyka per-planeta** — 4 loopy CC0 mogą być trudne do znalezienia w spójnym klimacie. Fallback: 1 loop globalny + ciche loops per planeta jako nice-to-have.
- **Portret mood transitions** — hard-cut w MVP, fade-in w polishowaniu jeśli starczy czasu.
- **Balans reguł sortowania** — ile poprawnych potrzebuje każda planeta? Obecnie target 25 dla P1, 20 P2, 15 P3, 10 P4. **Do weryfikacji w playteście.**
- **Łapówki w dialogach** — czy warto rozbudować system (kredyty = wpływ na choice)? MVP: 2-3 łapówki totalnie, nice-to-have 5+.
- **Achievement "Pan z Ziemi"** i inne flagi — czy widoczne dla gracza? MVP: tylko internal flag, nice-to-have: widoczne w corner notifications.
- **Accessibility** — keyboard controls dla sortowania (liczby 1/2/3 jako shortcuty do stref)? MVP: tylko mouse/touch. Nice-to-have: keyboard.
- **Anti-cheese** — czy ktoś może przyspieszyć przez rush (randomowe klikanie)? Sortowanie z błędami: portret zły, po 5 błędach "zwolniony" → restart sceny? **Rekomendacja:** YES, 5 błędów = restart, to wymusza uwagę i jest śmieszne ("pan nie nadaje się do roboty biurowej").
- **Lokalizacja** — tylko PL w MVP. EN jako eventualny port (cały content to TS, łatwo zduplikować `content/en/`).

---

## 12. Uwagi CTO-marudy — ryzyka i zalecenia

Sekcja "czego autor planu (czyli ja) boi się najbardziej". Zachowaj w pamięci podczas implementacji.

### 12.1 Ryzyka projektowe (meta)

- **Plan jest papierem.** Dopóki nie działa M3 (Planeta 1 end-to-end), wszystko może się posypać przy pierwszym kontakcie z rzeczywistością. Nie traktuj "potwierdza architekturę" w M3 jako formalności — to jest **punkt decyzyjny**. Jeśli M3 wyjdzie bolesny, zatrzymaj się i przeplanuj, zanim zaczniesz M4.
- **Humor nie jest testowalny unit testami.** Content validation test powie Ci że refy działają, nie że Pani Helena śmieszy. Playtest z 4 osobami jest **nie-opcjonalny**. Jeśli budżet czasu zje M7 i będzie kusić "wrzucę bez playtestu" — lepiej wyciąć planetę 3 niż pominąć playtest.
- **Scope creep kusi szczególnie w grach.** Każdy żart ma potencjał rozrostu ("dodajmy tylko jeszcze jednego NPCa..."). Trzymaj się 8 NPC i 4 planet. Dodatkowy content = post-MVP update.
- **Balans 25/20/15/10** (poprawnych sortowań per planeta) to liczby wymyślone. Pierwszy playtester może powiedzieć że P1 to nuda po 15, a P3 się kończy zanim zrozumiał reguły. **Zrób te liczby łatwe do zmiany** — stałe w `content/planets.ts`, nie hardcoded w komponentach.
- **"Średni" = 11-14 dni intensywnie.** W praktyce dla projektu na boku to **3-4 tygodnie kalendarzowe**. Nie obiecuj sobie tygodnia.

### 12.2 Ryzyka architektoniczne (technical)

**State management — największe ryzyko.**

- **8 modów gry + overlay'e = state machine.** Plan obecnie ma `mode: string union` ale nie opisuje transition rules. Co się dzieje gdy dialog triggeruje się w środku sortowania? Jeśli `mode` skacze na `'dialog'`, tracisz `sortingState`. Masz dwie opcje:
  1. **Stack prevMode** — `modeStack: Mode[]`, `pushMode(newMode)` / `popMode()`. Dialog wchodzi na stos, po zakończeniu wraca do sortowania. Prosty, ale podatny na zapomnienie popa.
  2. **Dialog/puzzle jako OVERLAY, nie mode** — `overlayMode: 'none'|'dialog'|'puzzle'`. `mode` (main) zostaje `'sorting'`. SortingStation renderuje się cały czas, dialog to tylko modal nad nim.
  - **Rekomendacja: opcja 2.** Dialog w sortowaniu to UX'owo overlay. Zapisuj `sortingState` zawsze gdy `mode === 'sorting'`, niezależnie od overlay.
- **Interruption re-trigger po save/load.** Jeśli zapiszesz w połowie dialogu wywołanego po 5. poprawnym sortowaniu i załadujesz — `correctCount === 5` i interruption odpali się ponownie. Potrzebny `firedInterruptionIds: string[]` w `sortingState`, dopisywany przy odpaleniu.
- **Slicing Zustand.** Plan ma `sortingSlice`, `dialogSlice`, `inventorySlice` — Zustand wspiera ten wzorzec, ale wymaga dyscypliny przy typowaniu. Użyj oficjalnego [slices pattern](https://zustand.docs.pmnd.rs/guides/slices-pattern) od M1, nie wciskaj potem. W przeciwnym razie skończysz z 500-liniowym `gameStore.ts` który nikt nie chce otwierać.

**Drag-drop — potencjalna pułapka UX.**

- Plan mówi "HTML5 native drag-drop, bez biblioteki". **To pułapka na mobile.** HTML5 DnD API **nie działa na touch devices**. Jeśli gra ma trafić na telefony (Netlify Drop link będzie otwierany gdziekolwiek), potrzebujesz touch events.
- **Rekomendacja:** `dnd-kit` (~15 KB, touch + mouse + keyboard). Albo `react-dnd` z `HTML5Backend` + `TouchBackend`. Bez tego ~40% graczy odpadnie na ekranie sortowania.
- **Alternatywa** dla radykalnego uproszczenia: **klik zamiast drag**. Tap na przedmiot → tap na zonę. Działa wszędzie, bez biblioteki. Mniej "feel" ale bullet-proof.

**Audio lifecycle — nie zapomnij.**

- Web Audio API wymaga **user gesture** do inicjalizacji `AudioContext`. Plan tego nie mówi. Jeśli zainicjalizujesz audio w `main.tsx`, Chrome zablokuje.
- **Musi być inicjalizowane na pierwsze kliknięcie TitleScreen** ("PRESS ANY KEY" → `audioCtx = new AudioContext()`).
- iOS/Safari: AudioContext suspenduje się gdy zmieniasz kartę. Musisz resume'ować na powrót focusu. `document.addEventListener('visibilitychange', () => audioCtx.resume())`.
- Bez tego: dźwięki "znikają" po zmianie karty, bug frustrujący dla playtesterów.

**Save/load — edge cases.**

- Zapisuj **materialized `itemsRemaining`** (pełną kolejkę przedmiotów), nie seed RNG. Load nie powinien regenerować kolejki — inaczej gracz zobaczy inny item po reload niż przed.
- Zapisuj `firedInterruptionIds` (patrz wyżej).
- Zapisuj stan zagadek per-puzzle (`puzzleProgress[id].unlockedHotspots`, `hintsRevealed`).
- **Wersjonuj save.** `localStorage['kosmiczny-smieciarz:v1']`. Jak zmienisz schema w przyszłości, sprawdź wersję i albo migruj albo pokaż "stary save, niestety reset".

**Rules.evaluate — null fallback.**

- Plan ma `evaluate: (item) => string` (zwraca ID zony). Obecny fallback "akcept" jest cichy. **Zmień na `(item) => string | null`** i dodaj explicit fallback w engine. Jeśli żadna reguła nie matchuje, log warning + content validation test łapie to.

**Dynamic itemPool — cross-planet inventory.**

- P2 shareable moment "Butelki z Ziemi" **wymaga warunkowego wstawienia** klienta z butelkami do itemPool, jeśli gracz zrobił quest Zenka. Plan ma `SortingScene.itemPool: SortingItem[]` jako statyczny.
- **Refactor:** `itemPool: (state: GameState) => SortingItem[]`. Pool to funkcja od stanu, nie stała. Materializuj raz na początku sceny.

**Error boundaries.**

- Plan nie ma React ErrorBoundary. Gdy jakikolwiek komponent crashuje (np. missing sprite, zepsuty content ref w runtime), cały ekran = white screen of death.
- **Wrap** każdy z głównych trybów (`SortingStation`, `DialogScene`, `PuzzleScene`) w ErrorBoundary z fallbackiem "coś się zepsuło, [reset sceny]".

**Portrait mood — computed, nie imperative.**

- Mood powinien być **derived z stanu** (`selectPortraitMood(state)`), nie setowany imperatywnie w akcjach. Inaczej skończysz z 15 miejscami w kodzie wołającymi `setPortrait('tired')` i trudno śledzić invarianty.
- Logika: `if (fuel<20) tired; else if (credits>1000) greedy; else if (recentError) panicked; else if (recentRareDrop) surprised; else normal`. Pure fn, używana w selektorze.

**Settings (scanlines, audio mute).**

- Plan wspomina "CSS scanlines togglowalne" ale nie ma SettingsScreen w trybach. Dwie opcje:
  1. **Keyboard shortcut** — F1 toggle scanlines, M toggle audio. Retro-DOS wibuje, minimal UI.
  2. **Settings mode** — dodatkowy tryb 'settings', przycisk w TitleScreen i corner na innych ekranach.
- **Rekomendacja: 1.** Tańsze, pasuje do DOS-retro feel, zgodne z parodyjnym duchem ("sekretne klawisze dla pros").

**TypeScript strict.**

- Plan nie deklaruje. **Ustaw `strict: true` od M1**, ze `strictNullChecks`, `noImplicitAny`, `noUncheckedIndexedAccess`. Zapłacisz ~10% czasu na więcej typowania, oszczędzisz ~30% czasu na debugowanie undefined.

**Content validation test — kiedy ran.**

- Vitest w `npm test`. **Pre-commit hook** (Husky) nie jest konieczny dla solo projektu, ale CI (GitHub Actions) wart 5 minut setupu — catch regresji z automatu.

### 12.3 Czego w planie celowo NIE MA (YAGNI)

Flagowane, żeby później nie dostawać wyrzutów sumienia że "brakuje":

- **Achievements system** — flagi internal są, UI achievement toastów nie. Dodanie = post-MVP.
- **Analytics / telemetry** — nie śledzimy graczy. Jeśli chcesz "ile % doszło do P4?", post-MVP dodasz beacon.
- **Mute button w UI** — keyboard M wystarczy na MVP.
- **i18n / EN port** — struktura contentu to ułatwia, ale nie robimy teraz.
- **Cloud save / accounts** — localStorage wystarczy. Jeśli gracz przesiądzie się na inny komputer, gra zaczyna od nowa. To jest 1-2h gra, nie Skyrim.
- **Mobile layout tweaks** — drag-drop touch (jeśli użyjesz dnd-kit) + responsive CSS powinny wystarczyć. Dedykowany mobile UI = post-MVP.
- **Sound settings (volume slider)** — master mute wystarczy.

**Zasada:** każde z powyższych to 1-3 dni pracy, którego **nie budżetuje plan**. Jeśli ktoś (albo Twoja własna głowa po M4) powie "dodajmy achievements" — odpowiedź: post-MVP.

### 12.4 Top 3 "jeśli coś pójdzie źle, to tutaj"

1. **Mode transitions spaghetti** (dialog w sortowaniu, puzzle z dialogu, etc.) — rozwiąż w M2 zanim będzie za późno. Overlay pattern od początku.
2. **Touch support drag-drop** — odkryjesz to na playteście z 2/4 testerów grających na telefonie. Użyj dnd-kit od M2 albo zrób klik-based sortowanie.
3. **Humor fail na playteście** — 30% żartów może nie zadziałać. Zaplanuj **48h buffer** po M8 na rewrite tekstów. Nie wrzucaj bez tego buffera na deploy.

### 12.5 Decyzje architektoniczne podjęte (2026-04-22)

Podjęte przed M1, żeby nie wracać do nich później. Jeśli coś się posypie przy implementacji, wróć do tej listy zamiast wymyślać na nowo.

| Kwestia | Wybór | Dlaczego |
|---------|-------|----------|
| Drag-drop | **dnd-kit** | touch + mouse + keyboard z jednej biblioteki; gra leci przez Netlify link, więc mobile = must |
| Mode vs overlay | **Overlay pattern** — dialog/puzzle są modalami nad `mode: 'sorting'` | zachowuje sortingState przy otwarciu dialogu; nie trzeba stosować mode stacka |
| Settings UX | **Keyboard shortcuts** (F1 = scanlines toggle, M = audio mute) | retro-DOS wibuje, minimal UI, nie wymaga oddzielnego SettingsScreen |
| TS strict | **ON od M1** (`strict`, `strictNullChecks`, `noUncheckedIndexedAccess`) | catch undefined bugs wcześnie |
| Save key | `localStorage['kosmiczny-smieciarz:v1']` + schema version check | tania asekuracja na zmiany schema |
| Audio init | W TitleScreen **"PRESS ANY KEY"** handler tworzy `AudioContext` + resume on `visibilitychange` | autoplay policy Chrome/Safari; iOS focus loss recovery |
| Rules.evaluate | Zwraca `string \| null`, fallback explicit w engine | content validation test łapie niepokryte itemy |
| itemPool | `(state) => SortingItem[]`, materializowane raz na początku sceny | P2 shareable z butelkami wymaga warunku od inventory |
| Error boundaries | Wrap każdego z głównych trybów (`SortingStation`, `DialogScene`, `PuzzleScene`) | uniknąć white screen przy runtime crashu |
| Portrait mood | Computed selector (pure fn od state), nie imperatywne `setPortrait` | jedno źródło prawdy, brak rozbieganego stanu |
| State slices | Zustand [slices pattern](https://zustand.docs.pmnd.rs/guides/slices-pattern) od M1 | uniknąć 500-liniowego `gameStore.ts` |
| Testowanie CI | Vitest w `npm test`, CI przez GitHub Actions jeśli repo publiczne | automatyczne catch content regression |

**Zasada**: żadna z tych decyzji nie jest "experimental" — jeśli coś sprawia ból w M1-M2, refactor lokalny, nie podważaj stosu.

