import { Request, Response, NextFunction } from 'express';
import About from '../models/About';
import { sendSuccess, sendError } from '../utils/response';

export async function getAbout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let about = await About.findOne().select('-__v');
    if (!about) {
      sendSuccess(res, null, 'About not configured yet');
      return;
    }
    sendSuccess(res, about);
  } catch (error) { next(error); }
}

export async function updateAbout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create(req.body);
    } else {
      about = await About.findByIdAndUpdate(about._id, req.body, { new: true, runValidators: true });
    }
    sendSuccess(res, about, 'About updated successfully');
  } catch (error) { next(error); }
}
