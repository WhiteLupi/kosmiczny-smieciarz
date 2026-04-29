import type { DialogTree } from '@/types/dialog';

export const helenaTestDialog: DialogTree = {
  who: 'PANI HELENA Z OKIENKA',
  portrait: 'helena',
  start: 'h_start',
  hero: true,
  nodes: {
    h_start: {
      txt: 'Proszę Pana, to mój formularz. Widzi Pan moje dane. Widzi Pan moją pieczątkę. Proszę się nie bać. Niech pan przeanalizuje. Według regulaminu.',
      choices: [
        { text: 'Stempel mokry + okienko 12 nie istnieje → ODRZUT.', go: 'h_win', effect: 'helena_choose_odrzut' },
        { text: 'To pani formularz — AKCEPT.', go: 'h_lose', effect: 'helena_choose_akcept' },
        { text: 'Nie wiem, PRZEKAŻĘ WYŻEJ.', go: 'h_lose', effect: 'helena_choose_przekaz' },
      ],
    },
    h_win: {
      txt: 'Dziękuję. Mój formularz to był test. Zdał Pan. Awansuje Pan do okienka odbioru awansów.',
      choices: [{ text: 'Dziękuję, Pani Heleno.', go: 'h_num' }],
    },
    h_num: {
      txt: 'Nie ma za co. Numerek pan ma?',
      choices: [{ text: '...numerek?', go: 'h_done', effect: 'helena_passed_grant' }],
    },
    h_done: {
      txt: 'Tak pan, numerek. Numerek ma pan. Bardzo dobrze. Proszę lot na Hyper-Mart Galaktyczny, bilet 20 ₢. Miłego dnia pracy. I nie mów nikomu, że był pan dobry.',
      choices: [{ text: '[zamknij okno dialogowe]', go: null, effect: 'end_p1_day' }],
    },
    h_lose: {
      txt: 'Nie. Pan nie zdał. Ale spoko, nikomu nie powiem. Niech pan dalej sortuje. Test będzie jeszcze raz, kiedyś, za rok może.',
      choices: [{ text: '[wracam do sortowania]', go: null }],
    },
  },
};
