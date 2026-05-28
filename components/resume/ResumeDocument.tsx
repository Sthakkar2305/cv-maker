import React from "react";
import { getLayoutProfile } from "@/lib/layoutEngine";
import { ContactLinks, ResumeData, SkillGroup, CustomSection } from "@/types/resume";

function mapSectionTitle(title: string) {
  const upper = title.toUpperCase();
  if (upper.includes("SUMMARY") || upper.includes("PROFESSIONAL SUMMARY")) return "SUMMARY";
  if (upper.includes("EDUCATION")) return "EDUCATION";
  if (upper.includes("SKILL")) return "SKILLS";
  if (upper.includes("EXPERIENCE") || upper.includes("PROFESSIONAL EXPERIENCE")) return "EXPERIENCE";
  if (upper.includes("PROJECT")) return "PROJECTS";
  if (upper.includes("ACHIEVEMENT") || upper.includes("EXTRA-CURRICULAR")) return "EXTRA-CURRICULAR ACTIVITIES";
  return upper;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const mappedTitle = mapSectionTitle(title);
  return (
    <section className="resume-section">
      <h2 className="resume-section-title">{mappedTitle}</h2>
      {children}
    </section>
  );
}

function ContactRow({ contacts }: { contacts: ContactLinks }) {
  const items: React.ReactNode[] = [];
  
  if (contacts.phone) {
    items.push(<span key="phone">{contacts.phone}</span>);
  }
  if (contacts.email) {
    items.push(
      <a
        key="email"
        href={`mailto:${contacts.email}`}
        className="text-[#0044cc] hover:underline"
      >
        {contacts.email}
      </a>
    );
  }
  if (contacts.linkedin) {
    const label = contacts.linkedin.replace(/^https?:\/\/(www\.)?/, "");
    items.push(
      <a
        key="linkedin"
        href={contacts.linkedin.startsWith("http") ? contacts.linkedin : `https://${contacts.linkedin}`}
        className="text-black hover:underline"
      >
        {label}
      </a>
    );
  }
  if (contacts.github) {
    const label = contacts.github.replace(/^https?:\/\/(www\.)?/, "");
    items.push(
      <a
        key="github"
        href={contacts.github.startsWith("http") ? contacts.github : `https://${contacts.github}`}
        className="text-black hover:underline"
      >
        {label}
      </a>
    );
  }
  if (contacts.portfolio) {
    const label = contacts.portfolio.replace(/^https?:\/\/(www\.)?/, "");
    items.push(
      <a
        key="portfolio"
        href={contacts.portfolio.startsWith("http") ? contacts.portfolio : `https://${contacts.portfolio}`}
        className="text-black hover:underline"
      >
        {label}
      </a>
    );
  }
  if (contacts.address) {
    items.push(<span key="address">{contacts.address}</span>);
  }

  if (items.length === 0) return null;

  return (
    <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[0.88em] text-black">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-gray-500 font-bold px-0.5">•</span>}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (!items.filter(Boolean).length) return null;
  return (
    <ul className="resume-bullets">
      {items.filter(Boolean).map((item, index) => (
        <li key={`${item}-${index}`} className="text-black text-justify">{item}</li>
      ))}
    </ul>
  );
}

function CustomSectionContent({ content }: { content: string }) {
  if (!content) return null;
  const lines = content.split("\n");
  const hasBullets = lines.some((line) => {
    const trimmed = line.trim();
    return trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*");
  });

  if (hasBullets) {
    return (
      <ul className="resume-bullets">
        {lines.map((line, index) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*")) {
            return (
              <li key={index} className="text-black text-justify">
                {trimmed.replace(/^[-•*]\s*/, "")}
              </li>
            );
          }
          return trimmed ? (
            <li key={index} className="list-none text-black text-justify mt-1">
              {line}
            </li>
          ) : (
            <div key={index} className="h-1" />
          );
        })}
      </ul>
    );
  }

  return <p className="text-justify text-black whitespace-pre-line">{content}</p>;
}

