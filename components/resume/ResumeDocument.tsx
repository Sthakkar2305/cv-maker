import React from "react";
import { BriefcaseBusiness, CircleUserRound, Clock3, GraduationCap, Globe, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { getLayoutProfile } from "@/lib/layoutEngine";
import { ContactLinks, ResumeData, ResumeTemplateId } from "@/types/resume";

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
  return (
    <section className="resume-section">
      <h2 className="resume-section-title">{mapSectionTitle(title)}</h2>
      {children}
    </section>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="sidebar-section">
      <h2 className="sidebar-heading">{title}</h2>
      {children}
    </section>
  );
}

function ContactRow({ contacts }: { contacts: ContactLinks }) {
  const items: React.ReactNode[] = [];

  if (contacts.phone) items.push(<span key="phone">{contacts.phone}</span>);
  if (contacts.email) {
    items.push(
      <a key="email" href={`mailto:${contacts.email}`} className="text-[#0044cc] hover:underline">
        {contacts.email}
      </a>
    );
  }
  if (contacts.linkedin) {
    const label = contacts.linkedin.replace(/^https?:\/\/(www\.)?/, "");
    items.push(
      <a key="linkedin" href={contacts.linkedin.startsWith("http") ? contacts.linkedin : `https://${contacts.linkedin}`} className="text-black hover:underline">
        {label}
      </a>
    );
  }
  if (contacts.github) {
    const label = contacts.github.replace(/^https?:\/\/(www\.)?/, "");
    items.push(
      <a key="github" href={contacts.github.startsWith("http") ? contacts.github : `https://${contacts.github}`} className="text-black hover:underline">
        {label}
      </a>
    );
  }
  if (contacts.portfolio) {
    const label = contacts.portfolio.replace(/^https?:\/\/(www\.)?/, "");
    items.push(
      <a key="portfolio" href={contacts.portfolio.startsWith("http") ? contacts.portfolio : `https://${contacts.portfolio}`} className="text-black hover:underline">
        {label}
      </a>
    );
  }
  if (contacts.address) items.push(<span key="address">{contacts.address}</span>);

  if (!items.length) return null;

  return (
    <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[0.88em] text-black">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="px-0.5 font-bold text-gray-500">|</span>}
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
        <li key={`${item}-${index}`} className="text-justify text-black">
          {item}
        </li>
      ))}
    </ul>
  );
}

function CustomSectionContent({ content }: { content: string }) {
  if (!content) return null;
  const lines = content.split("\n");
  const hasBullets = lines.some((line) => {
    const trimmed = line.trim();
    return trimmed.startsWith("-") || trimmed.startsWith("*");
  });

  if (hasBullets) {
    return (
      <ul className="resume-bullets">
        {lines.map((line, index) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
            return (
              <li key={index} className="text-justify text-black">
                {trimmed.replace(/^[-*]\s*/, "")}
              </li>
            );
          }
          return trimmed ? (
            <li key={index} className="mt-1 list-none text-justify text-black">
              {line}
            </li>
          ) : (
            <div key={index} className="h-1" />
          );
        })}
      </ul>
    );
  }

  return <p className="whitespace-pre-line text-justify text-black">{content}</p>;
}

function DotRating({ value = 5 }: { value?: number }) {
  return (
    <span className="dot-rating" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < value ? "is-filled" : ""} />
      ))}
    </span>
  );
}

function GreenBars({ value = 4 }: { value?: number }) {
  return (
    <span className="green-bars" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < value ? "is-filled" : ""} />
      ))}
    </span>
  );
}

function SkillLines({ data }: { data: ResumeData }) {
  if (!data.skills.length) return null;
  return (
    <div className="flex flex-col gap-0.5">
      {data.skills
        .filter((group) => group.category || group.skills)
        .map((group, index) => (
          <p key={group.id || index} className="text-black">
            {group.category ? <strong className="font-bold">{group.category}: </strong> : null}
            {group.skills}
          </p>
        ))}
    </div>
  );
}

