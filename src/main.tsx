import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { startPersistence } from './state/persistence';
import { applyPalette } from './state/applyPalette';
import { useStore } from './state/store';

document.documentElement.dataset.palette = 'p1';
startPersistence();
// After rehydrate, sync palette CSS vars to current planet
applyPalette(useStore.getState().planet);

const root = document.getElementById('root');
if (!root) throw new Error('#root not found');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
