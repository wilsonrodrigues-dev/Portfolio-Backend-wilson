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
const AboutSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        default: 'Wilson Rodrigues',
    },
    headline: {
        type: String,
        required: [true, 'Headline is required'],
        default: 'Full-Stack Developer',
    },
    subheadline: {
        type: String,
        default: 'Building useful systems from complex ideas.',
    },
    bio: {
        type: String,
        required: [true, 'Bio is required'],
    },
    longBio: {
        type: String,
    },
    location: {
        type: String,
        default: 'Mangaluru, Karnataka, India',
    },
    email: {
        type: String,
        default: 'wilsonrodrigues.dev20@gmail.com',
    },
    phone: {
        type: String,
    },
    githubUrl: {
        type: String,
        default: 'https://github.com/wilsonrodrigues-dev',
    },
    linkedinUrl: {
        type: String,
        default: 'https://linkedin.com/in/wilson-rodrigues-dev',
    },
    twitterUrl: {
        type: String,
    },
    resumeUrl: {
        type: String,
    },
    avatar: {
        type: String,
    },
    availableForWork: {
        type: Boolean,
        default: true,
    },
    availabilityNote: {
        type: String,
    },
    yearsOfExperience: {
        type: Number,
    },
    seoTitle: {
        type: String,
    },
    seoDescription: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('About', AboutSchema);
