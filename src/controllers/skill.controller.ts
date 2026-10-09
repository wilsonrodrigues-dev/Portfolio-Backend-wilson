import { Request, Response, NextFunction } from 'express';
import Skill from '../models/Skill';
import { sendSuccess, sendError } from '../utils/response';

export async function getSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.public === 'true') filter.visible = true;
    const skills = await Skill.find(filter).sort({ category: 1, order: 1 }).select('-__v');
    sendSuccess(res, skills);
  } catch (error) { next(error); }
}

export async function createSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const skill = await Skill.create(req.body);
    sendSuccess(res, skill, 'Skill created', 201);
  } catch (error) { next(error); }
}

export async function getSkillById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) { sendError(res, 'Skill not found.', 404); return; }
    sendSuccess(res, skill);
  } catch (error) { next(error); }
}

export async function updateSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!skill) { sendError(res, 'Skill not found.', 404); return; }
    sendSuccess(res, skill, 'Skill updated');
  } catch (error) { next(error); }
}

export async function deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) { sendError(res, 'Skill not found.', 404); return; }
    sendSuccess(res, null, 'Skill deleted');
  } catch (error) { next(error); }
}
