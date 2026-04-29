import type { DialogTree } from '@/types/dialog';

export const helenaQuestDialog: DialogTree = {
  who: 'PANI HELENA Z OKIENKA',
  portrait: 'helena',
  start: 'q_start',
  nodes: {
    q_start: {
      txt: 'Pan po formularze F-17/B? Nie ma. Trzeba wyprodukować. Poproszę o pokwitowanie. Ja nie mogę wystawić, bo jestem stroną. Niech pan idzie do stróża.',
      choices: [{ text: 'Zrozumiałem.', go: null }],
    },
  },
};

export const strozDialog: DialogTree = {
  who: 'STRÓŻ',
  portrait: 'pl_tired',
  start: 's_start',
  nodes: {
    s_start: {
      txt: 'Pan po F-17/B? Pokwitowanie pokażcie.',
      choices: [
        { text: '...nie mam.', go: 's_no_pkw', effect: 'puzzle_unlock_szwagier' },
        { text: 'Pokwitowanie F-9.', go: 's_yes_pkw', effect: 'puzzle_solve_f17b', requires: { itemId: 'F-9', count: 1 } },
      ],
    },
    s_no_pkw: {
      txt: 'No to nie ma. Niech pan idzie do szwagra Heleny — on może wystawi F-3 (podanie o pokwitowanie). Bez tego nic z tego.',
      choices: [{ text: '[wracam do biura]', go: null }],
    },
    s_yes_pkw: {
      txt: 'No widzi pan! F-9 to wystarczy — w tej zmianie nie ma F-22, panu się poszczęściło. Proszę, 5 sztuk F-17/B. I więcej tu pan się nie pokazuj.',
      choices: [{ text: '[odebrać]', go: null }],
    },
  },
};

export const szwagierDialog: DialogTree = {
  who: 'SZWAGIER HELENY',
  portrait: 'pl_normal',
  start: 'sz_start',
  nodes: {
    sz_start: {
      txt: 'A, pan z formularzy. Ja dam F-3 (podanie o pokwitowanie). Trzeba mi to potem oddać podpisane. Ale zrobi pan, zrobi.',
      choices: [{ text: 'Wezmę.', go: null, effect: 'puzzle_collect_F3' }],
    },
  },
};

export const okienko12Dialog: DialogTree = {
  who: 'OKIENKO 12',
  portrait: 'pl_panicked',
  start: 'o_start',
  nodes: {
    o_start: {
      txt: 'BRAK. (Klikasz po raz trzeci. Tablica zsuwa się. Pod nią karteczka: "Okienko 12 było likwidowane w 1987.")',
      choices: [{ text: '[zamykam tablicę]', go: null }],
    },
  },
};

export const archiwistaDialog: DialogTree = {
  who: 'ARCHIWISTA',
  portrait: 'pl_greedy',
  start: 'a_start',
  nodes: {
    a_start: {
      txt: 'F-3 wypełnione? Dam panu F-9 (zgoda na pokwitowanie). Ale nie mów pan szwagrowi, że dałem.',
      choices: [
        { text: 'F-3 mam.', go: 'a_swap', requires: { itemId: 'F-3', count: 1 }, effect: 'puzzle_swap_F3_to_F9' },
        { text: 'Jeszcze nie.', go: null },
      ],
    },
    a_swap: {
      txt: 'Bardzo dobrze. F-9 trzymaj pan. Teraz idź do stróża — przyjmie F-9 zamiast F-22, jak nikt nie patrzy.',
      choices: [{ text: '[odebrać F-9]', go: null, effect: 'puzzle_collect_F9' }],
    },
  },
};
