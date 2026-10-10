import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getTestimonials(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function createTestimonial(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getTestimonialById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateTestimonial(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteTestimonial(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=testimonial.controller.d.ts.map