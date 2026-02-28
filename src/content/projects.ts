export interface Project {
    slug: string;
    title: string;
    summary: string;
    category: "frontend" | "backend" | "full-stack" | "automation";
    techStack: string[];
    problem: string;
    solution: string;
    impact: string;
    challenges: string;
    outcome: string;
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
}

export const projects: Project[] = [
    {
        slug: "ecommerce-dashboard",
        title: "E-Commerce Admin Dashboard",
        summary:
            "Full-stack admin dashboard for an e-commerce platform with real-time analytics, order management, and inventory tracking.",
        category: "full-stack",
        techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "Chart.js"],
        problem:
            "The client's existing admin panel was slow, lacked real-time data, and couldn't handle their growing product catalog of 10,000+ SKUs.",
        solution:
            "Built a modern Next.js dashboard with server-side rendering for instant loads, Prisma ORM for efficient database queries, and WebSocket integration for real-time order notifications.",
        impact:
            "Reduced page load time by 70%. The client reported a 40% improvement in order processing speed.",
        challenges:
            "Optimizing database queries for large datasets while maintaining real-time updates. Solved with cursor-based pagination and Redis caching.",
        outcome:
            "Dashboard handles 10,000+ products with sub-second load times. The client expanded their team to leverage the new efficiency.",
        featured: true,
    },
    {
        slug: "api-migration",
        title: "Legacy API Migration to Node.js",
        summary:
            "Migrated a legacy PHP REST API to a modern Node.js/Express architecture with zero downtime.",
        category: "backend",
        techStack: ["Node.js", "Express", "MongoDB", "Docker", "Jest", "Swagger"],
        problem:
            "A SaaS company's PHP API was difficult to maintain, had no documentation, and couldn't scale to handle 10x traffic growth.",
        solution:
            "Designed and implemented a new Node.js API with Express, comprehensive Swagger docs, automated testing with Jest, and a gradual migration strategy using API versioning.",
        impact:
            "API response times improved by 60%. Development velocity doubled thanks to better tooling and documentation.",
        challenges:
            "Ensuring backward compatibility during migration. Used API versioning and feature flags to gradually switch endpoints without breaking existing clients.",
        outcome:
            "Zero-downtime migration completed over 4 weeks. All existing integrations continued working seamlessly.",
        featured: true,
    },
    {
        slug: "react-saas-landing",
        title: "SaaS Landing Page & Marketing Site",
        summary:
            "High-converting marketing website with animations, lead capture forms, and CMS integration.",
        category: "frontend",
        techStack: ["React", "Next.js", "Framer Motion", "Tailwind CSS", "Contentful CMS"],
        problem:
            "The startup needed a professional landing page to launch their product, with fast iteration cycles for A/B testing different messaging.",
        solution:
            "Built a Next.js static site with Contentful CMS for easy content updates, smooth scroll animations with Framer Motion, and integrated analytics for conversion tracking.",
        impact:
            "Achieved a 12% conversion rate on the main CTA. Page load score of 98 on Lighthouse.",
        challenges:
            "Balancing rich animations with performance. Used code-splitting, lazy loading, and reduced-motion fallbacks to keep the site fast on all devices.",
        outcome:
            "Client raised their seed round partly on the strength of their polished web presence.",
        featured: true,
    },
    {
        slug: "ci-cd-automation",
        title: "CI/CD Pipeline & Deployment Automation",
        summary:
            "Automated testing, building, and deployment pipeline for a multi-service application.",
        category: "automation",
        techStack: ["GitHub Actions", "Docker", "AWS ECS", "Terraform", "Shell Scripts"],
        problem:
            "Manual deployments were taking 2+ hours per release and frequently caused production incidents due to missed steps.",
        solution:
            "Designed a GitHub Actions pipeline with automated testing, Docker containerization, infrastructure-as-code with Terraform, and blue-green deployments on AWS ECS.",
        impact:
            "Deployment time reduced from 2 hours to 8 minutes. Zero deployment-related production incidents since implementation.",
        challenges:
            "Setting up proper staging environments that mirrored production. Used Terraform modules to maintain parity between environments.",
        outcome:
            "Team now ships 3x more frequently with confidence. Rollbacks happen in under 2 minutes when needed.",
        featured: false,
    },
    {
        slug: "realtime-chat",
        title: "Real-Time Chat Application",
        summary:
            "Scalable real-time messaging app with WebSocket support, typing indicators, and message history.",
        category: "full-stack",
        techStack: ["React", "Node.js", "Socket.io", "Redis", "PostgreSQL", "Docker"],
        problem:
            "A community platform needed real-time chat to increase user engagement, but their previous attempts had scaling issues beyond 100 concurrent users.",
        solution:
            "Built a scalable chat system with Socket.io, Redis for pub/sub across multiple server instances, and PostgreSQL for persistent message history with efficient pagination.",
        impact:
            "Supports 5,000+ concurrent users with sub-100ms message delivery. User engagement increased by 300%.",
        challenges:
            "Handling message ordering and delivery guarantees in a distributed system. Implemented vector clocks and acknowledgment patterns.",
        outcome:
            "Chat became the platform's most-used feature, driving daily active user retention up by 45%.",
        featured: true,
    },
];
