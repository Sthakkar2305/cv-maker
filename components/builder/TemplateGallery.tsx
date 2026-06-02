"use client";

import { ArrowRight, CheckCircle2, LayoutTemplate, Sparkles } from "lucide-react";
import { ResumeTemplateId } from "@/types/resume";

const templates: Array<{
  id: ResumeTemplateId;
  name: string;
  description: string;
  badge: string;
}> = [
  {
    id: "classic",
    name: "Classic ATS",
    description: "The current clean single-column resume already in your project.",
    badge: "Current"
  },
  {
    id: "sidebar",
    name: "Amelia Sidebar",
    description: "Two-column sidebar template matching the uploaded resume image.",
    badge: "Uploaded Style"
  },
  {
    id: "timeline",
    name: "Executive Timeline",
    description: "Bold dark-header layout with left contact rail and central timeline icons.",
    badge: "New"
  },
  {
    id: "green",
    name: "Green Designer",
    description: "Modern profile-sidebar resume with green accents and compact role cards.",
    badge: "New"
  }
];

function ClassicPreview() {
  return (
    <div className="template-mini template-mini-classic" aria-hidden>
      <div className="mini-name">AARAV MEHTA</div>
      <div className="mini-role" />
      <div className="mini-rule" />
      <div className="mini-section" />
      <div className="mini-lines">
        <span />
        <span />
        <span className="short" />
      </div>
      <div className="mini-section" />
      <div className="mini-lines">
        <span />
        <span />
        <span />
      </div>
      <div className="mini-section" />
      <div className="mini-lines two">
        <span />
        <span />
      </div>
    </div>
  );
}

function SidebarPreview() {
  return (
    <div className="template-mini template-mini-sidebar" aria-hidden>
      <div className="mini-sidebar-name">AMELIA DAVIS</div>
      <div className="mini-sidebar-grid">
        <div className="mini-left">
          <span className="mini-heading" />
          <span />
          <span />
          <span className="short" />
          <span className="mini-heading" />
          <span />
          <span />
        </div>
        <div className="mini-right">
          <span />
          <span />
          <span className="short" />
          <span className="mini-heading" />
          <span />
          <span />
          <span className="mini-heading" />
          <span />
          <span className="short" />
        </div>
      </div>
    </div>
  );
}

function TimelinePreview() {
  return (
    <div className="template-mini template-mini-timeline" aria-hidden>
      <div className="mini-timeline-name">AHMDD SAAH</div>
      <div className="mini-timeline-role" />
      <div className="mini-timeline-rule" />
      <div className="mini-timeline-grid">
        <div className="mini-timeline-left">
          <span className="mini-heading" />
          <span />
          <span />
          <span />
          <span className="mini-heading" />
          <span />
          <span />
        </div>
        <div className="mini-timeline-rail">
          <i />
          <i />
          <i />
        </div>
        <div className="mini-timeline-right">
          <span className="mini-heading" />
          <span />
          <span className="short" />
          <span className="mini-heading" />
          <span />
          <span />
          <span />
          <span className="mini-heading" />
          <span />
        </div>
      </div>
    </div>
  );
}

function GreenPreview() {
  return (
    <div className="template-mini template-mini-green" aria-hidden>
      <div className="mini-green-grid">
        <div className="mini-green-left">
          <div className="mini-avatar" />
          <span className="mini-green-name" />
          <span className="mini-green-role" />
          <span className="mini-heading" />
          <span />
          <span />
          <span className="mini-heading" />
          <span />
          <span />
        </div>
        <div className="mini-green-right">
          <span className="mini-heading" />
          <span />
          <span className="short" />
          <span className="mini-heading" />
          <span />
          <span />
          <span className="mini-heading" />
          <span />
        </div>
      </div>
    </div>
  );
}

function TemplatePreview({ id }: { id: ResumeTemplateId }) {
  if (id === "classic") return <ClassicPreview />;
  if (id === "sidebar") return <SidebarPreview />;
  if (id === "timeline") return <TimelinePreview />;
  return <GreenPreview />;
}

export function TemplateGallery({ onSelect }: { onSelect: (templateId: ResumeTemplateId) => void }) {
  return (
    <main className="min-h-screen px-5 py-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brass-100 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brass-700 shadow-sm">
              <Sparkles size={14} /> Select Template First
            </div>
            <h1 className="font-display text-4xl font-extrabold text-ink-950 max-sm:text-3xl">Choose your resume template</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
              Pick a professional layout, then fill the form once. The builder keeps spacing, alignment, wrapping, and print formatting polished for the selected template.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white/80 px-4 py-3 text-sm font-semibold text-ink-700 shadow-sm">
            <LayoutTemplate size={18} /> 4 production templates
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className="group overflow-hidden rounded-xl border border-ink-200 bg-white text-left shadow-panel transition hover:-translate-y-1 hover:border-ink-400 hover:shadow-paper focus:outline-none focus:ring-4 focus:ring-ink-200"
            >
              <div className="grid grid-cols-[minmax(220px,0.85fr)_1fr] gap-0 max-sm:grid-cols-1">
                <div className="bg-ink-50 p-5">
                  <TemplatePreview id={template.id} />
                </div>
                <div className="flex h-full flex-col justify-between p-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-700">
                      <CheckCircle2 size={14} /> {template.badge}
                    </span>
                    <h2 className="mt-5 font-display text-2xl font-extrabold text-ink-950">{template.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-ink-600">{template.description}</p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-ink-950">
                    Use this template <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
