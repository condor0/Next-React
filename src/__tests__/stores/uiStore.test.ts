import { describe, it, expect } from 'vitest';
import { useUiStore } from '../../state/uiStore';

describe('uiStore', () => {
  it('should initialize with default state', () => {
    const state = useUiStore.getState();
    expect(state).toBeDefined();
    expect(state.toasts).toBeDefined();
    expect(state.modal).toBeDefined();
  });

  it('should add a toast', () => {
    const store = useUiStore.getState();
    store.addToast({ title: 'Test Toast' });
    const updated = useUiStore.getState();
    expect(updated.toasts.length).toBeGreaterThan(0);
  });

  it('should open/close modal', () => {
    const store = useUiStore.getState();
    store.openModal({ title: 'Test Modal' });
    let state = useUiStore.getState();
    expect(state.modal.isOpen).toBe(true);
    store.closeModal();
    state = useUiStore.getState();
    expect(state.modal.isOpen).toBe(false);
  });
});