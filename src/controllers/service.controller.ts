import { Request, Response, NextFunction } from 'express';
import Service from '../models/Service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getServices(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    // Anonymous callers only ever see visible services (drafts are admin-only).
    if (req.query.public === 'true' || !req.user) filter.visible = true;
    const services = await Service.find(filter).sort({ order: 1 }).select('-__v');
    sendSuccess(res, services);
  } catch (error) { next(error); }
}

export async function createService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const service = await Service.create(req.body);
    sendSuccess(res, service, 'Service created', 201);
  } catch (error) { next(error); }
}

export async function getServiceById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const service = await Service.findById(req.params.id);
    if (!service || (!req.user && !service.visible)) { sendError(res, 'Service not found.', 404); return; }
    sendSuccess(res, service);
  } catch (error) { next(error); }
}

export async function updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) { sendError(res, 'Service not found.', 404); return; }
    sendSuccess(res, service, 'Service updated');
  } catch (error) { next(error); }
}

export async function deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) { sendError(res, 'Service not found.', 404); return; }
    sendSuccess(res, null, 'Service deleted');
  } catch (error) { next(error); }
}
