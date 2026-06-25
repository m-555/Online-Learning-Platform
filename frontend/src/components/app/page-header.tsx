export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-[26px] font-bold tracking-tight text-ink">{title}</h1>
      {subtitle ? <p className="mt-1 text-[14px] text-muted">{subtitle}</p> : null}
    </div>
  );
}
