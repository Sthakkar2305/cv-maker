"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, LayoutTemplate, Printer, RotateCcw, Sparkles } from "lucide-react";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { ResumeForm } from "@/components/builder/ResumeForm";
import { TemplateGallery } from "@/components/builder/TemplateGallery";
import { getLayoutProfile } from "@/lib/layoutEngine";
import { initialResume } from "@/lib/resumeSeed";
import { ResumeData, ResumeTemplateId, SkillGroup } from "@/types/resume";

const storageKey = "premium-resume-builder-state";
const templateNames: Record<ResumeTemplateId, string> = {
  classic: "Classic ATS",
  sidebar: "Amelia Sidebar",
  timeline: "Executive Timeline",
  green: "Green Designer"
};

export function BuilderShell() {
  const [data, setData] = useState<ResumeData>(initialResume);
  const [templateId, setTemplateId] = useState<ResumeTemplateId | null>(null);
  const profile = useMemo(() => getLayoutProfile(data), [data]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as ResumeData & { skills?: unknown[]; customSections?: unknown[] };

      const storedSkills = Array.isArray(parsed.skills) ? (parsed.skills as unknown[]) : [];
      if (storedSkills.length > 0 && typeof storedSkills[0] === "string") {
        const plainSkills: string[] = [];
        const colonSkills: string[] = [];

        storedSkills.forEach((skill) => {
          if (typeof skill !== "string") return;
          if (skill.includes(":")) colonSkills.push(skill);
          else plainSkills.push(skill);
        });

        const migratedSkills: SkillGroup[] = [];
        if (plainSkills.length) {
          migratedSkills.push({
            id: `skill-migrated-plain-${Date.now()}`,
            category: "Technical Skills",
            skills: plainSkills.join(", ")
          });
        }
        colonSkills.forEach((skill, index) => {
          const colonIndex = skill.indexOf(":");
          migratedSkills.push({
            id: `skill-migrated-colon-${index}-${Date.now()}`,
            category: skill.slice(0, colonIndex).trim(),
            skills: skill.slice(colonIndex + 1).trim()
          });
        });
        parsed.skills = migratedSkills;
      }

      if (!parsed.customSections) parsed.customSections = [];
      setData(parsed as ResumeData);
    } catch (error) {
      console.error("Failed to parse stored resume state", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);

  if (!templateId) {
    return <TemplateGallery onSelect={setTemplateId} />;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto grid w-full max-w-[1760px] grid-cols-[minmax(380px,520px)_1fr] gap-6 px-5 py-5 max-2xl:grid-cols-1">
        <aside className="no-print sticky top-5 h-[calc(100vh-40px)] overflow-hidden rounded-xl border border-white/70 bg-white/80 shadow-panel backdrop-blur max-2xl:static max-2xl:h-auto">
          <div className="border-b border-ink-200 p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-brass-100 bg-brass-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brass-700">
                  <Sparkles size={14} /> AI Layout Engine
                </div>
                <h1 className="font-display text-2xl font-extrabold text-ink-950">Premium Resume Builder</h1>
                <p className="mt-1 text-sm leading-6 text-ink-600">
                  Fill the form once and generate a polished ATS-safe resume in the selected template.
                </p>
              </div>
              <FileText className="mt-1 text-ink-400" size={26} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm font-bold text-ink-800 transition hover:bg-ink-50">
                <Printer size={16} /> Print
              </button>
              <button onClick={() => setData(initialResume)} className="inline-flex items-center justify-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm font-bold text-ink-800 transition hover:bg-ink-50">
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          <div className="form-scrollbar h-[calc(100%-190px)] overflow-y-auto p-5 max-2xl:h-auto">
            <ResumeForm data={data} setData={setData} />
          </div>
        </aside>

        <section className="min-w-0">
          <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Live Preview</p>
              <p className="text-sm text-ink-700">
                Template: <strong>{templateNames[templateId]}</strong> | Density: <strong className="capitalize">{profile.density}</strong> | Font: <strong>{profile.fontSizePt}pt</strong> | Estimated pages: <strong>{profile.pages}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTemplateId(null)}
              className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2 text-sm font-bold text-ink-800 transition hover:bg-ink-50"
            >
              <LayoutTemplate size={16} /> Change template
            </button>
          </div>

          <div
            className="paper-shell origin-top animate-[previewIn_420ms_ease-out] overflow-x-auto rounded-xl bg-ink-900/5 p-5 max-sm:p-2"
            style={{ "--resume-scale": "0.86" } as React.CSSProperties}
          >
            <div className="mx-auto w-[210mm] max-w-none">
              <ResumeDocument data={data} templateId={templateId} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
