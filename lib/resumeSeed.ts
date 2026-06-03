import { ResumeData } from "@/types/resume";

export const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const initialResume: ResumeData = {
  photoUrl: "",
  fullName: "Aarav Mehta",
  title: "Senior Frontend Engineer",
  contacts: {
    phone: "+91 98765 43210",
    email: "aarav.mehta@email.com",
    linkedin: "linkedin.com/in/aaravmehta",
    github: "github.com/aaravmehta",
    portfolio: "aaravmehta.dev",
    address: "Bengaluru, India"
  },
  summary:
    "Frontend engineer specializing in high-performance SaaS interfaces, design systems, and ATS-friendly document rendering. Experienced in React, Next.js, accessibility, and production-grade UI architecture.",
  skills: [
    { id: "skill-1", category: "Technical Skills", skills: "React, Next.js, TypeScript, Tailwind CSS, Design Systems" },
    { id: "skill-2", category: "Programming Skills", skills: "Node.js, REST APIs, GraphQL, Accessibility, Performance" }
  ],
  experience: [
    {
      id: "exp-1",
      company: "BrightLayer Systems",
      role: "Senior Frontend Engineer",
      duration: "Jan 2022 - Present",
      location: "Remote",
      bullets: [
        "Led the migration of a legacy dashboard to Next.js, improving page load performance by 42%.",
        "Built reusable UI primitives adopted by 8 product teams across analytics and billing workflows.",
        "Partnered with designers to ship accessible, responsive interfaces for enterprise customers."
      ]
    },
    {
      id: "exp-2",
      company: "Northstar Labs",
      role: "Frontend Developer",
      duration: "Jun 2019 - Dec 2021",
      location: "Pune, India",
      bullets: [
        "Developed customer-facing React modules for onboarding, reporting, and account management.",
        "Reduced form abandonment by 18% through better validation, error states, and progressive disclosure."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      school: "PES University",
      degree: "B.Tech in Computer Science",
      duration: "2015 - 2019",
      location: "Bengaluru, India",
      details: "Graduated with distinction. Coursework in algorithms, databases, HCI, and distributed systems."
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Document Intelligence Builder",
      stack: "Next.js, TypeScript, PDF Rendering",
      link: "github.com/aaravmehta/doc-builder",
      bullets: [
        "Created an adaptive document renderer with live preview, pagination, and print-ready export."
      ]
    }
  ],
  certifications: [
    { id: "cert-1", name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", year: "2024" }
  ],
  achievements: [
    "Speaker at React India community meetup on scalable component APIs.",
    "Recognized with internal engineering excellence award for design system adoption."
  ],
  languages: ["English", "Hindi", "Kannada"],
  interests: ["Typography", "Open-source tooling", "Product design"],
  customSections: []
};
