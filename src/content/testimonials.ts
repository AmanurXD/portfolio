import testimonialsData from "../../data/testimonials.json";

export interface Testimonial {
    name: string;
    role: string;
    text: string;
    rating: number;
}

export const testimonials: Testimonial[] = testimonialsData;
