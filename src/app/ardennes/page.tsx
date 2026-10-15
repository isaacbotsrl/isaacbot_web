import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Button from "@/components/Button";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import { site } from "@/content";
import { ardennes } from "./content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${site.product} · ${site.company}`,
  description: ardennes.metaDescription,
};

function Hero() {
  const { hero } = ardennes;
  return (
    <section id="top" className="a-hero">
      <div className="container">
        <Reveal>
          <SectionTitle eyebrow={hero.eyebrow} titleLines={hero.titleLines} as="h1" />
          <p className="lead">{hero.lead}</p>
          <div className="actions actions-center">
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} variant="outline">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </Reveal>
        <Reveal className="a-hero-visual" delay={150}>
          <div className="hero-halo" aria-hidden="true" />
          <img src={hero.image.src} alt={hero.image.alt} width={hero.image.width} height={hero.image.height} />
        </Reveal>
      </div>
    </section>
  );
}

/** Numbered jump links to the features. */
function FeatureIndex() {
  const { features } = ardennes;
  return (
    <nav className="a-index" aria-label="Key features">
      <ul className="container" style={{ "--count": features.length } as CSSProperties}>
        {features.map((feature, i) => (
          <li key={feature.id}>
            <a href={`#${feature.id}`}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {feature.eyebrow}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Statement() {
  const { statement } = ardennes;
  return (
    <section id="overview" className="a-band">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{statement.eyebrow}</p>
          <p className="a-statement">
            {statement.lead} <span>{statement.rest}</span>
          </p>
          <div className="actions">
            <Button href={statement.cta.href}>{statement.cta.label}</Button>
          </div>
        </Reveal>
        <Reveal className="a-band-visual" delay={120}>
          <img
            src={statement.image.src}
            alt={statement.image.alt}
            width={statement.image.width}
            height={statement.image.height}
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Features() {
  const { featuresHead, features } = ardennes;
  return (
    <section id="features" className="section">
      <div className="container">
        <Reveal className="section-head">
          <SectionTitle eyebrow={featuresHead.eyebrow} titleLines={featuresHead.titleLines} />
        </Reveal>
        <div className="a-features">
          {features.map((feature) => (
            <article key={feature.id} id={feature.id} className="a-feature">
              <Reveal>
                <p className="eyebrow">{feature.eyebrow}</p>
                <h3>{feature.title}</h3>
                <p className="body">{feature.text}</p>
                <ul>
                  {feature.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="a-feature-media" delay={120}>
                {feature.media.kind === "image" ? (
                  <img
                    src={feature.media.src}
                    alt={feature.media.alt}
                    width={feature.media.width}
                    height={feature.media.height}
                    loading="lazy"
                  />
                ) : (
                  <p className={`a-figure ${feature.media.value.length > 6 ? "a-figure-long" : ""}`}>
                    <strong>
                      {feature.media.value}
                      {feature.media.unit && <small>{feature.media.unit}</small>}
                    </strong>
                    <span>{feature.media.label}</span>
                  </p>
                )}
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Specs() {
  const { specs } = ardennes;
  return (
    <section id="specs" className="section section-grey">
      <div className="container">
        <Reveal className="section-head">
          <SectionTitle eyebrow={specs.eyebrow} titleLines={specs.titleLines} />
        </Reveal>
        <div className="a-specs">
          <Reveal as="div" className="a-specs-visual">
            <figure style={{ margin: 0 }}>
              <img
                src={specs.image.src}
                alt={specs.image.alt}
                width={specs.image.width}
                height={specs.image.height}
                loading="lazy"
              />
              <figcaption>{specs.image.caption}</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={120}>
            {specs.groups.map((group) => (
              <div key={group.title} className="a-spec-group">
                <h3>{group.title}</h3>
                <dl>
                  {group.rows.map(([term, value]) => (
                    <div key={term}>
                      <dt>{term}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            <p className="a-specs-note">{specs.note}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Software() {
  const { software } = ardennes;
  return (
    <section id="software" className="section">
      <div className="container">
        <Reveal className="section-head">
          <SectionTitle eyebrow={software.eyebrow} titleLines={software.titleLines} />
          <p className="body">{software.intro}</p>
        </Reveal>
        <ul className="a-stack">
          {software.items.map((item, i) => (
            <Reveal as="li" key={item.name} delay={(i % 3) * 80}>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function ArdennesPage() {
  const { brand, nav } = ardennes;
  return (
    <>
      <Header nav={nav} homeHref="#top" logo={{ src: brand.logo, alt: brand.alt, label: "Ardennes, back to top" }} />
      <main>
        <Hero />
        <FeatureIndex />
        <Statement />
        <Features />
        <Specs />
        <Software />
        <Contact />
      </main>
      <Footer
        nav={[...nav, { label: `${site.company} home`, href: "/" }]}
        homeHref="#top"
        topHref="#top"
        brand={{ logo: brand.logoWhite, alt: brand.alt, label: "Ardennes, back to top", tagline: brand.tagline }}
      />
    </>
  );
}
