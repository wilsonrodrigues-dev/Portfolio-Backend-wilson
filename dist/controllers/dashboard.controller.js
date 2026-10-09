"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
const Project_1 = __importDefault(require("../models/Project"));
const Blog_1 = __importDefault(require("../models/Blog"));
const Skill_1 = __importDefault(require("../models/Skill"));
const Experience_1 = __importDefault(require("../models/Experience"));
const Message_1 = __importDefault(require("../models/Message"));
const Media_1 = __importDefault(require("../models/Media"));
const response_1 = require("../utils/response");
async function getDashboardStats(_req, res, next) {
    try {
        const [totalProjects, publishedProjects, totalBlogs, publishedBlogs, totalSkills, totalExperiences, totalMessages, unreadMessages, totalMedia,] = await Promise.all([
            Project_1.default.countDocuments(),
            Project_1.default.countDocuments({ published: true }),
            Blog_1.default.countDocuments(),
            Blog_1.default.countDocuments({ status: 'published' }),
            Skill_1.default.countDocuments({ visible: true }),
            Experience_1.default.countDocuments(),
            Message_1.default.countDocuments(),
            Message_1.default.countDocuments({ read: false }),
            Media_1.default.countDocuments(),
        ]);
        const recentProjects = await Project_1.default.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title slug published featured category createdAt');
        const recentMessages = await Message_1.default.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email subject read createdAt');
        (0, response_1.sendSuccess)(res, {
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
    }
    catch (error) {
        next(error);
    }
}
