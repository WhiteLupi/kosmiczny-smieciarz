import type { PlanetId } from '@/types/game';

export function applyPalette(planet: PlanetId): void {
  document.documentElement.dataset.palette = planet;
}
