export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
    tools: string[];
    turnaround: string;
}

export const services: Service[] = [
    {
        id: "bug-fixing",
        title: "Bug Fixing & Debugging",
        description:
            "I track down and fix stubborn bugs that are breaking your app — from frontend glitches to backend crashes. Methodical debugging with clear explanations of what went wrong and how it was fixed.",
        icon: "Bug",
        features: [
            "Runtime error diagnosis",
            "Console & network error resolution",
            "Database query fixes",
            "API response debugging",
            "Cross-browser compatibility fixes",
        ],
        tools: ["Chrome DevTools", "Postman", "Sentry", "VS Code Debugger"],
        turnaround: "30–90 minutes",
    },
    {
        id: "deployment",
        title: "Deployment & Hosting Fixes",
        description:
            "Stuck on deployment errors, SSL issues, or build failures? I get your app live and running — whether it's Vercel, Render, AWS, cPanel, or Docker.",
        icon: "Rocket",
        features: [
            "CI/CD pipeline setup & fixes",
            "Docker container debugging",
            "SSL certificate installation",
            "Domain & DNS configuration",
            "Build error resolution",
        ],
        tools: ["Vercel", "Render", "AWS", "Docker", "Nginx", "cPanel"],
        turnaround: "60 min – 4 hours",
    },
    {
        id: "full-stack",
        title: "Full Stack Feature Development",
        description:
            "Need a new feature built from scratch? I design, develop, and integrate full-stack features — from database schema to polished UI components.",
        icon: "Layers",
        features: [
            "React/Next.js UI components",
            "REST & GraphQL API development",
            "Database design & integration",
            "Authentication & authorization",
            "Payment integration",
        ],
        tools: ["React", "Next.js", "Node.js", "Express", "PostgreSQL", "MongoDB"],
        turnaround: "3–7 days",
    },
    {
        id: "api-integration",
        title: "API Integration",
        description:
            "I connect your app to third-party services — payment gateways, email providers, social logins, analytics, and more. Clean, maintainable integration code.",
        icon: "Plug",
        features: [
            "RESTful API consumption",
            "OAuth & social login setup",
            "Payment gateway integration (Stripe, PayPal)",
            "Email service integration (SendGrid, Mailgun)",
            "Webhook handling",
        ],
        tools: ["Axios", "Fetch API", "Postman", "Swagger", "GraphQL"],
        turnaround: "2–5 days",
    },
    {
        id: "performance",
        title: "Performance Optimization",
        description:
            "Slow load times killing your conversions? I audit and optimize your app — reducing bundle sizes, fixing memory leaks, and improving Core Web Vitals.",
        icon: "Zap",
        features: [
            "Lighthouse audit & optimization",
            "Bundle size reduction",
            "Image & asset optimization",
            "Database query optimization",
            "Caching strategy implementation",
        ],
        tools: ["Lighthouse", "webpack-bundle-analyzer", "React Profiler", "Redis"],
        turnaround: "2–4 days",
    },
    {
        id: "maintenance",
        title: "Website Management & Maintenance",
        description:
            "Ongoing support to keep your app healthy — dependency updates, security patches, monitoring, and quick-response bug fixes when things break.",
        icon: "Shield",
        features: [
            "Dependency updates & security patches",
            "Uptime monitoring setup",
            "Regular backups",
            "Performance monitoring",
            "On-call bug fixing",
        ],
        tools: ["GitHub Actions", "UptimeRobot", "Sentry", "PM2"],
        turnaround: "Ongoing",
    },
];
