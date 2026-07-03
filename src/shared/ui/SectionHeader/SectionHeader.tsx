type Props = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
};

export default function SectionHeader({ eyebrow, title, text, align = "left" }: Props) {
  return (
    <div className={`mb-9 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</p> : null}
      <h2 className="text-3xl font-bold leading-tight text-text md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-lg leading-8 text-muted">{text}</p> : null}
    </div>
  );
}
