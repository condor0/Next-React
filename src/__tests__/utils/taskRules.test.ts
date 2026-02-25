import { describe, it, expect } from 'vitest';
import { getAdjacentTaskStatuses, canTransitionTaskStatus, getAllowedTaskStatuses } from '../../utils/taskRules';

describe('taskRules utility', () => {
    it('should get adjacent task statuses', () => {
        const adjacent = getAdjacentTaskStatuses('todo');
        expect(Array.isArray(adjacent)).toBe(true);
    });

    it('should check status transitions', () => {
        const canTransition = canTransitionTaskStatus('todo', 'todo');
        expect(typeof canTransition).toBe('boolean');
    });

    it('should get allowed statuses', () => {
        const allowed = getAllowedTaskStatuses('todo');
        expect(Array.isArray(allowed)).toBe(true);
    });
});