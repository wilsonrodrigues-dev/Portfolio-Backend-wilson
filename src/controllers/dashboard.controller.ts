import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project';
import Blog from '../models/Blog';
import Skill from '../models/Skill';
import Experience from '../models/Experience';
import Message from '../models/Message';
import Media from '../models/Media';
import { sendSuccess } from '../utils/response';

export async function getDashboardStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [
      totalProjects,
      publishedProjects,
      totalBlogs,
      publishedBlogs,
      totalSkills,
      totalExperiences,
      totalMessages,
      unreadMessages,
      totalMedia,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ published: true }),
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      Skill.countDocuments({ visible: true }),
      Experience.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ read: false }),
      Media.countDocuments(),
    ]);

    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title slug published featured category createdAt');

    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject read createdAt');

    sendSuccess(res, {
      stats: {
        projects: { total: totalProjects, published: publishedProjects },
        blogs: { total: totalBlogs, published: publishedBlogs },
        skills: { total: totalSkills },
        experiences: { total: totalExperiences },
        messages: { total: totalMessages, unread: unreadMessages },
        media: { total: totalMedia },
      },
      recentProjects,
      recentMessages,
    });
  } catch (error) {
    next(error);
  }
}
