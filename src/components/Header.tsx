"use client";

import { useEffect, useState } from "react";
import { nav as defaultNav, site, type NavItem } from "@/content";
import Button from "./Button";

type Logo = { src: string; alt: string; label: string };

const defaultLogo: Logo = {
  src: "/brand/isaacbot-lockup-black-bold.svg",
  alt: site.company,
  label: `${site.company} home`,
};

type HeaderProps = {
  nav?: NavItem[];
  homeHref?: string;
  logo?: Logo;
};

export default function Header({ nav = defaultNav, homeHref = "#hero", logo = defaultLogo }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scrolling while the mobile menu covers it.
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${scrolled || menuOpen ? "is-solid" : ""}`}>
      <div className="container header-inner">
        <a href={homeHref} className="header-logo" onClick={closeMenu} aria-label={logo.label}>
          <img src={logo.src} alt={logo.alt} width={240} height={34} />
        </a>
        <nav className={`nav ${menuOpen ? "is-open" : ""}`} aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-cta" onClick={closeMenu}>
            <Button href="#contact">Contact us</Button>
          </div>
        </nav>
        <button
          type="button"
          className={`burger ${menuOpen ? "is-open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
