export type LinkKey = "email" | "phone" | "linkedin" | "github" | "portfolio" | "address";

export interface ContactLinks {
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  address: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  duration: string;
  location: string;
  details: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  stack: string;
  link: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeData {
  fullName: string;
  title: string;
  contacts: ContactLinks;
  summary: string;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: string[];
  languages: string[];
  interests: string[];
  customSections: CustomSection[];
}

export interface LayoutProfile {
  density: "airy" | "balanced" | "compact" | "compressed";
  fontSizePt: number;
  sectionGapPx: number;
  itemGapPx: number;
  pages: number;
}

