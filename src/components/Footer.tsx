import { nav as defaultNav, site, type NavItem } from "@/content";

type FooterBrand = { logo: string; alt: string; label: string; tagline: string };

const defaultBrand: FooterBrand = {
  logo: "/brand/isaacbot-lockup-white.svg",
  alt: site.company,
  label: `${site.company} home`,
  tagline: site.slogan,
};

type FooterProps = {
  nav?: NavItem[];
  homeHref?: string;
  topHref?: string;
  brand?: FooterBrand;
};

export default function Footer({
  nav = defaultNav,
  homeHref = "#hero",
  topHref = "#hero",
  brand = defaultBrand,
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href={homeHref} aria-label={brand.label}>
            <img src={brand.logo} alt={brand.alt} width={200} height={44} loading="lazy" />
          </a>
          <p>{brand.tagline}</p>
        </div>
        <div className="footer-col">
          <h4>Navigate</h4>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {site.year} {site.company}. All rights reserved.
        </span>
        <a href={topHref}>Back to top ↑</a>
      </div>
      {/* Oversized wordmark cropped along the bottom edge. */}
      <img
        className="footer-wordmark"
        src={brand.logo}
        alt=""
        aria-hidden="true"
        width={1189}
        height={260}
        loading="lazy"
      />
    </footer>
  );
}
