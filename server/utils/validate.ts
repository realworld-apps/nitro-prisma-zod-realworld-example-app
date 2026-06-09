import { ZodSchema, ZodError } from 'zod';
import HttpException from '~/models/http-exception.model';

const validate = <T>(schema: ZodSchema<T>, value: unknown, fallbackField: string): T => {
    try {
        return schema.parse(value);
    } catch (error) {
        if (error instanceof ZodError) {
            const errors: Record<string, string[]> = {};
            for (const issue of error.issues) {
                const field = issue.path[issue.path.length - 1]?.toString() ?? fallbackField;
                if (!errors[field]) errors[field] = [];
                errors[field].push(issue.message);
            }
            throw new HttpException(422, { errors });
        }
        throw error;
    }
};

export const validateBody = <T>(schema: ZodSchema<T>, body: unknown): T => validate(schema, body, 'body');

export const validateQuery = <T>(schema: ZodSchema<T>, query: unknown): T => validate(schema, query, 'query');
