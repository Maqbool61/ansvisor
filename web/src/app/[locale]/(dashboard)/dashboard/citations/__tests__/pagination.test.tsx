import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../page';

const PAGE_SIZE = 100;

describe('usePagination', () => {
  it('starts at page 0', () => {
    const { result } = renderHook(() => usePagination(250, 'key1'));
    expect(result.current.page).toBe(0);
    expect(result.current.start).toBe(0);
    expect(result.current.end).toBe(100);
    expect(result.current.totalPages).toBe(3);
  });

  it('page 2 starts at rank 101', () => {
    const { result } = renderHook(() => usePagination(250, 'key1'));
    act(() => result.current.setPage(1));
    expect(result.current.start).toBe(100);
    expect(result.current.end).toBe(200);
  });

  it('resets to page 0 when resetKey changes', () => {
    let key = 'filters-v1';
    const { result, rerender } = renderHook(() => usePagination(250, key));
    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);

    key = 'filters-v2'; // simulate filter change
    rerender();
    expect(result.current.page).toBe(0);
  });

  it('hides pager when rows <= 100', () => {
    const { result } = renderHook(() => usePagination(50, 'key1'));
    expect(result.current.totalPages).toBe(1);
  });

  it('clamps page if rows shrink below current page', () => {
    const { result, rerender } = renderHook(
      ({ total }) => usePagination(total, 'key1'),
      { initialProps: { total: 300 } }
    );
    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);

    // rows shrink — page 2 no longer valid
    rerender({ total: 150 });
    expect(result.current.page).toBe(1); // clamped to last valid page
  });
});