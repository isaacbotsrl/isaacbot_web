import Button from "@/components/Button";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import RoverArm3D from "@/components/RoverArm3D";
import SectionTitle from "@/components/SectionTitle";
import { hero, mission, project, team, techLinks, type NavItem } from "@/content";

export const dynamic = "force-dynamic";

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero-grid">
        <Reveal className="hero-copy">
          <SectionTitle eyebrow={hero.eyebrow} titleLines={hero.titleLines} as="h1" />
          <p className="lead">{hero.lead}</p>
          <div className="actions">
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} variant="outline">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </Reveal>
        <Reveal className="hero-visual" delay={150}>
          <RoverArm3D />
        </Reveal>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section id="mission" className="section">
      <div className="container">
        <Reveal className="section-head">
          <SectionTitle eyebrow={mission.eyebrow} titleLines={mission.titleLines} />
        </Reveal>
        <div className="mission-grid">
          {mission.columns.map((col, i) => (
            <Reveal key={col.label} className="mission-col" delay={i * 100}>
              <h3>{col.label}</h3>
              <p>{col.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="values">
          <p className="values-label">{mission.valuesLabel}</p>
          <ul>
            {mission.values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="section section-grey">
      <div className="container split">
        <Reveal className="split-copy">
          <SectionTitle eyebrow={project.eyebrow} titleLines={project.titleLines} />
          {project.paragraphs.map((p) => (
            <p key={p} className="body">
              {p}
            </p>
          ))}
          <div className="actions">
            <Button href={project.cta.href} external={project.cta.newTab}>
              {project.cta.label}
            </Button>
          </div>
        </Reveal>
        <Reveal className="split-visual project-visual" delay={120}>
          <img
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            loading="lazy"
          />
        </Reveal>
      </div>
      <div className="container">
        <ul className="stats">
          {project.stats.map((stat, i) => (
            <Reveal as="li" key={stat.label} className="stat" delay={i * 60}>
              <span className="stat-value">
                {stat.value}
                <small>{stat.unit}</small>
              </span>
              <span className="stat-label">{stat.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="team" className="section section-grey">
      <div className="container">
        <Reveal className="section-head">
          <SectionTitle eyebrow={team.eyebrow} titleLines={team.titleLines} />
          <p className="body">{team.intro}</p>
        </Reveal>
        <ul className="team-grid">
          {team.members.map((member, i) => (
            <Reveal as="li" key={member.name} className="member" delay={i * 80}>
              <div className="member-photo">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} loading="lazy" />
                ) : (
                  <span className="member-initials" aria-hidden="true">
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                )}
              </div>
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <blockquote>“{member.quote}”</blockquote>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TechStrip({ items }: { items: NavItem[] }) {
  return (
    <section className="strip" aria-label="Capabilities">
      <ul className="container strip-list">
        {items.map((item) => (
          <li key={item.label}>
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              <span className="strip-dot" aria-hidden="true" />
              <span className="strip-label">{item.label}</span>
              <span className="strip-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Projects />
        <Mission />
        <Team />
        <Contact />
        <TechStrip items={techLinks} />
      </main>
      <Footer />
    </>
  );
}
