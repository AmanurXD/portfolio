export interface Testimonial {
    name: string;
    role: string;
    text: string;
    rating: number;
}

export const testimonials: Testimonial[] = [
    {
        name: "Sarah M.",
        role: "Startup Founder",
        text: "James fixed a critical production bug in under 45 minutes that my previous developer couldn't solve in a week. Clear communication, fast turnaround, and the fix was clean. Will hire again.",
        rating: 5,
    },
    {
        name: "David K.",
        role: "CTO, E-Commerce Platform",
        text: "We brought James in to optimize our dashboard and the results were incredible — 70% faster load times and zero downtime during the migration. He explained every change clearly.",
        rating: 5,
    },
    {
        name: "Maria L.",
        role: "Product Manager",
        text: "James built our API integration in half the estimated time. His code was well-documented, tested, and easy for our team to maintain. Highly recommend for any backend work.",
        rating: 5,
    },
    {
        name: "Alex T.",
        role: "Agency Owner",
        text: "Reliable, communicative, and technically excellent. James has been our go-to developer for deployment issues and feature builds. Every project delivered on time.",
        rating: 5,
    },
];
