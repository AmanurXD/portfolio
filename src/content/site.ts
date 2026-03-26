import siteData from "../../data/site.json";

export const siteConfig = {
    name: siteData.name,
    brand: siteData.brand,
    title: siteData.title,
    description: siteData.description,
    tagline: siteData.tagline,
    url: siteData.url,
    ogImage: siteData.ogImage,
    nav: siteData.nav,
    socials: {
        fiverr: siteData.fiverrUrl,
        github: siteData.githubUrl,
        linkedin: siteData.linkedinUrl,
        email: siteData.email,
    },
    stats: siteData.stats,
};
