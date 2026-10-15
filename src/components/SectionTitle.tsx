type SectionTitleProps = {
  eyebrow: string;
  /** One line per entry; every line after the first is greyed. */
  titleLines: string[];
  as?: "h1" | "h2";
};

export default function SectionTitle({ eyebrow, titleLines, as: Tag = "h2" }: SectionTitleProps) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <Tag className={Tag === "h1" ? "display" : "title"}>
        {titleLines.map((line) => (
          <span key={line} className="title-line">
            {line}
          </span>
        ))}
      </Tag>
    </>
  );
}
