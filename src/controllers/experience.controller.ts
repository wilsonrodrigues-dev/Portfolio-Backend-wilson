import { Request, Response, NextFunction } from 'express';
import Experience from '../models/Experience';
import { sendSuccess, sendError } from '../utils/response';

export async function getExperiences(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.type) filter.type = req.query.type;
    const experiences = await Experience.find(filter).sort({ order: 1, startDate: -1 }).select('-__v');
    sendSuccess(res, experiences);
  } catch (error) { next(error); }
}

export async function createExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const exp = await Experience.create(req.body);
    sendSuccess(res, exp, 'Experience created', 201);
  } catch (error) { next(error); }
}

export async function getExperienceById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) { sendError(res, 'Experience not found.', 404); return; }
    sendSuccess(res, exp);
  } catch (error) { next(error); }
}

export async function updateExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exp) { sendError(res, 'Experience not found.', 404); return; }
    sendSuccess(res, exp, 'Experience updated');
  } catch (error) { next(error); }
}

export async function deleteExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) { sendError(res, 'Experience not found.', 404); return; }
    sendSuccess(res, null, 'Experience deleted');
  } catch (error) { next(error); }
}
