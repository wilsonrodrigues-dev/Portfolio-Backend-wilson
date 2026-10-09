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
const ExperienceSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    organization: {
        type: String,
        required: [true, 'Organization is required'],
        trim: true,
        maxlength: [200, 'Organization cannot exceed 200 characters'],
    },
    type: {
        type: String,
        enum: ['education', 'work', 'certification', 'achievement', 'hackathon'],
        required: [true, 'Type is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
    },
    current: {
        type: Boolean,
        default: false,
    },
    technologies: {
        type: [String],
        default: [],
    },
    location: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        trim: true,
    },
    achievement: {
        type: String,
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
ExperienceSchema.index({ type: 1, order: 1 });
ExperienceSchema.index({ startDate: -1 });
exports.default = mongoose_1.default.model('Experience', ExperienceSchema);
