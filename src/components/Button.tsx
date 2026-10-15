import type { ReactNode } from "react";

function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  /** Opens the link in a new tab. */
  external?: boolean;
};

export default function Button({ href, children, variant = "solid", external }: ButtonProps) {
  return (
    <a
      href={href}
      className={`btn btn-${variant}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      {/* Two chevrons: the second slides in on hover. */}
      <span className="btn-chevrons" aria-hidden="true">
        <Chevron />
        <Chevron />
      </span>
    </a>
  );
}
