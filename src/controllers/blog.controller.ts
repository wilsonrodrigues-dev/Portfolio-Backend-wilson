import { Request, Response, NextFunction } from 'express';
import Blog from '../models/Blog';
import { sendSuccess, sendError, generateSlug, getPaginationParams, escapeRegExp } from '../utils/response';

// Query params arrive via Express' extended query parser and can be objects
// (e.g. ?search[$ne]=x) — only plain strings are accepted as filter values.
function queryString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// PUBLIC: Get all published blogs
export async function getPublicBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, string>);
    const category = queryString(req.query.category);
    const tag = queryString(req.query.tag);
    const search = queryString(req.query.search);
    const featured = req.query.featured;

    const filter: Record<string, unknown> = { status: 'published' };
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (featured === 'true') filter.featured = true;
    if (search) {
      const pattern = escapeRegExp(search);
      filter.$or = [
        { title: { $regex: pattern, $options: 'i' } },
        { excerpt: { $regex: pattern, $options: 'i' } },
        { tags: { $in: [new RegExp(pattern, 'i')] } },
      ];
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content -__v'),
      Blog.countDocuments(filter),
    ]);

    sendSuccess(res, blogs, 'Blogs retrieved', 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
}

// PUBLIC: Get blog by slug
export async function getPublicBlogBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' }).select('-__v');
    if (!blog) {
      sendError(res, 'Blog post not found.', 404);
      return;
    }
    sendSuccess(res, blog);
  } catch (error) {
    next(error);
  }
}

// ADMIN: Get all blogs
export async function getAllBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, string>);
    const status = queryString(req.query.status);
    const search = queryString(req.query.search);
    const featured = req.query.featured;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (search) {
      const pattern = escapeRegExp(search);
      filter.$or = [
        { title: { $regex: pattern, $options: 'i' } },
        { excerpt: { $regex: pattern, $options: 'i' } },
      ];
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content -__v'),
      Blog.countDocuments(filter),
    ]);

    sendSuccess(res, blogs, 'Blogs retrieved', 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
}

// ADMIN: Get blog by ID
export async function getBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const blog = await Blog.findById(req.params.id).select('-__v');
    if (!blog) {
      sendError(res, 'Blog not found.', 404);
      return;
    }
    sendSuccess(res, blog);
  } catch (error) {
    next(error);
  }
}

// ADMIN: Create blog
export async function createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, slug: customSlug, ...rest } = req.body;
    if (!title) {
      sendError(res, 'Title is required.', 400);
      return;
    }
    const slug = customSlug || generateSlug(title);
    const existing = await Blog.findOne({ slug });
    if (existing) {
      sendError(res, `Slug "${slug}" is already in use.`, 409);
      return;
    }
    const blog = await Blog.create({ title, slug, ...rest });
    sendSuccess(res, blog, 'Blog post created successfully', 201);
  } catch (error) {
    next(error);
  }
}

// ADMIN: Update blog
export async function updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      sendError(res, 'Blog not found.', 404);
      return;
    }
    if (req.body.slug && req.body.slug !== blog.slug) {
      const existing = await Blog.findOne({ slug: req.body.slug });
      if (existing) {
        sendError(res, `Slug "${req.body.slug}" is already in use.`, 409);
        return;
      }
    }
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).select('-__v');
    sendSuccess(res, updated, 'Blog updated successfully');
  } catch (error) {
    next(error);
  }
}

// ADMIN: Delete blog
export async function deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      sendError(res, 'Blog not found.', 404);
      return;
    }
    sendSuccess(res, null, 'Blog deleted successfully');
  } catch (error) {
    next(error);
  }
}
