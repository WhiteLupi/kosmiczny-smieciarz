# Kosmiczny Śmieciarz

Przeglądarkowa narracyjna parodia hero complexu w grach. Sortuj formularze i odpady kosmiczne wg absurdalnych ewoluujących reguł, rozmawiaj z Panią Heleną i Arbitrem Śmieci, znajdź zagubiony portfel — i dowiedz się, że nie jesteś wybrańcem.

## Run

```bash
npm install
npm run dev          # → http://localhost:5173
```

## Build & deploy

```bash
npm run build        # → dist/ (≈ 18 KB CSS + 230 KB JS)
npm run preview      # local preview of production build
```

Dla deployu: drag-drop `dist/` na [Netlify Drop](https://app.netlify.com/drop) — link gotowy w ~10s. Alternatywy: GitHub Pages, Vercel, itch.io.

## Tests

```bash
npm test             # Vitest unit + integration (36 tests)
npm run typecheck    # TS strict
```

## Stos

Vite + React 18 + TypeScript strict + Zustand + dnd-kit + Framer Motion + Web Audio API + localStorage.

## Pełna ścieżka rozgrywki

1. **Boot DOS** — typing animation 4 linijek + prompt `Continue? [T/N]`
2. **Title** — logo "KOSMICZNY ŚMIECIARZ" 3D pixel + 60 migoczących gwiazdek
3. **Planeta 1 — BIUROKRACJA-7** — sortownia formularzy z 5 ewoluującymi regułami, side-quest Zenka (po 5 sortowaniach), test Pani Heleny (po 6 poprawnych + r5 odblokowane)
4. **Zagadka F-17/B** — alternatywna ścieżka via przycisk "ROZWIĄŻ ZAGADKĘ" w panelu questa: 6 hotspotów, łańcuch F-3 → F-9 → 5×F-17/B
5. **Day End** — brzęczące cyfry, wypłata 2 ₢/szt + premia Heleny 20 ₢
6. **Transit** — statek + sliding stars (2.8s, palette swap → P4)
7. **Arbiter Śmieci** — quest portfela
8. **Wallet PuzzleScene** — 7 hotspotów, znajdź 3 poszlaki → otwórz szufladę
9. **Finale** — KONIEC. + numerek 00847 + Helena slide-in po 6s ("Numerek pan ma?")

## Sterowanie

- **1/2/3** — strefy AKCEPT/ODRZUT/PRZEKAŻ (lub odpowiedniki per planeta)
- **drag-drop** karty na strefę (touch + mouse)
- **1-4** w dialogu — wybór odpowiedzi
- **klik tekst** w dialogu — skip typewriter
- **F1** — toggle CRT scanlines
- **M** — mute SFX
- **⚙ TWEAKS** (top-right) — paleta, tempo reguł, mood override, SKIP DO FINAŁU
- **Tabs** (bottom-left) — skok między P1/P2/P3/P4/FINAŁ (debug/showcase, palette swap)

## Save/load

Stan gry zapisuje się automatycznie w `localStorage['kosmiczny-smieciarz:v1']` (debounced 500 ms). Reload strony kontynuuje na tym samym przedmiocie sortowania. Zmiana schema → version check → reset.

## Wizualne źródło

- `docs/design-handoff/prototype.html` — interaktywny prototyp HTML (P1 high-fi reference)
- `docs/design-handoff/README.md` — brief implementacyjny od Claude Design
- `docs/design-handoff/design_doc.md` — pełny design dokument v2
- `docs/superpowers/specs/2026-04-22-retro-space-adventure-design.md` — spec gameplay/content

## Architektura

- **Stan:** Zustand z slices pattern (`mode`, `sorting`, `dialog`, `puzzle`, `inventory`, `flags`, `tweaks`)
- **Overlay:** dialog/puzzle to overlaye nad `mode: 'sorting'`, **nie** osobne tryby — zachowują `sortingState`
- **Engine:** czysta funkcja `evaluateItem` (`src/game/sortingEngine.ts`) — najwyższy priorytet ma ostatnia odblokowana reguła, fallback do r1
- **Audio:** AudioContext tworzony na pierwszy user gesture (`ensureAudio()`), `visibilitychange.resume()` dla iOS/Safari
- **Drag-drop:** `@dnd-kit/core` (touch + mouse + keyboard z jednej biblioteki)
- **Pixel art:** 9 portretów NPC + gracza jako 16×16 string grids renderowane na `<canvas>`
- **SFX:** 6 procedural Web Audio (stempel, ding, error, page, skan, coin), zero plików audio

## Co celowo NIE jest zrobione (out-of-scope per design-scoped)

- Pełne mini-gry P2/P3/P4 (są tylko jako preview tabs — palette swap + label swap)
- Officer 4782-B / Blorgonauta dialogi i questy
- Cross-planet inventory dla butelek/kuponów (P2/P3 nie mają full gameplay)
- Anti-cheese (5 błędów = restart sceny)
- Achievements / analytics / mute slider
- 4 chiptune loops per planeta (tylko procedural SFX)
- Tła planet 640×400 (tylko gradient z palety)
- E2E Playwright suite (browser smoke pokrywa krytyczne ścieżki)

Patrz `docs/superpowers/specs/2026-04-22-retro-space-adventure-design.md` §11-12 dla pełnej listy decyzji.
