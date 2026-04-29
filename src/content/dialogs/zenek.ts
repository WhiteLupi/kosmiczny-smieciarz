import type { DialogTree } from '@/types/dialog';

export const zenekDialog: DialogTree = {
  who: 'PAN ZENEK ZE SKUPU BUTELEK',
  portrait: 'pl_tired',
  start: 'z_start',
  nodes: {
    z_start: {
      txt: 'Witam. Pan z butelkami? KBK-3 tylko biorę. Bez kapsla nie biorę. Pęknięte nie biorę. W skrzynce po 6 mają być. I etykieta oryginalna.',
      choices: [
        { text: 'Co pan z nimi robi?', go: 'z_co' },
        { text: 'Ile pan płaci?', go: 'z_ile' },
        { text: 'A muszę?', go: 'z_musze' },
      ],
    },
    z_co: {
      txt: 'Co pan, milicjant? Panu swoje. Mnie moje. Uzbiera pan 30 szt., ja dam 60 groszy. Tak mówię pan. 60.',
      choices: [
        { text: 'To mniej niż grosz za sztukę...', go: 'z_math' },
        { text: 'Zgoda. [przyjmij quest]', go: 'z_accept', effect: 'zenek_accept' },
      ],
    },
    z_ile: {
      txt: 'Sześćdziesiąt groszy za trzydzieści sztuk. Pan liczy? Jak pan liczy to pan się odchodzi.',
      choices: [
        { text: 'Zgoda. [przyjmij quest]', go: 'z_accept', effect: 'zenek_accept' },
        { text: 'Dziękuję, nie.', go: 'z_end' },
      ],
    },
    z_musze: {
      txt: 'Pan nie musi. Ja też nie muszę. Ale jak pan przywiezie 30 szt., to ja panu dam 60 groszy. I nie mówimy nikomu za ile.',
      choices: [
        { text: 'Zgoda. [przyjmij quest]', go: 'z_accept', effect: 'zenek_accept' },
        { text: 'Odchodzę.', go: 'z_end' },
      ],
    },
    z_math: {
      txt: 'Pan matematyk, co? To niech pan idzie do banku centralnego Marsa. U mnie 60 groszy i koniec pieśni. Bo butelki nie są państwowe.',
      choices: [{ text: '...no dobra.', go: 'z_accept', effect: 'zenek_accept' }],
    },
    z_accept: {
      txt: 'To proszę. Niech pan sortuje dalej. Butelki czasem lecą zawinięte w gazetę. Trzeba mieć oko.',
      choices: [{ text: '[wracam do sortowania]', go: null }],
    },
    z_end: {
      txt: 'Pan odchodzi. Pan odchodzi ze świata dorosłych. Następny!',
      choices: [{ text: '[wracam do sortowania]', go: null }],
    },
  },
};
