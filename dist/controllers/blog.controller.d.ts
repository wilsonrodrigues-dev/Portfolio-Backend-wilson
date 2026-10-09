import { Request, Response, NextFunction } from 'express';
export declare function getPublicBlogs(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getPublicBlogBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getAllBlogs(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getBlogById(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createBlog(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateBlog(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=blog.controller.d.ts.map