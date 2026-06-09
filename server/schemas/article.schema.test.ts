import {describe, expect, test} from 'bun:test';
import {articleListQuerySchema} from './article.schema';

describe('article list query schema', () => {
    test('defaults pagination when limit and offset are omitted', () => {
        const result = articleListQuerySchema.parse({});

        expect(result.limit).toBe(10);
        expect(result.offset).toBe(0);
    });

    test('parses valid explicit pagination values and preserves filters', () => {
        const result = articleListQuerySchema.parse({
            limit: '25',
            offset: '5',
            tag: 'codex',
            author: 'setareh',
            favorited: 'reader',
        });

        expect(result).toEqual({
            limit: 25,
            offset: 5,
            tag: 'codex',
            author: 'setareh',
            favorited: 'reader',
        });
    });

    test.each([
        ['limit', '-1'],
        ['offset', '-1'],
    ])('rejects negative %s values', (field, value) => {
        const result = articleListQuerySchema.safeParse({[field]: value});

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual([field]);
            expect(result.error.issues[0].message).toBe('must be a non-negative integer');
        }
    });

    test.each([
        ['limit', '1.5'],
        ['offset', '1.5'],
    ])('rejects decimal %s values', (field, value) => {
        const result = articleListQuerySchema.safeParse({[field]: value});

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual([field]);
            expect(result.error.issues[0].message).toBe('must be a non-negative integer');
        }
    });

    test.each([
        ['limit', 'many'],
        ['offset', 'later'],
    ])('rejects non-numeric %s values', (field, value) => {
        const result = articleListQuerySchema.safeParse({[field]: value});

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual([field]);
            expect(result.error.issues[0].message).toBe('must be a non-negative integer');
        }
    });

    test('allows limit at the maximum', () => {
        const result = articleListQuerySchema.parse({limit: '50'});

        expect(result.limit).toBe(50);
    });

    test('rejects limit above the maximum', () => {
        const result = articleListQuerySchema.safeParse({limit: '51'});

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual(['limit']);
            expect(result.error.issues[0].message).toBe('must be less than or equal to 50');
        }
    });
});
