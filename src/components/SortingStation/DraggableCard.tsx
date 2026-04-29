import { useDraggable } from '@dnd-kit/core';
import type { CSSProperties } from 'react';
import { FormCard } from './FormCard';
import type { SortingItem } from '@/types/sorting';

export function DraggableCard({ item }: { item: SortingItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: 'current-card' });
  const style: CSSProperties = transform
    ? { transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px))` }
    : {};
  return (
    <div
      ref={setNodeRef}
      className={`card ${isDragging ? 'dragging' : ''}`}
      style={style}
      {...listeners}
      {...attributes}
    >
      <FormCard item={item} />
    </div>
  );
}
