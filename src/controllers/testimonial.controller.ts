import { Request, Response, NextFunction } from 'express';
import Testimonial from '../models/Testimonial';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getTestimonials(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    // Anonymous callers only ever see published testimonials (drafts are admin-only).
    if (req.query.public === 'true' || !req.user) filter.published = true;
    const testimonials = await Testimonial.find(filter).sort({ order: 1 }).select('-__v');
    sendSuccess(res, testimonials);
  } catch (error) { next(error); }
}

export async function createTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const t = await Testimonial.create(req.body);
    sendSuccess(res, t, 'Testimonial created', 201);
  } catch (error) { next(error); }
}

export async function getTestimonialById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t || (!req.user && !t.published)) { sendError(res, 'Testimonial not found.', 404); return; }
    sendSuccess(res, t);
  } catch (error) { next(error); }
}

export async function updateTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!t) { sendError(res, 'Testimonial not found.', 404); return; }
    sendSuccess(res, t, 'Testimonial updated');
  } catch (error) { next(error); }
}

export async function deleteTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const t = await Testimonial.findByIdAndDelete(req.params.id);
    if (!t) { sendError(res, 'Testimonial not found.', 404); return; }
    sendSuccess(res, null, 'Testimonial deleted');
  } catch (error) { next(error); }
}
