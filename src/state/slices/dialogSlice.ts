import type { StateCreator } from 'zustand';
import type { DialogState } from '@/types/dialog';

export interface DialogSlice {
  dialog: DialogState | null;
  openDialog: (treeId: string, nodeId: string) => void;
  setDialogNode: (nodeId: string) => void;
  closeDialog: () => void;
}

export const createDialogSlice: StateCreator<DialogSlice> = (set) => ({
  dialog: null,
  openDialog: (treeId, nodeId) => set({ dialog: { treeId, nodeId } }),
  setDialogNode: (nodeId) =>
    set((s) => (s.dialog ? { dialog: { ...s.dialog, nodeId } } : {})),
  closeDialog: () => set({ dialog: null }),
});
