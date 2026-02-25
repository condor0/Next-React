import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebouncedValue } from '../../utils/useDebouncedValue';

describe('useDebouncedValue', () => {
  it('should return the debounced value after the specified delay', async () => {
    const { result } = renderHook(() => useDebouncedValue('test', 100));

    expect(result.current).toBe('test');

    await waitFor(() => {
      expect(result.current).toBe('test');
    }, { timeout: 200 });
  });
});