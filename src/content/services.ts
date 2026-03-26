// This file is importable by both client and server components
// Data is loaded at build-time / SSR via require() — no fs dependency
import servicesData from "../../data/services.json";

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
    tools: string[];
    turnaround: string;
}

export const services: Service[] = servicesData;
