import faqsData from "../../data/faqs.json";

export interface FAQ {
    question: string;
    answer: string;
}

export const faqs: FAQ[] = faqsData;
