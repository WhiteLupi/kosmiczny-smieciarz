import type { FaceId } from '@/content/npcs';

export interface DialogChoice {
  text: string;
  go: string | null;
  effect?: string;
  /** Optional inventory gate — choice hidden unless inventory[itemId] >= count */
  requires?: { itemId: string; count: number };
}

export interface DialogNode {
  txt: string;
  choices: DialogChoice[];
}

export interface DialogTree {
  who: string;
  portrait: FaceId;
  start: string;
  hero?: boolean;
  nodes: Record<string, DialogNode>;
}

export interface DialogState {
  treeId: string;
  nodeId: string;
}
