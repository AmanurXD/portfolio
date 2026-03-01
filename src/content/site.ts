import { FIVERR_URL, GITHUB_URL, LINKEDIN_URL, EMAIL } from "@/lib/constants";

export const siteConfig = {
    name: "James Benett",
    brand: "jamesbenett",
    title: "Full Stack Web Developer",
    description:
        "I build, fix, and deploy modern web applications. Specializing in React, Node.js, PHP, and API integrations. Fast turnaround, clean code, production-ready results.",
    tagline: "Build it. Fix it. Ship it.",
    url: "https://jamesbenett.zone.id",
    ogImage: "/og-image.png",
    nav: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Projects", href: "/projects" },
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
    ],
    socials: {
        fiverr: FIVERR_URL,
        github: GITHUB_URL,
        linkedin: LINKEDIN_URL,
        email: EMAIL,
    },
    stats: [
        { label: "Projects Delivered", value: 50, suffix: "+" },
        { label: "5-Star Reviews", value: 30, suffix: "+" },
        { label: "Response Time", value: 30, suffix: "min" },
        { label: "Technologies", value: 15, suffix: "+" },
    ],
};
