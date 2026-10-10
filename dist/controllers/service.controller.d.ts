import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getServices(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function createService(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getServiceById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateService(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteService(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=service.controller.d.ts.map