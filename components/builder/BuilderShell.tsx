"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Printer, RotateCcw, Sparkles } from "lucide-react";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { ResumeForm } from "@/components/builder/ResumeForm";
import { exportResumeAsPdf } from "@/lib/exportResume";
import { getLayoutProfile } from "@/lib/layoutEngine";
import { initialResume } from "@/lib/resumeSeed";
import { ResumeData, SkillGroup, CustomSection } from "@/types/resume";

const storageKey = "premium-resume-builder-state";

export function BuilderShell() {
  const [data, setData] = useState<ResumeData>(initialResume);
  const [isExporting, setIsExporting] = useState(false);
  const profile = useMemo(() => getLayoutProfile(data), [data]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as any;
        let migrated = false;

        // Migrate old string[] skills to SkillGroup[]
        if (parsed.skills && parsed.skills.length > 0 && typeof parsed.skills[0] === "string") {
          const plainSkills: string[] = [];
          const colonSkills: string[] = [];
          
          parsed.skills.forEach((skill: any) => {
            if (typeof skill === "string") {
              if (skill.includes(":")) {
                colonSkills.push(skill);
              } else {
                plainSkills.push(skill);
              }
            }
          });

          const migratedSkills: SkillGroup[] = [];
          if (plainSkills.length > 0) {
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
          migrated = true;
        }

        // Initialize customSections if missing
        if (!parsed.customSections) {
          parsed.customSections = [];
          migrated = true;
        }

        setData(parsed as ResumeData);
      } catch (err) {
        console.error("Failed to parse or migrate stored state", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);

  async function handlePdfExport() {
    setIsExporting(true);
    try {
      await exportResumeAsPdf();
    } finally {
      setIsExporting(false);
    }
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
                  Typed form input becomes a polished ATS-safe A4 resume with adaptive spacing, smart wrapping, and print-ready export.
                </p>
              </div>
              <FileText className="mt-1 text-ink-400" size={26} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button onClick={handlePdfExport} disabled={isExporting} className="inline-flex items-center justify-center gap-2 rounded-md bg-ink-950 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-ink-800 disabled:cursor-wait disabled:opacity-70">
                <Download size={16} /> {isExporting ? "Exporting" : "PDF"}
              </button>
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
                Density: <strong className="capitalize">{profile.density}</strong> · Font: <strong>{profile.fontSizePt}pt</strong> · Estimated pages: <strong>{profile.pages}</strong>
              </p>
            </div>
            <p className="max-w-xl text-sm leading-6 text-ink-600">
              The renderer compresses section gaps and font scale as content grows while keeping semantic headings, selectable text, and ATS-friendly lists.
            </p>
          </div>

          <div
            className="paper-shell origin-top animate-[previewIn_420ms_ease-out] overflow-x-auto rounded-xl bg-ink-900/5 p-5 max-sm:p-2"
            style={{ "--resume-scale": "0.86" } as React.CSSProperties}
          >
            <div className="mx-auto w-[210mm] max-w-none">
              <ResumeDocument data={data} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
