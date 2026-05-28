"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createId } from "@/lib/resumeSeed";
import { joinBullets, splitBullets } from "@/lib/layoutEngine";
import { CertificationItem, EducationItem, ExperienceItem, ProjectItem, ResumeData, SkillGroup, CustomSection } from "@/types/resume";
import { Field, SectionCard } from "@/components/ui";

type Props = {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
};

type CollectionKey = "experience" | "education" | "projects" | "certifications";

const contactLabels = {
  phone: "Phone",
  email: "Email",
  linkedin: "LinkedIn",
  github: "GitHub",
  portfolio: "Portfolio",
  address: "Address"
};

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-ink-300 hover:bg-ink-50">
      {children}
    </button>
  );
}

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="rounded-md p-2 text-ink-400 transition hover:bg-red-50 hover:text-red-600">
      <Trash2 size={16} />
    </button>
  );
}

export function ResumeForm({ data, setData }: Props) {
  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => setData((current) => ({ ...current, [key]: value }));

  // Local state buffers for comma-separated lists to prevent typing glitches
  const [localLanguages, setLocalLanguages] = useState(() => data.languages.join(", "));
  const [localInterests, setLocalInterests] = useState(() => data.interests.join(", "));

  // Keep local buffers in sync if data changes externally (e.g. from parent/reset)
  useEffect(() => {
    setLocalLanguages(data.languages.join(", "));
  }, [data.languages]);

  useEffect(() => {
    setLocalInterests(data.interests.join(", "));
  }, [data.interests]);

  const updateArrayItem = <T extends { id: string }>(key: CollectionKey, id: string, patch: Partial<T>) => {
    setData((current) => ({
      ...current,
      [key]: (current[key] as unknown as T[]).map((item) => (item.id === id ? { ...item, ...patch } : item))
    }));
  };

  const removeArrayItem = (key: CollectionKey, id: string) => {
    setData((current) => ({ ...current, [key]: (current[key] as { id: string }[]).filter((item) => item.id !== id) }));
  };

  return (
    <div className="grid gap-4">
      <SectionCard title="Profile">
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Field label="Full Name" value={data.fullName} onChange={(value) => update("fullName", value)} />
            <Field label="Role / Title" value={data.title} onChange={(value) => update("title", value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            {(Object.keys(contactLabels) as Array<keyof typeof contactLabels>).map((key) => (
              <Field
                key={key}
                label={contactLabels[key]}
                value={data.contacts[key]}
                onChange={(value) => setData((current) => ({ ...current, contacts: { ...current.contacts, [key]: value } }))}
              />
            ))}
          </div>
          <Field label="Summary" value={data.summary} multiline onChange={(value) => update("summary", value)} />
        </div>
      </SectionCard>

      <SectionCard title="Skills">
        <div className="grid gap-4">
          {data.skills.map((group) => (
            <div key={group.id} className="rounded-md border border-ink-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <strong className="text-sm text-ink-800">{group.category || "Skill Category"}</strong>
                <button
                  type="button"
                  aria-label="Remove skill category"
                  onClick={() => setData((current) => ({ ...current, skills: current.skills.filter((s) => s.id !== group.id) }))}
                  className="rounded-md p-2 text-ink-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid gap-3">
                <Field
                  label="Category Title"
                  value={group.category}
                  onChange={(val) =>
                    setData((current) => ({
                      ...current,
                      skills: current.skills.map((s) => (s.id === group.id ? { ...s, category: val } : s))
                    }))
                  }
                  placeholder="e.g. Programming Skills"
                />
                <Field
                  label="Skills"
                  value={group.skills}
                  onChange={(val) =>
                    setData((current) => ({
                      ...current,
                      skills: current.skills.map((s) => (s.id === group.id ? { ...s, skills: val } : s))
                    }))
                  }
                  placeholder="e.g. React, Next.js, Node.js"
                />
              </div>
            </div>
          ))}
          <GhostButton
            onClick={() =>
              update("skills", [
                ...data.skills,
                { id: createId(), category: "", skills: "" }
              ])
            }
          >
            <Plus size={16} /> Add skill category
          </GhostButton>
        </div>
      </SectionCard>

      <SectionCard title="Experience">
        <div className="grid gap-4">
          {data.experience.map((item) => (
            <div key={item.id} className="rounded-md border border-ink-200 p-3">
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-sm text-ink-800">{item.company || "Experience"}</strong>
                <RemoveButton label="Remove experience" onClick={() => removeArrayItem("experience", item.id)} />
              </div>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <Field label="Company" value={item.company} onChange={(value) => updateArrayItem<ExperienceItem>("experience", item.id, { company: value })} />
                <Field label="Role" value={item.role} onChange={(value) => updateArrayItem<ExperienceItem>("experience", item.id, { role: value })} />
                <Field label="Duration" value={item.duration} onChange={(value) => updateArrayItem<ExperienceItem>("experience", item.id, { duration: value })} />
                <Field label="Location" value={item.location} onChange={(value) => updateArrayItem<ExperienceItem>("experience", item.id, { location: value })} />
              </div>
              <div className="mt-3">
                <Field label="Achievements / Bullets" multiline value={joinBullets(item.bullets)} onChange={(value) => updateArrayItem<ExperienceItem>("experience", item.id, { bullets: splitBullets(value) })} />
              </div>
            </div>
          ))}
          <GhostButton
            onClick={() =>
              update("experience", [
                ...data.experience,
                { id: createId(), company: "", role: "", duration: "", location: "", bullets: [""] }
              ])
            }
          >
            <Plus size={16} /> Add experience
          </GhostButton>
        </div>
      </SectionCard>

      <SectionCard title="Education">
        <div className="grid gap-4">
          {data.education.map((item) => (
            <div key={item.id} className="rounded-md border border-ink-200 p-3">
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-sm text-ink-800">{item.school || "Education"}</strong>
                <RemoveButton label="Remove education" onClick={() => removeArrayItem("education", item.id)} />
              </div>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <Field label="School" value={item.school} onChange={(value) => updateArrayItem<EducationItem>("education", item.id, { school: value })} />
                <Field label="Degree" value={item.degree} onChange={(value) => updateArrayItem<EducationItem>("education", item.id, { degree: value })} />
                <Field label="Duration" value={item.duration} onChange={(value) => updateArrayItem<EducationItem>("education", item.id, { duration: value })} />
                <Field label="Location" value={item.location} onChange={(value) => updateArrayItem<EducationItem>("education", item.id, { location: value })} />
              </div>
              <div className="mt-3">
                <Field label="Details" value={item.details} multiline onChange={(value) => updateArrayItem<EducationItem>("education", item.id, { details: value })} />
              </div>
            </div>
          ))}
          <GhostButton onClick={() => update("education", [...data.education, { id: createId(), school: "", degree: "", duration: "", location: "", details: "" }])}>
            <Plus size={16} /> Add education
          </GhostButton>
        </div>
      </SectionCard>

      <SectionCard title="Projects">
        <div className="grid gap-4">
          {data.projects.map((item) => (
            <div key={item.id} className="rounded-md border border-ink-200 p-3">
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-sm text-ink-800">{item.name || "Project"}</strong>
                <RemoveButton label="Remove project" onClick={() => removeArrayItem("projects", item.id)} />
              </div>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <Field label="Project Name" value={item.name} onChange={(value) => updateArrayItem<ProjectItem>("projects", item.id, { name: value })} />
                <Field label="Tech Stack" value={item.stack} onChange={(value) => updateArrayItem<ProjectItem>("projects", item.id, { stack: value })} />
                <Field label="Link" value={item.link} onChange={(value) => updateArrayItem<ProjectItem>("projects", item.id, { link: value })} />
              </div>
              <div className="mt-3">
                <Field label="Bullets" multiline value={joinBullets(item.bullets)} onChange={(value) => updateArrayItem<ProjectItem>("projects", item.id, { bullets: splitBullets(value) })} />
              </div>
            </div>
          ))}
          <GhostButton onClick={() => update("projects", [...data.projects, { id: createId(), name: "", stack: "", link: "", bullets: [""] }])}>
            <Plus size={16} /> Add project
          </GhostButton>
        </div>
      </SectionCard>

      <SectionCard title="Additional Sections">
        <div className="grid gap-3">
          <div className="grid gap-4">
            {data.certifications.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_1fr_90px_auto] gap-2 max-sm:grid-cols-1">
                <Field label="Certification" value={item.name} onChange={(value) => updateArrayItem<CertificationItem>("certifications", item.id, { name: value })} />
                <Field label="Issuer" value={item.issuer} onChange={(value) => updateArrayItem<CertificationItem>("certifications", item.id, { issuer: value })} />
                <Field label="Year" value={item.year} onChange={(value) => updateArrayItem<CertificationItem>("certifications", item.id, { year: value })} />
                <div className="self-end"><RemoveButton label="Remove certification" onClick={() => removeArrayItem("certifications", item.id)} /></div>
              </div>
            ))}
            <GhostButton onClick={() => update("certifications", [...data.certifications, { id: createId(), name: "", issuer: "", year: "" }])}>
              <Plus size={16} /> Add certification
            </GhostButton>
          </div>
          <Field label="Achievements" multiline value={joinBullets(data.achievements)} onChange={(value) => update("achievements", splitBullets(value))} />
          <Field
            label="Languages"
            value={localLanguages}
            onChange={(val) => {
              setLocalLanguages(val);
              const parsed = val.split(",").map((item) => item.trim()).filter(Boolean);
              if (JSON.stringify(parsed) !== JSON.stringify(data.languages)) {
                update("languages", parsed);
              }
            }}
          />
          <Field
            label="Interests"
            value={localInterests}
            onChange={(val) => {
              setLocalInterests(val);
              const parsed = val.split(",").map((item) => item.trim()).filter(Boolean);
              if (JSON.stringify(parsed) !== JSON.stringify(data.interests)) {
                update("interests", parsed);
              }
            }}
          />
        </div>
      </SectionCard>

      {data.customSections?.map((section, idx) => (
        <SectionCard key={section.id} title={section.title || `Custom Section ${idx + 1}`}>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <strong className="text-sm text-ink-800">Dynamic Section</strong>
              <button
                type="button"
                aria-label="Remove custom section"
                onClick={() =>
                  setData((current) => ({
                    ...current,
                    customSections: current.customSections.filter((s) => s.id !== section.id)
                  }))
                }
                className="rounded-md p-2 text-ink-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <Field
              label="Section Title"
              value={section.title}
              onChange={(val) =>
                setData((current) => ({
                  ...current,
                  customSections: current.customSections.map((s) => (s.id === section.id ? { ...s, title: val } : s))
                }))
              }
              placeholder="e.g. Volunteering, Publications, Extracurriculars"
            />
            <Field
              label="Section Content"
              multiline
              value={section.content}
              onChange={(val) =>
                setData((current) => ({
                  ...current,
                  customSections: current.customSections.map((s) => (s.id === section.id ? { ...s, content: val } : s))
                }))
              }
              placeholder="Enter your content here. Use bullet points starting with - or * if you like!"
            />
          </div>
        </SectionCard>
      ))}

      <div className="mt-2 mb-4 flex justify-center">
        <GhostButton
          onClick={() =>
            setData((current) => ({
              ...current,
              customSections: [
                ...(current.customSections || []),
                { id: createId(), title: "", content: "" }
              ]
            }))
          }
        >
          <Plus size={16} /> Add Custom Section
        </GhostButton>
      </div>
    </div>
  );
}
