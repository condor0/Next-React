import { describe, it, expect } from 'vitest';
import { getAdjacentTaskStatuses, canTransitionTaskStatus, getAllowedTaskStatuses } from '../../utils/taskRules';

describe('getAdjacentTaskStatuses', () => {
    it('returns only "doing" for "todo"', () => {
        expect(getAdjacentTaskStatuses('todo')).toEqual(['doing']);
    });

    it('returns "todo" and "done" for "doing"', () => {
        expect(getAdjacentTaskStatuses('doing')).toEqual(['todo', 'done']);
    });

    it('returns only "doing" for "done"', () => {
        expect(getAdjacentTaskStatuses('done')).toEqual(['doing']);
    });
});

describe('canTransitionTaskStatus', () => {
    it('allows same-status transition', () => {
        expect(canTransitionTaskStatus('todo', 'todo')).toBe(true);
    });

    it('allows adjacent forward: todo -> doing', () => {
        expect(canTransitionTaskStatus('todo', 'doing')).toBe(true);
    });

    it('allows adjacent forward: doing -> done', () => {
        expect(canTransitionTaskStatus('doing', 'done')).toBe(true);
    });

    it('allows adjacent backward: doing -> todo', () => {
        expect(canTransitionTaskStatus('doing', 'todo')).toBe(true);
    });

    it('allows adjacent backward: done -> doing', () => {
        expect(canTransitionTaskStatus('done', 'doing')).toBe(true);
    });

    it('blocks non-adjacent: todo -> done', () => {
        expect(canTransitionTaskStatus('todo', 'done')).toBe(false);
    });

    it('blocks non-adjacent: done -> todo', () => {
        expect(canTransitionTaskStatus('done', 'todo')).toBe(false);
    });
});

describe('getAllowedTaskStatuses', () => {
    it('returns current + adjacent for "todo"', () => {
        expect(getAllowedTaskStatuses('todo')).toEqual(['todo', 'doing']);
    });

    it('returns current + adjacent for "doing"', () => {
        expect(getAllowedTaskStatuses('doing')).toEqual(['doing', 'todo', 'done']);
    });

    it('returns current + adjacent for "done"', () => {
        expect(getAllowedTaskStatuses('done')).toEqual(['done', 'doing']);
    });
});
