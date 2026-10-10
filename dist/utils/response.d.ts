import { Response } from 'express';
interface SuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
    meta?: Record<string, unknown>;
}
interface ErrorResponse {
    success: false;
    message: string;
    errors?: unknown[];
}
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: Record<string, unknown>): Response<SuccessResponse<T>>;
export declare function sendError(res: Response, message: string, statusCode?: number, errors?: unknown[]): Response<ErrorResponse>;
export declare function generateSlug(text: string): string;
export declare function escapeRegExp(text: string): string;
export declare function getPaginationParams(query: Record<string, string | string[] | undefined>): {
    page: number;
    limit: number;
    skip: number;
};
export {};
//# sourceMappingURL=response.d.ts.map