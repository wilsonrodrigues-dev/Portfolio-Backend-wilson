"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const BlogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
        maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    excerpt: {
        type: String,
        required: [true, 'Excerpt is required'],
        maxlength: [600, 'Excerpt cannot exceed 600 characters'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    coverImage: {
        type: String,
    },
    tags: {
        type: [String],
        default: [],
    },
    category: {
        type: String,
        default: 'General',
        trim: true,
    },
    author: {
        type: String,
        default: 'Wilson Rodrigues',
    },
    featured: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'scheduled'],
        default: 'draft',
    },
    publishedAt: {
        type: Date,
    },
    scheduledFor: {
        type: Date,
    },
    seoTitle: {
        type: String,
        maxlength: [70, 'SEO title cannot exceed 70 characters'],
    },
    seoDescription: {
        type: String,
        maxlength: [160, 'SEO description cannot exceed 160 characters'],
    },
    readingTime: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
// Calculate reading time before save
BlogSchema.pre('save', async function () {
    if (this.isModified('content')) {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        this.readingTime = Math.ceil(wordCount / wordsPerMinute);
    }
    if (this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
});
BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ featured: 1 });
exports.default = mongoose_1.default.model('Blog', BlogSchema);
