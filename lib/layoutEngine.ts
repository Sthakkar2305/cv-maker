import { LayoutProfile, ResumeData } from "@/types/resume";

const bulletWeight = (items: string[]) => items.reduce((sum, item) => sum + Math.ceil(item.length / 90) + 1, 0);

export function estimateResumeWeight(data: ResumeData) {
  const titleWeight = data.title ? 1.5 : 0;
  const contactWeight = Object.values(data.contacts).filter(Boolean).length * 0.8;
  const summaryWeight = Math.ceil(data.summary.length / 95) + 2;
  
  const skillWeight = data.skills.reduce((sum, item) => {
    return sum + 1.2 + Math.ceil((item.category.length + item.skills.length) / 90);
  }, 0);

  const expWeight = data.experience.reduce((sum, item) => {
    return sum + 4 + Math.ceil([item.company, item.role, item.duration, item.location].join(" ").length / 95) + bulletWeight(item.bullets);
  }, 0);
  const eduWeight = data.education.reduce((sum, item) => sum + 4 + Math.ceil(item.details.length / 100), 0);
  const projectWeight = data.projects.reduce((sum, item) => sum + 4 + bulletWeight(item.bullets), 0);
  const certWeight = data.certifications.length * 1.7;
  const listWeight = bulletWeight(data.achievements) + data.languages.length * 0.6 + data.interests.length * 0.6;
  
  const customSectionWeight = data.customSections?.reduce((sum, item) => {
    return sum + 4 + Math.ceil((item.title.length + item.content.length) / 90);
  }, 0) || 0;

  return titleWeight + contactWeight + summaryWeight + skillWeight + expWeight + eduWeight + projectWeight + certWeight + listWeight + customSectionWeight;
}

export function getLayoutProfile(data: ResumeData): LayoutProfile {
  const weight = estimateResumeWeight(data);

  if (weight < 58) {
    return { density: "airy", fontSizePt: 10.8, sectionGapPx: 16, itemGapPx: 10, pages: 1 };
  }

  if (weight < 76) {
    return { density: "balanced", fontSizePt: 10.3, sectionGapPx: 14, itemGapPx: 8, pages: 1 };
  }

  if (weight < 96) {
    return { density: "compact", fontSizePt: 9.75, sectionGapPx: 11, itemGapPx: 6, pages: 1 };
  }

  return {
    density: "compressed",
    fontSizePt: Math.max(8.5, 9.45 - (weight - 96) * 0.05),
    sectionGapPx: Math.max(5, 8 - (weight - 96) * 0.08),
    itemGapPx: Math.max(3, 4 - (weight - 96) * 0.05),
    pages: 1
  };
}

export function splitBullets(value: string) {
  return value
    .split(/\n|;/)
    .map((item) => item.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

export function joinBullets(items: string[]) {
  return items.join("\n");
}
