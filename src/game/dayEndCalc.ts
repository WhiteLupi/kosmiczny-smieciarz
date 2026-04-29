export interface DayEndCalc {
  pay: number;
  bonus: number;
  total: number;
}

export function dayEndCalc(correct: number, helenaPassed: boolean): DayEndCalc {
  const pay = correct * 2;
  const bonus = helenaPassed ? 20 : 0;
  return { pay, bonus, total: pay + bonus };
}
