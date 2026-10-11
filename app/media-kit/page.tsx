import Image from "next/image";
import Link from "next/link";
import { PrintButton } from "@/components/portfolio/print-button";
import { audience, contact, skills } from "@/lib/portfolio";
import { getContent } from "@/lib/content";
export const metadata = {
  title: "Media Kit | Namrata Dahal",
  description:
    "Audience, platforms, recent performance, brand work and partnership options for Namrata Dahal, a Nepali nursing and education creator.",
};
export const revalidate = 300;
const scholarshipVideoId = "58OftPZoVlo";
export default async function MediaKit() {
  const { caseStudies, mediaKitPdf, platforms, stats, statsDate, videos } =
    await getContent();
  const scholarshipViews =
    videos.find((v) => v.id === scholarshipVideoId)?.views ?? "14K";
  return (
    <main id="main" className="media-kit">
      <div className="kit-toolbar">
        <Link href="/">← Back to portfolio</Link>
        {mediaKitPdf ? (
          <a
            className="kit-download"
            href={mediaKitPdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF ↓
          </a>
        ) : null}
        <PrintButton />
      </div>
      <header className="kit-header">
        <div>
          <p className="eyebrow">CREATOR MEDIA KIT · OCTOBER 2026</p>
          <h1>Namrata Dahal</h1>
          <p>Nursing. Education. Student life.</p>
          <small>Pokhara, Nepal · Nepali-language content</small>
        </div>
        <Image
          src="/namrata-portrait.jpeg"
          width={110}
          height={140}
          alt="Namrata Dahal"
          priority
        />
      </header>
      <p className="kit-bio">
        Third-year BSc Nursing student at Pokhara Nursing Campus, TU IOM,
        full-scholarship recipient, and creator sharing practical preparation
        advice, nursing experiences, and relatable student stories.
      </p>
      <section>
        <h2>Recent performance</h2>
        <div className="kit-stats">
          {stats.map(({ value, label, period }) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>
                {label} · {period.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>Platforms</h2>
        <table>
          <thead>
            <tr>
              <th>Platform</th>
              <th>Handle</th>
              <th>Audience</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((p) => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td>
                  <a href={p.url}>{p.handle}</a>
                </td>
                <td>
                  {[
                    p.followers,
                    p.highlight ? `${p.highlight[0]} ${p.highlight[1]}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2>Who I create for</h2>
        <table>
          <tbody>
            {audience.map(([t, d]) => (
              <tr key={t}>
                <th>{t}</th>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2>Brand work</h2>
        <table>
          <thead>
            <tr>
              <th>Brand / project</th>
              <th>Platform</th>
              <th>Views</th>
            </tr>
          </thead>
          <tbody>
            {caseStudies.map((c) => (
              <tr key={c.brand}>
                <td>
                  {c.brand} · {c.title}
                </td>
                <td>{c.platform}</td>
                <td>{c.views}</td>
              </tr>
            ))}
            <tr>
              <td>My full-scholarship journey · Original content</td>
              <td>YouTube</td>
              <td>{scholarshipViews}</td>
            </tr>
          </tbody>
        </table>
        <p className="kit-note">
          Views per video as of {statsDate}. Platform totals cover different
          time windows.
        </p>
      </section>
      <section>
        <h2>What I bring</h2>
        <ul className="kit-skills">
          {skills.map(([, t, d]) => (
            <li key={t}>
              <strong>{t}.</strong> {d}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Partnership options</h2>
        <p>
          Sponsored short-form videos · YouTube integrations · Presenter-led
          content for brand channels · Multi-part campaigns
        </p>
        <p className="kit-note">
          Deliverables, revisions, usage rights, exclusivity, and pricing agreed
          per campaign.
        </p>
      </section>
      <section className="kit-contact">
        <h2>Start a conversation</h2>
        <Link href="/collaborate">Submit a collaboration request ↗</Link>
        {contact.email ? (
          <a href={`mailto:${contact.email}`}>Email: {contact.email}</a>
        ) : null}
        {contact.whatsapp ? (
          <a href={`https://wa.me/${contact.whatsapp}`}>
            WhatsApp: +{contact.whatsapp}
          </a>
        ) : null}
        {platforms.map((p) => (
          <a key={p.name} href={p.url}>
            {p.name}: {p.handle}
          </a>
        ))}
      </section>
      <footer className="kit-note">
        I reply to collaboration requests {contact.responseTime}. All metrics
        are creator-reported, updated {statsDate}.
      </footer>
    </main>
  );
}
