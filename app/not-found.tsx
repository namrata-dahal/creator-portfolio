import Link from "next/link";
import { SiteShell } from "@/components/portfolio/shell";
import { Line } from "@/components/portfolio/line";
export const metadata = { title: "Page not found | Namrata Dahal" };
const next = [
  [
    "/work",
    "Selected work",
    "Videos, brand campaigns, and the views each one earned.",
    "Watch my work",
  ],
  [
    "/partnerships",
    "For brands",
    "Formats, process, and how a collaboration comes together.",
    "Read the guide",
  ],
  [
    "/about",
    "My story",
    "From a CEE scholarship to nursing life in Pokhara.",
    "Read my story",
  ],
];
export default function NotFound() {
  return (
    <SiteShell>
      <main id="main">
        <section className="wrap lost-page">
          <div className="page-hero page-intro">
            <p className="eyebrow">ERROR 404 · PAGE NOT FOUND</p>
            <h1 data-lines>
              <Line>Lost the thread?</Line>
              <Line>
                <em>Let’s pick it up.</em>
              </Line>
            </h1>
            <p>
              The page you’re looking for may have moved, or the link may be out
              of date. Everything else is right where it should be.
            </p>
            <div className="hero-actions">
              <Link className="button dark" href="/">
                Back to home <span>↗</span>
              </Link>
              <Link className="text-link" href="/collaborate">
                Start a collaboration <span>↗</span>
              </Link>
            </div>
          </div>
          <div className="lost-mark" aria-hidden="true">
            <p className="lost-number" data-lines>
              <Line>404</Line>
            </p>
            <div className="lost-sticker" data-sticker>
              <span>✳</span>
              <p>
                Wrong turn,
                <br />
                right place.
                <em>Say hello anyway.</em>
              </p>
            </div>
          </div>
        </section>
        <section className="wrap lost-next">
          <p className="eyebrow">WHERE TO NEXT</p>
          <div className="lost-links" data-stagger>
            {next.map(([href, title, text, cta]) => (
              <Link key={href} href={href}>
                <strong>{title}</strong>
                <small>{text}</small>
                <span>{cta} ↗</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
