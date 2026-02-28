# debugwithjames — Portfolio Website

Premium multi-page portfolio site for James Benett. Built with Next.js, TypeScript, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel auto-detects Next.js — click **Deploy**
4. Add a custom domain in Settings → Domains

No environment variables required.

---

## Editing Guide

### 📝 Edit Services

Open `src/content/services.ts` — edit the `services` array:

```typescript
{
  id: "your-service-id",
  title: "Service Name",
  description: "...",
  icon: "Bug", // Lucide icon name: Bug, Rocket, Layers, Plug, Zap, Shield
  features: ["Feature 1", "Feature 2"],
  tools: ["Tool 1", "Tool 2"],
  turnaround: "24-48 hours",
}
```

### 📝 Edit Projects

Open `src/content/projects.ts` — edit the `projects` array:

```typescript
{
  slug: "my-project",       // URL-safe slug → /projects/my-project
  title: "Project Name",
  summary: "Short description",
  category: "full-stack",   // "frontend" | "backend" | "full-stack" | "automation"
  techStack: ["React", "Node.js"],
  problem: "What was wrong",
  solution: "How I fixed it",
  impact: "Measurable result",
  challenges: "What was hard",
  outcome: "End result",
  liveUrl: "https://...",   // optional
  githubUrl: "https://...", // optional
  featured: true,           // shows "Featured" badge
}
```

### 📝 Edit Testimonials

Open `src/content/testimonials.ts` — edit the `testimonials` array.

### 📝 Edit FAQs

Open `src/content/faqs.ts` — edit the `faqs` array.

### 📝 Add a Blog Post

Create a new `.mdx` file in `src/content/blog/`:

```mdx
---
title: "Your Post Title"
date: "2026-03-01"
summary: "A short summary for the listing page."
tags: ["react", "debugging"]
---

# Your Post Title

Write your content here using Markdown...
```

### 📝 Edit Personal Info

- **Site config**: `src/content/site.ts` (name, tagline, stats, nav)
- **Links**: `src/lib/constants.ts` (Fiverr URL, GitHub, LinkedIn, email)
- **About page**: `src/app/about/page.tsx` (story text, process steps, values, tools)

### 📝 Add Project Screenshots

Replace the gradient placeholders in `src/app/projects/[slug]/page.tsx` with actual `<Image>` components. Place images in `/public/projects/`.

---

## Folder Structure

```
src/
├── app/           # Pages (Next.js App Router)
├── components/    # UI components
│   ├── layout/    # Navbar, Footer
│   ├── home/      # ParticlesBackground
│   └── shared/    # SectionReveal, FiverrCTA, Toast, etc.
├── content/       # Editable content (services, projects, blog MDX)
├── hooks/         # useReducedMotion, useMediaQuery
└── lib/           # Utilities, constants, MDX loader
```
