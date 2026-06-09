import { z } from 'zod';

const paginationParamSchema = (defaultValue: number, max?: number) => z
    .union([z.string(), z.number()])
    .optional()
    .transform((value, ctx) => {
        if (value === undefined) return defaultValue;

        const parsed = typeof value === 'number' ? value : Number(value);
        if (!Number.isInteger(parsed) || parsed < 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'must be a non-negative integer',
            });
            return z.NEVER;
        }

        if (max !== undefined && parsed > max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `must be less than or equal to ${max}`,
            });
            return z.NEVER;
        }

        return parsed;
    });

export const createArticleSchema = z.object({
    article: z.object({
        title: z.string().trim().min(1, "can't be blank"),
        description: z.string().trim().min(1, "can't be blank"),
        body: z.string().trim().min(1, "can't be blank"),
        tagList: z.array(z.string()).optional().default([]),
    }),
});

export const updateArticleSchema = z.object({
    article: z.object({
        title: z.string().trim().min(1).optional(),
        description: z.string().trim().min(1).optional(),
        body: z.string().trim().min(1).optional(),
        tagList: z.array(z.string()).optional(),
    }),
});

export const articleListQuerySchema = z.object({
    limit: paginationParamSchema(10, 50),
    offset: paginationParamSchema(0),
    tag: z.string().optional(),
    author: z.string().optional(),
    favorited: z.string().optional(),
});
