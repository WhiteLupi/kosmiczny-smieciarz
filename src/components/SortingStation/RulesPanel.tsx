import { useStore } from '@/state/store';
import type { SortingRule } from '@/types/sorting';

export function RulesPanel() {
  const sorting = useStore((s) => s.sorting);
  if (!sorting) return null;

  const visible: Array<{ rule: SortingRule; idx: number; unlocked: boolean }> = [];
  let nextHiddenShown = false;
  sorting.rules.forEach((r, i) => {
    if (sorting.unlocked.has(r.id)) {
      visible.push({ rule: r, idx: i + 1, unlocked: true });
    } else if (!nextHiddenShown) {
      visible.push({ rule: r, idx: i + 1, unlocked: false });
      nextHiddenShown = true;
    }
  });

  return (
    <div className="rules frame">
      <h3>▸ REGULAMIN SORTOWANIA</h3>
      <div className="rulesList">
        {visible.map(({ rule, idx, unlocked }) => (
          <div
            key={rule.id}
            className="rule"
            style={!unlocked ? { opacity: 0.4 } : undefined}
            data-rule-id={rule.id}
          >
            <span className="rn">R{idx}</span>
            {unlocked
              ? rule.text
              : <i style={{ color: '#6c8a66' }}>(ukryte — odblokuje się po kolejnych sortowaniach)</i>}
          </div>
        ))}
      </div>
    </div>
  );
}