export function ResumeDocument({ data }: { data: ResumeData }) {
  const profile = getLayoutProfile(data);

  return (
    <article
      id="resume-export"
      className="resume-paper shadow-paper"
      style={
        {
          "--resume-font": `${profile.fontSizePt}pt`,
          "--resume-section-gap": `${profile.sectionGapPx}px`,
          "--resume-gap": `${profile.itemGapPx}px`
        } as React.CSSProperties
      }
      aria-label="Resume preview"
    >
      <div className="resume-page">
        <header className="text-center">
          <h1 data-resume-name className="font-serif text-[2.1em] font-bold leading-none tracking-normal text-black">
            {data.fullName || "Your Name"}
          </h1>
          {data.title && (
            <p className="text-[1.05em] font-semibold text-black mt-1 uppercase tracking-wide">
              {data.title}
            </p>
          )}
          <ContactRow contacts={data.contacts} />
          <div className="w-full border-t border-black mt-2 mb-3"></div>
        </header>

        {data.summary && (
          <Section title="Professional Summary">
            <p className="text-justify text-black">{data.summary}</p>
          </Section>
        )}

        {!!data.education.length && (
          <Section title="Education">
            <div className="grid gap-[var(--resume-gap)]">
              {data.education.map((item) => (
                <div key={item.id} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-bold text-black">{item.degree}</h3>
                    <span className="font-semibold text-black text-right whitespace-nowrap">{item.duration}</span>
                  </div>
                  <p className="font-medium text-black mt-0.5">
                    {item.school}
                    {item.location ? `, ${item.location}` : ""}
                  </p>
                  {item.details ? <p className="mt-0.5 text-black text-justify">{item.details}</p> : null}
                </div>
              ))}
            </div>
          </Section>
        )}

        {!!data.skills.length && (
          <Section title="Skills">
            <div className="flex flex-col gap-0.5">
              {data.skills.filter(group => group.category || group.skills).map((group, index) => {
                return (
                  <p key={group.id || index} className="text-black">
                    {group.category ? (
                      <strong className="font-bold">{group.category}: </strong>
                    ) : null}
                    {group.skills}
                  </p>
                );
              })}
            </div>
          </Section>
        )}

        {!!data.projects.length && (
          <Section title="Projects">
            <div className="grid gap-[var(--resume-gap)]">
              {data.projects.map((item) => (
                <div key={item.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline gap-4">
                    <h3 className="font-bold text-black">{item.name}</h3>
                    {item.link ? (
                      <span className="text-[0.9em] text-[#0044cc] hover:underline whitespace-nowrap">{item.link}</span>
                    ) : null}
                  </div>
                  {item.stack ? <p className="font-medium text-black mt-0.5">{item.stack}</p> : null}
                  <Bullets items={item.bullets} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {!!data.experience.length && (
          <Section title="Professional Experience">
            <div className="grid gap-[var(--resume-gap)]">
              {data.experience.map((item) => (
                <div key={item.id} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-bold text-black">
                      {item.company}
                      {item.role ? `, ${item.role}` : ""}
                    </span>
                    <span className="font-semibold text-black text-right whitespace-nowrap">
                      {item.duration}
                      {item.location ? ` | ${item.location}` : ""}
                    </span>
                  </div>
                  <Bullets items={item.bullets} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.customSections?.map((section) => (
          <Section key={section.id} title={section.title || "Custom Section"}>
            <CustomSectionContent content={section.content} />
          </Section>
        ))}

        {(!!data.certifications.length || !!data.achievements.length || !!data.languages.length || !!data.interests.length) && (
          <div className="grid grid-cols-1 gap-[var(--resume-gap)] mt-[var(--resume-section-gap)]">
            {!!data.certifications.length && (
              <Section title="Certifications">
                <ul className="resume-bullets">
                  {data.certifications.map((item) => (
                    <li key={item.id} className="text-black">
                      <strong className="font-bold">{item.name}</strong>
                      <span> - {item.issuer} {item.year}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {!!data.achievements.length && (
              <Section title="Achievements">
                <Bullets items={data.achievements} />
              </Section>
            )}

            {!!data.languages.length && (
              <Section title="Languages">
                <p className="text-black">{data.languages.filter(Boolean).join(" | ")}</p>
              </Section>
            )}

            {!!data.interests.length && (
              <Section title="Interests">
                <p className="text-black">{data.interests.filter(Boolean).join(" | ")}</p>
              </Section>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
