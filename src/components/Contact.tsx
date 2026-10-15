import { contact, site } from "@/content";
import Button from "./Button";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal className="contact-inner">
          <SectionTitle eyebrow={contact.eyebrow} titleLines={contact.titleLines} />
          <p className="body">{contact.text}</p>
          <div className="actions actions-center">
            <Button href={`mailto:${site.contactEmail}`}>{contact.ctaLabel}</Button>
          </div>
          <a className="contact-email" href={`mailto:${site.contactEmail}`}>
            {site.contactEmail}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