function ClassicResume({ data }: { data: ResumeData }) {
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
      aria-label="Classic resume preview"
    >
      <div className="resume-page">
        <header className="text-center">
          <h1 data-resume-name className="font-serif text-[2.1em] font-bold leading-none tracking-normal text-black">
            {data.fullName || "Your Name"}
          </h1>
          {data.title && <p className="mt-1 text-[1.05em] font-semibold uppercase tracking-wide text-black">{data.title}</p>}
          <ContactRow contacts={data.contacts} />
          <div className="mb-3 mt-2 w-full border-t border-black" />
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
                    <span className="whitespace-nowrap text-right font-semibold text-black">{item.duration}</span>
                  </div>
                  <p className="mt-0.5 font-medium text-black">
                    {item.school}
                    {item.location ? `, ${item.location}` : ""}
                  </p>
                  {item.details ? <p className="mt-0.5 text-justify text-black">{item.details}</p> : null}
                </div>
              ))}
            </div>
          </Section>
        )}

        {!!data.skills.length && (
          <Section title="Skills">
            <SkillLines data={data} />
          </Section>
        )}

        {!!data.projects.length && (
          <Section title="Projects">
            <div className="grid gap-[var(--resume-gap)]">
              {data.projects.map((item) => (
                <div key={item.id} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-bold text-black">{item.name}</h3>
                    {item.link ? <span className="whitespace-nowrap text-[0.9em] text-[#0044cc]">{item.link}</span> : null}
                  </div>
                  {item.stack ? <p className="mt-0.5 font-medium text-black">{item.stack}</p> : null}
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
                    <span className="whitespace-nowrap text-right font-semibold text-black">
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
          <div className="mt-[var(--resume-section-gap)] grid grid-cols-1 gap-[var(--resume-gap)]">
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

function SidebarResume({ data }: { data: ResumeData }) {
  const profile = getLayoutProfile(data);
  const leftContacts = [
    ["Name", data.fullName],
    ["Address", data.contacts.address],
    ["Phone", data.contacts.phone],
    ["Email", data.contacts.email],
    ["LinkedIn", data.contacts.linkedin],
    ["Portfolio", data.contacts.portfolio]
  ].filter(([, value]) => value);

  return (
    <article
      id="resume-export"
      className="resume-paper shadow-paper"
      style={
        {
          "--resume-font": `${Math.max(8.3, profile.fontSizePt - 0.2)}pt`,
          "--resume-section-gap": `${profile.sectionGapPx}px`,
          "--resume-gap": `${profile.itemGapPx}px`
        } as React.CSSProperties
      }
      aria-label="Sidebar resume preview"
    >
      <div className="resume-page resume-page-sidebar">
        <header className="sidebar-name-box" data-resume-name>
          {data.fullName || "Your Name"}
        </header>

        <div className="sidebar-layout">
          <aside className="sidebar-left">
            <SidebarSection title="Personal Details">
              <dl className="sidebar-detail-list">
                {leftContacts.map(([label, value]) => (
                  <div key={label}>
                    <dt>
                      <strong>{label}</strong>
                    </dt>
                    <dd className="break-words">{value}</dd>
                  </div>
                ))}
              </dl>
            </SidebarSection>

            {!!data.interests.length && (
              <SidebarSection title="Interests">
                <ul className="grid gap-1.5 pl-3 text-[0.9em]">
                  {data.interests.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </SidebarSection>
            )}

            {!!data.languages.length && (
              <SidebarSection title="Languages">
                <div className="text-[0.9em]">
                  {data.languages.map((language, index) => (
                    <div className="rating-row" key={language}>
                      <span>{language}</span>
                      <DotRating value={Math.max(3, 5 - (index % 3))} />
                    </div>
                  ))}
                </div>
              </SidebarSection>
            )}
          </aside>

          <main className="sidebar-main">
            {data.summary && <p className="mb-4 text-justify text-black">{data.summary}</p>}

            {!!data.experience.length && (
              <SidebarSection title="Work Experience">
                <div className="grid gap-[var(--resume-gap)]">
                  {data.experience.map((item) => (
                    <div key={item.id} className="break-inside-avoid">
                      <div className="flex items-baseline justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-black">{item.role}</h3>
                          <p className="font-semibold text-black">{item.company}</p>
                        </div>
                        <p className="whitespace-nowrap text-right text-[0.9em] font-semibold text-black">{item.duration}</p>
                      </div>
                      {item.location ? <p className="text-[0.92em] text-black">{item.location}</p> : null}
                      <Bullets items={item.bullets} />
                    </div>
                  ))}
                </div>
              </SidebarSection>
            )}

            {!!data.education.length && (
              <SidebarSection title="Education and Qualifications">
                <div className="grid gap-[var(--resume-gap)]">
                  {data.education.map((item) => (
                    <div key={item.id} className="break-inside-avoid">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-bold text-black">{item.degree}</h3>
                        <span className="whitespace-nowrap text-right text-[0.9em] font-semibold text-black">{item.duration}</span>
                      </div>
                      <p className="font-semibold text-black">
                        {item.school}
                        {item.location ? `, ${item.location}` : ""}
                      </p>
                      {item.details ? <p className="mt-1 text-justify text-black">{item.details}</p> : null}
                    </div>
                  ))}
                </div>
              </SidebarSection>
            )}

            {!!data.skills.length && (
              <SidebarSection title="Skills">
                <div className="text-[0.94em]">
                  {data.skills
                    .filter((group) => group.category || group.skills)
                    .map((group, index) => (
                      <div className="rating-row" key={group.id || index}>
                        <span>{group.category || group.skills.split(",")[0]}</span>
                        <DotRating value={Math.max(3, 5 - (index % 2))} />
                      </div>
                    ))}
                </div>
              </SidebarSection>
            )}

            {!!data.projects.length && (
              <SidebarSection title="Projects">
                <div className="grid gap-[var(--resume-gap)]">
                  {data.projects.map((item) => (
                    <div key={item.id} className="break-inside-avoid">
                      <h3 className="font-bold text-black">{item.name}</h3>
                      {item.stack ? <p className="font-semibold text-black">{item.stack}</p> : null}
                      <Bullets items={item.bullets} />
                    </div>
                  ))}
                </div>
              </SidebarSection>
            )}

            {data.customSections?.map((section) => (
              <SidebarSection key={section.id} title={section.title || "Additional Details"}>
                <CustomSectionContent content={section.content} />
              </SidebarSection>
            ))}

            {(!!data.certifications.length || !!data.achievements.length) && (
              <SidebarSection title="References">
                {!!data.certifications.length && (
                  <ul className="grid gap-1.5 text-black">
                    {data.certifications.map((item) => (
                      <li key={item.id}>
                        <strong>{item.name}</strong>
                        <span> - {item.issuer} {item.year}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {!!data.achievements.length && <Bullets items={data.achievements} />}
              </SidebarSection>
            )}
          </main>
        </div>
      </div>
    </article>
  );
}

function TimelineResume({ data }: { data: ResumeData }) {
  const profile = getLayoutProfile(data);
  const contacts = [
    { icon: Phone, value: data.contacts.phone },
    { icon: Mail, value: data.contacts.email },
    { icon: MapPin, value: data.contacts.address },
    { icon: Globe, value: data.contacts.portfolio || data.contacts.linkedin || data.contacts.github }
  ].filter((item) => item.value);

  return (
    <article
      id="resume-export"
      className="resume-paper shadow-paper"
      style={
        {
          "--resume-font": `${Math.max(8.8, profile.fontSizePt - 0.25)}pt`,
          "--resume-section-gap": `${profile.sectionGapPx}px`,
          "--resume-gap": `${profile.itemGapPx}px`
        } as React.CSSProperties
      }
      aria-label="Timeline resume preview"
    >
      <div className="resume-page timeline-page">
        <header className="timeline-header">
          <h1 data-resume-name>{data.fullName || "Your Name"}</h1>
          {data.title ? <p>{data.title}</p> : null}
          <div className="timeline-top-rule" />
        </header>

        <div className="timeline-grid">
          <aside>
            {!!contacts.length && (
              <section className="timeline-left-section">
                <h2 className="timeline-heading">Contact</h2>
                <ul className="timeline-contact-list">
                  {contacts.map(({ icon: Icon, value }) => (
                    <li key={value}>
                      <Icon size={15} fill="currentColor" strokeWidth={2.4} />
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!!data.skills.length && (
              <section className="timeline-left-section">
                <h2 className="timeline-heading">Skills</h2>
                <ul className="timeline-simple-list">
                  {data.skills.flatMap((group) => group.skills.split(",").map((skill) => skill.trim()).filter(Boolean)).slice(0, 10).map((skill) => (
                    <li key={skill}>
                      <span>•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!!data.languages.length && (
              <section className="timeline-left-section">
                <h2 className="timeline-heading">Languages</h2>
                <ul className="timeline-simple-list">
                  {data.languages.map((language) => (
                    <li key={language}>
                      <span>•</span>
                      <span>{language}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!!data.certifications.length && (
              <section className="timeline-left-section">
                <h2 className="timeline-heading">Reference</h2>
                {data.certifications.slice(0, 2).map((item) => (
                  <p key={item.id} className="mb-2 text-[0.95em] leading-5">
                    <strong>{item.name}</strong>
                    <br />
                    {item.issuer} {item.year}
                  </p>
                ))}
              </section>
            )}
          </aside>

          <div className="timeline-rail" aria-hidden>
            <span className="timeline-node"><CircleUserRound size={18} /></span>
            <span className="timeline-node"><BriefcaseBusiness size={18} /></span>
            <span className="timeline-node"><GraduationCap size={18} /></span>
          </div>

          <main>
            {data.summary && (
              <section className="timeline-main-section">
                <h2 className="timeline-heading">Profile</h2>
                <p className="text-justify text-[1.08em] leading-6">{data.summary}</p>
              </section>
            )}

            {!!data.experience.length && (
              <section className="timeline-main-section">
                <h2 className="timeline-heading">Work Experience</h2>
                {data.experience.map((item) => (
                  <div className="timeline-entry" key={item.id}>
                    <div className="timeline-entry-head">
                      <div>
                        <h3>{item.company}</h3>
                        <p className="role">{item.role}</p>
                      </div>
                      <p className="date">{item.duration}</p>
                    </div>
                    <Bullets items={item.bullets} />
                  </div>
                ))}
              </section>
            )}

            {!!data.education.length && (
              <section className="timeline-main-section">
                <h2 className="timeline-heading">Education</h2>
                {data.education.map((item) => (
                  <div className="timeline-entry" key={item.id}>
                    <div className="timeline-entry-head">
                      <div>
                        <h3>{item.degree}</h3>
                        <p className="role">{item.school}{item.location ? ` | ${item.location}` : ""}</p>
                      </div>
                      <p className="date">{item.duration}</p>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </main>
        </div>
      </div>
    </article>
  );
}

function GreenResume({ data }: { data: ResumeData }) {
  const profile = getLayoutProfile(data);
  const skills = data.skills.flatMap((group) => group.skills.split(",").map((skill) => skill.trim()).filter(Boolean));
  const contacts = [
    { icon: Mail, value: data.contacts.email },
    { icon: MapPin, value: data.contacts.address },
    { icon: Clock3, value: data.title },
    { icon: UserRound, value: data.title ? data.title.split(" ").slice(-2).join(" ") : "" },
    { icon: Phone, value: data.contacts.phone },
    { icon: Globe, value: data.contacts.portfolio || data.contacts.linkedin }
  ].filter((item) => item.value);

  return (
    <article
      id="resume-export"
      className="resume-paper shadow-paper"
      style={
        {
          "--resume-font": `${Math.max(8.8, profile.fontSizePt - 0.2)}pt`,
          "--resume-section-gap": `${profile.sectionGapPx}px`,
          "--resume-gap": `${profile.itemGapPx}px`
        } as React.CSSProperties
      }
      aria-label="Green designer resume preview"
    >
      <div className="resume-page green-page">
        <aside className="green-left">
          <div className="green-avatar" aria-hidden={!data.photoUrl}>
            {data.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.photoUrl} alt="" />
            ) : null}
          </div>
          <h1 data-resume-name className="green-name">{data.fullName || "Your Name"}</h1>
          {data.title ? <p className="green-role">{data.title}</p> : null}

          <section className="green-section">
            <h2 className="green-section-title">Contact</h2>
            <ul className="green-contact-list">
              {contacts.map(({ icon: Icon, value }) => (
                <li key={value}>
                  <Icon size={14} />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </section>

          {!!skills.length && (
            <section className="green-section">
              <h2 className="green-section-title">Technical Skills</h2>
              {skills.slice(0, 8).map((skill, index) => (
                <div className="green-skill-row" key={skill}>
                  <span>{skill}</span>
                  <GreenBars value={Math.max(3, 5 - (index % 3))} />
                </div>
              ))}
            </section>
          )}
        </aside>

        <main className="green-main">
          {data.summary && (
            <section className="green-section">
              <h2 className="green-section-title">Professional Summary</h2>
              <p className="green-summary">{data.summary}</p>
            </section>
          )}

          {!!data.experience.length && (
            <section className="green-section">
              <h2 className="green-section-title">Employment</h2>
              {data.experience.map((item, index) => (
                <div className="green-entry" key={item.id}>
                  <div className="green-entry-head">
                    <h3>{item.role}</h3>
                    <span className="status">{index % 2 === 0 ? "Full Time" : "Part Time"}</span>
                  </div>
                  <div className="green-meta">
                    <span><Globe size={11} /> {item.company}</span>
                    {item.location ? <span><MapPin size={11} /> {item.location}</span> : null}
                    <span><Clock3 size={11} /> {item.duration}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {!!data.education.length && (
            <section className="green-section">
              <h2 className="green-section-title">Education</h2>
              {data.education.map((item) => (
                <div className="green-entry" key={item.id}>
                  <h3>{item.degree}</h3>
                  <div className="green-meta">
                    <span><MapPin size={11} /> {item.school}{item.location ? `, ${item.location}` : ""}</span>
                    <span><Clock3 size={11} /> {item.duration}</span>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </article>
  );
}

export function ResumeDocument({ data, templateId = "classic" }: { data: ResumeData; templateId?: ResumeTemplateId }) {
  if (templateId === "sidebar") return <SidebarResume data={data} />;
  if (templateId === "timeline") return <TimelineResume data={data} />;
  if (templateId === "green") return <GreenResume data={data} />;
  return <ClassicResume data={data} />;
}
