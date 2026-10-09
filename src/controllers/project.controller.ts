import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project';
import { sendSuccess, sendError, generateSlug, getPaginationParams, escapeRegExp } from '../utils/response';

// Only plain strings are accepted as query filter values (Express' extended
// query parser can produce objects/arrays like ?category[$ne]=x).
function queryString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// PUBLIC: Get all published projects
export async function getPublicProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = queryString(req.query.category);
    const filter: Record<string, unknown> = { published: true };
    if (category) filter.category = category;
    if (req.query.featured === 'true') filter.featured = true;

    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');

    sendSuccess(res, projects);
  } catch (error) {
    next(error);
  }
}

// PUBLIC: Get project by slug
export async function getPublicProjectBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await Project.findOne({ slug: req.params.slug, published: true }).select('-__v');
    if (!project) {
      sendError(res, 'Project not found.', 404);
      return;
    }
    sendSuccess(res, project);
  } catch (error) {
    next(error);
  }
}

// ADMIN: Get all projects (including drafts)
export async function getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, string>);
    const search = queryString(req.query.search);
    const category = queryString(req.query.category);
    const { published, featured } = req.query;

    const filter: Record<string, unknown> = {};
    if (published !== undefined) filter.published = published === 'true';
    if (featured !== undefined) filter.featured = featured === 'true';
    if (category) filter.category = category;
    if (search) {
      const pattern = escapeRegExp(search);
      filter.$or = [
        { title: { $regex: pattern, $options: 'i' } },
        { shortDescription: { $regex: pattern, $options: 'i' } },
      ];
    }

    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).select('-__v'),
      Project.countDocuments(filter),
    ]);

    sendSuccess(res, projects, 'Projects retrieved', 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
}

// ADMIN: Get project by ID
export async function getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await Project.findById(req.params.id).select('-__v');
    if (!project) {
      sendError(res, 'Project not found.', 404);
      return;
    }
    sendSuccess(res, project);
  } catch (error) {
    next(error);
  }
}

// ADMIN: Create project
export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, slug: customSlug, ...rest } = req.body;

    if (!title) {
      sendError(res, 'Title is required.', 400);
      return;
    }

    const slug = customSlug || generateSlug(title);

    // Check slug uniqueness
    const existing = await Project.findOne({ slug });
    if (existing) {
      sendError(res, `Slug "${slug}" is already in use.`, 409);
      return;
    }

    const project = await Project.create({ title, slug, ...rest });
    sendSuccess(res, project, 'Project created successfully', 201);
  } catch (error) {
    next(error);
  }
}

// ADMIN: Update project
export async function updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      sendError(res, 'Project not found.', 404);
      return;
    }

    // If slug is being changed, check uniqueness
    if (req.body.slug && req.body.slug !== project.slug) {
      const existing = await Project.findOne({ slug: req.body.slug });
      if (existing) {
        sendError(res, `Slug "${req.body.slug}" is already in use.`, 409);
        return;
      }
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-__v');

    sendSuccess(res, updated, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
}

// ADMIN: Delete project
export async function deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      sendError(res, 'Project not found.', 404);
      return;
    }
    sendSuccess(res, null, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
}
