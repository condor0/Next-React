import { describe, it, expect } from 'vitest';
import { cx } from '../../utils/cx';

describe('cx utility function', () => {
    it('should return a single class name when given one', () => {
        expect(cx('className')).toBe('className');
    });

    it('should concatenate multiple class names', () => {
        expect(cx('class1', 'class2')).toBe('class1 class2');
    });

    it('should ignore falsy values', () => {
        expect(cx('class1', false, 'class2', null)).toBe('class1 class2');
    });

    it('should handle undefined values', () => {
        expect(cx('class1', undefined, 'class2')).toBe('class1 class2');
    });

    it('should handle empty strings', () => {
        expect(cx('class1', '', 'class2')).toBe('class1 class2');
    });
});