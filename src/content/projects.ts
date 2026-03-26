import projectsData from "../../data/projects.json";

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

export const projects: Project[] = projectsData as Project[];
