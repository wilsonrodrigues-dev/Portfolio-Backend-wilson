"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const promises_1 = __importDefault(require("dns/promises"));
dotenv_1.default.config();
promises_1.default.setServers(['8.8.8.8', '1.1.1.1']);
const User_1 = __importDefault(require("./models/User"));
const About_1 = __importDefault(require("./models/About"));
const Project_1 = __importDefault(require("./models/Project"));
const Skill_1 = __importDefault(require("./models/Skill"));
const Experience_1 = __importDefault(require("./models/Experience"));
const Service_1 = __importDefault(require("./models/Service"));
const Testimonial_1 = __importDefault(require("./models/Testimonial"));
const Blog_1 = __importDefault(require("./models/Blog"));
const database_1 = require("./config/database");
async function seedData() {
    try {
        await (0, database_1.connectDatabase)();
        console.log('🧹 Cleaning existing database collections...');
        await Promise.all([
            User_1.default.deleteMany({}),
            About_1.default.deleteMany({}),
            Project_1.default.deleteMany({}),
            Skill_1.default.deleteMany({}),
            Experience_1.default.deleteMany({}),
            Service_1.default.deleteMany({}),
            Testimonial_1.default.deleteMany({}),
            Blog_1.default.deleteMany({}),
        ]);
        console.log('👤 Creating default Admin user...');
        await User_1.default.create({
            name: 'Wilson Rodrigues',
            email: process.env.ADMIN_EMAIL || 'admin@wilsonrodrigues.com',
            password: process.env.ADMIN_PASSWORD || 'Admin@123456',
            role: 'admin',
        });
        console.log('ℹ️ Creating About profile...');
        await About_1.default.create({
            name: 'Wilson Rodrigues',
            headline: 'Senior Full-Stack Engineer & Product Architect',
            subheadline: 'Crafting high-performance web applications, scalable cloud microservices, and dynamic AI-driven user experiences.',
            bio: 'I am a passionate Full-Stack Engineer with extensive experience in React, TypeScript, Node.js, and modern cloud architectures. I build robust digital products with rich UI/UX aesthetics, secure API designs, and scalable backend infrastructure.',
            longBio: `With over 5 years of software engineering experience, I specialize in architecting end-to-end web applications, custom Content Management Systems (CMS), and real-time distributed platforms.

My philosophy blends software engineering precision with aesthetic visual design. I take pride in crafting clean codebases, optimizing performance, and building intuitive user interfaces that engage users and deliver measurable business value.`,
            location: 'Goa / Remote, India',
            email: 'contact@wilsonrodrigues.dev',
            phone: '+91 98765 43210',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            resumeUrl: '/uploads/wilson_rodrigues_resume.pdf',
            githubUrl: 'https://github.com/wilsonrodrigues',
            linkedinUrl: 'https://linkedin.com/in/wilsonrodrigues',
            twitterUrl: 'https://twitter.com/wilson_dev',
            yearsOfExperience: 5,
        });
        console.log('🛠️ Creating Skills...');
        await Skill_1.default.insertMany([
            { name: 'TypeScript', category: 'Frontend', level: 'expert', icon: 'SiTypescript', order: 1, visible: true },
            { name: 'React.js / Next.js', category: 'Frontend', level: 'expert', icon: 'SiReact', order: 2, visible: true },
            { name: 'Tailwind CSS / Vanilla CSS', category: 'Frontend', level: 'expert', icon: 'SiTailwindcss', order: 3, visible: true },
            { name: 'Node.js & Express', category: 'Backend', level: 'expert', icon: 'SiNodedotjs', order: 4, visible: true },
            { name: 'MongoDB / Mongoose', category: 'Database', level: 'advanced', icon: 'SiMongodb', order: 5, visible: true },
            { name: 'PostgreSQL / Prisma', category: 'Database', level: 'advanced', icon: 'SiPostgresql', order: 6, visible: true },
            { name: 'REST & GraphQL APIs', category: 'Backend', level: 'expert', icon: 'SiGraphql', order: 7, visible: true },
            { name: 'Docker & Kubernetes', category: 'DevOps', level: 'intermediate', icon: 'SiDocker', order: 8, visible: true },
            { name: 'AWS & Cloud Hosting', category: 'DevOps', level: 'intermediate', icon: 'SiAmazonaws', order: 9, visible: true },
            { name: 'AI & LLM Integration', category: 'AI/ML', level: 'advanced', icon: 'SiOpenai', order: 10, visible: true },
        ]);
        console.log('💼 Creating Experiences...');
        await Experience_1.default.insertMany([
            {
                title: 'Senior Full-Stack Engineer',
                organization: 'Nexus Cloud Technologies',
                type: 'work',
                description: 'Led the development of multi-tenant enterprise dashboard solutions, implemented microservices using Node.js/TypeScript, and optimized web performance by 40%.',
                startDate: new Date('2024-01-01'),
                current: true,
                location: 'Remote',
                technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'AWS'],
                order: 1,
            },
            {
                title: 'Full-Stack Software Engineer',
                organization: 'Aura Software Labs',
                type: 'work',
                description: 'Engineered custom headless CMS platforms, high-throughput RESTful APIs, and real-time interactive user interfaces.',
                startDate: new Date('2022-06-01'),
                endDate: new Date('2023-12-31'),
                current: false,
                location: 'Hybrid',
                technologies: ['Next.js', 'Express', 'PostgreSQL', 'Redis', 'TailwindCSS'],
                order: 2,
            },
            {
                title: 'Bachelor of Technology in Computer Science',
                organization: 'Goa Engineering College',
                type: 'education',
                description: 'Graduated with First Class Honors. Focused on Distributed Systems, Software Engineering, and Database Architecture.',
                startDate: new Date('2018-08-01'),
                endDate: new Date('2022-05-31'),
                current: false,
                location: 'Goa, India',
                technologies: ['C++', 'Java', 'Data Structures', 'DBMS', 'Web Tech'],
                order: 3,
            },
            {
                title: '1st Place Winner - AI Innovation Hackathon',
                organization: 'TechSummit 2024',
                type: 'hackathon',
                description: 'Built an autonomous AI document intelligence agent using LLMs and vector embeddings in under 24 hours.',
                startDate: new Date('2024-04-15'),
                current: false,
                location: 'Bangalore, India',
                technologies: ['Python', 'LangChain', 'FastAPI', 'React'],
                order: 4,
            },
        ]);
        console.log('🚀 Creating Projects...');
        await Project_1.default.insertMany([
            {
                title: 'OmniCMS - Enterprise Portfolio Platform',
                slug: 'omnicms-enterprise-portfolio-platform',
                shortDescription: 'A full-stack headless CMS and personal portfolio system built with Express, MongoDB, and React featuring dynamic content authoring.',
                description: 'OmniCMS is a robust, modular Content Management System built specifically for tech professionals, creators, and agencies. It features JWT authentication with refresh tokens, dark-mode visual controls, full CRUD controllers for work samples, real-time message analytics, and SEO-optimized public rendering.',
                coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                images: [
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                ],
                tags: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'JWT', 'TailwindCSS'],
                category: 'Web App',
                liveUrl: 'https://wilsonrodrigues.dev',
                githubUrl: 'https://github.com/wilsonrodrigues/portfolio-cms',
                featured: true,
                published: true,
                order: 1,
            },
            {
                title: 'CognitiveIQ - AI Analytics Dashboard',
                slug: 'cognitiveiq-ai-analytics-dashboard',
                shortDescription: 'Real-time analytics engine visualizing customer intent, conversation sentiment, and automated workflow triggers.',
                description: 'An AI-powered data analytics suite providing real-time telemetry, sentiment scoring, and interactive charts. Integrated with LLM pipelines to automatically digest telemetry data.',
                coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                images: [
                    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                ],
                tags: ['Next.js', 'Python', 'FastAPI', 'TailwindCSS', 'Recharts'],
                category: 'AI/ML',
                liveUrl: 'https://cognitiveiq.demo.app',
                githubUrl: 'https://github.com/wilsonrodrigues/cognitive-iq',
                featured: true,
                published: true,
                order: 2,
            },
            {
                title: 'FluxStream - Real-Time Collaboration Tool',
                slug: 'fluxstream-realtime-collaboration',
                shortDescription: 'WebSockets-driven canvas and multi-user document editor with instant sync and cursor tracking.',
                description: 'FluxStream provides frictionless multi-user collaboration with operational transformation, real-time presence indicators, and instant undo/redo capabilities.',
                coverImage: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80',
                images: [
                    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80',
                ],
                tags: ['React', 'Socket.io', 'Node.js', 'Redis', 'Canvas API'],
                category: 'SaaS Platform',
                liveUrl: 'https://fluxstream.demo.app',
                githubUrl: 'https://github.com/wilsonrodrigues/flux-stream',
                featured: true,
                published: true,
                order: 3,
            },
        ]);
        console.log('⚡ Creating Services...');
        await Service_1.default.insertMany([
            {
                title: 'Full-Stack Web Development',
                description: 'Building modern, fast, scalable web applications with React, Next.js, TypeScript, and Node.js.',
                icon: 'Code',
                features: ['SPA & SSR Applications', 'Custom CMS Solutions', 'Responsive Dark Mode UI', 'Performance Optimization'],
                order: 1,
                visible: true,
            },
            {
                title: 'REST & GraphQL API Engineering',
                description: 'Designing clean, secure, and well-documented API architectures with JWT auth, rate limiting, and database ORMs.',
                icon: 'Server',
                features: ['JWT Auth & RBAC', 'Mongoose / Prisma ORM', 'Swagger API Docs', 'High Concurrency Design'],
                order: 2,
                visible: true,
            },
            {
                title: 'AI & LLM Integration',
                description: 'Empowering applications with cutting-edge artificial intelligence, prompt engineering, and vector databases.',
                icon: 'Cpu',
                features: ['OpenAI & Anthropic APIs', 'RAG Vector Search', 'AI Chatbot Interfaces', 'Automated Workflows'],
                order: 3,
                visible: true,
            },
            {
                title: 'UI/UX & Product Design',
                description: 'Designing fluid, modern visual design systems with glassmorphic styling, intuitive ergonomics, and animations.',
                icon: 'Layout',
                features: ['Visual Design Systems', 'Interactive Prototypes', 'Accessible Interfaces', 'Micro-Animations'],
                order: 4,
                visible: true,
            },
        ]);
        console.log('💬 Creating Testimonials...');
        await Testimonial_1.default.insertMany([
            {
                name: 'Sarah Jenkins',
                role: 'VP of Engineering',
                organization: 'Nexus Cloud Technologies',
                message: 'Wilson is an exceptional full-stack developer who consistently delivers pixel-perfect interfaces backed by robust server logic. His attention to detail in UX design and API security is top tier.',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
                published: true,
                order: 1,
            },
            {
                name: 'David Chen',
                role: 'Founder & CEO',
                organization: 'Aura Software Labs',
                message: 'Working with Wilson transformed our platform. He brought our legacy backend into a modern Node/React stack smoothly and significantly elevated our frontend UI.',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
                published: true,
                order: 2,
            },
        ]);
        console.log('📝 Creating Blog posts...');
        await Blog_1.default.insertMany([
            {
                title: 'Architecting Scalable Node.js REST APIs in 2026',
                slug: 'architecting-scalable-nodejs-rest-apis-2026',
                excerpt: 'A deep dive into building modular, typed, and secure Express.js microservices with Mongoose and TypeScript.',
                content: `Building modern backend services requires more than just listening on a port. In this guide, we explore how to organize scalable Express applications using TypeScript, robust error middleware, JWT rotation, and MongoDB best practices.

### Key Architecture Patterns
1. **Controller-Service-Model Separation**: Isolating business logic from route handlers.
2. **Strict Validation**: Preventing invalid data payloads before touching database models.
3. **Graceful Error Translation**: Converting database exceptions into user-friendly JSON responses without exposing raw stack traces.`,
                coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                tags: ['Node.js', 'Express', 'TypeScript', 'MongoDB', 'Architecture'],
                category: 'Backend',
                readTime: 6,
                status: 'published',
                views: 342,
                featured: true,
            },
            {
                title: 'Designing High-Performance React Web Applications',
                slug: 'designing-high-performance-react-web-applications',
                excerpt: 'Best practices for silky-smooth animations, code splitting, dynamic theme switching, and state management.',
                content: `Modern web users demand instant response times and captivating UI design. We break down techniques for maintaining 60 FPS visual rendering while building complex dynamic web interfaces.

### Core Strategies
- **Component Memoization**: Preventing unnecessary re-renders with \`useMemo\` and \`useCallback\`.
- **CSS Variable Design Systems**: Instant zero-runtime dark/light mode toggling.
- **Glassmorphism & Micro-Interactions**: Creating depth and feedback that delight users.`,
                coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
                tags: ['React', 'CSS', 'UI/UX', 'Performance', 'Frontend'],
                category: 'Frontend',
                readTime: 4,
                status: 'published',
                views: 518,
                featured: true,
            },
        ]);
        console.log('✅ Database successfully seeded with demo data!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}
seedData();
