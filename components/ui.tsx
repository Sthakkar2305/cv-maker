import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const shared =
    "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-ink-500 focus:ring-4 focus:ring-ink-100";

  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</span>
      {multiline ? (
        <textarea className={cn(shared, "min-h-24 resize-y")} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={shared} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-ink-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-display text-base font-bold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}
