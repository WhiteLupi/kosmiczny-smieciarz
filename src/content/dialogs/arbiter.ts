import type { DialogTree } from '@/types/dialog';

export const arbiterIntroDialog: DialogTree = {
  who: 'ARBITER ŚMIECI',
  portrait: 'arbiter',
  start: 'i_start',
  nodes: {
    i_start: {
      txt: 'Wędrowcze, po tylu planetach przybyłeś by spotkać MNIE. Jestem najwyższym arbitrem śmieci we wszechświecie. Mam dla Ciebie quest ostateczny. Epicki. Przynieś mi... MÓJ ZAGUBIONY PORTFEL. Zostawiłem go w nebuli.',
      choices: [{ text: 'Spróbuję go znaleźć.', go: null, effect: 'arbiter_offer_quest' }],
    },
  },
};

export const arbiterDrawerLockedDialog: DialogTree = {
  who: 'ARBITER ŚMIECI',
  portrait: 'arbiter',
  start: 'd_locked',
  nodes: {
    d_locked: {
      txt: 'Szuflada zamknięta. Trzeba wpierw rozumieć, kim jest Arbiter. Niech pan się rozejrzy. Trzy poszlaki wystarczą.',
      choices: [{ text: '[rozglądam się]', go: null }],
    },
  },
};

export const arbiterFinaleDialog: DialogTree = {
  who: 'ARBITER ŚMIECI',
  portrait: 'arbiter',
  start: 'f_start',
  nodes: {
    f_start: {
      txt: 'Ach. No tak. Spoko. Numerek ma pan?',
      choices: [{ text: 'Numerek?', go: 'f_offer' }],
    },
    f_offer: {
      txt: 'Oczekiwałeś finalnego bossa? Paragonu za zwycięstwo? Odznaki? Nie. Twoją nagrodą jest... 00847. Proszę wrócić na BIUROKRACJĘ-7, okienko 12, po odbiór.',
      choices: [
        { text: 'Iść po odbiór.', go: null, effect: 'arbiter_finale_choose_collect' },
        { text: 'Odmówić.', go: null, effect: 'arbiter_finale_choose_refuse' },
      ],
    },
  },
};
