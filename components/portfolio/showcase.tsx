import { audience, skills } from "@/lib/portfolio";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { TikTokPlayer } from "@/components/portfolio/tiktok-player";
import { Line } from "@/components/portfolio/line";
export function Skills({ heading = true }: { heading?: boolean }) {
  return (
    <section className="section wrap">
      {heading ? (
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">WHAT I BRING TO A COLLABORATION</p>
            <h2 data-lines>
              <Line>More than a face</Line>
              <Line>
                <em>on camera.</em>
              </Line>
            </h2>
          </div>
          <p>
            I plan, script, present and edit my own content, so your brief is
            handled by one person who knows the audience.
          </p>
        </div>
      ) : null}
      <div className="skills-grid" data-stagger>
        {skills.map(([icon, title, text]) => (
          <article key={title} data-reveal>
            <span aria-hidden="true">{icon}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export async function Platforms() {
  const { platforms, statsDate } = await getContent();
  return (
    <section className="section wrap">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">WHERE YOUR STORY CAN LIVE</p>
          <h2 data-lines>
            <Line>Four platforms.</Line>
            <Line>
              <em>One trusted voice.</em>
            </Line>
          </h2>
        </div>
        <p>
          Nepali-language content for students, shared across short-form and
          long-form channels. Stats as of {statsDate}.
        </p>
      </div>
      <div className="platform-grid" data-stagger>
        {platforms.map((p) => {
          const main = p.highlight?.[0] ?? p.followers;
          return (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
            >
              <p className="eyebrow">{p.name}</p>
              {main ? (
                <strong data-count>{main}</strong>
              ) : (
                <strong className="handle">{p.handle}</strong>
              )}
              <small>
                {p.highlight
                  ? [p.highlight[1], p.followers].filter(Boolean).join(" · ")
                  : main
                    ? null
                    : "Follow along"}
              </small>
              <span>{main ? p.handle : "View profile"} ↗</span>
            </a>
          );
        })}
      </div>
      <div className="audience-list" data-stagger="soft">
        {audience.map(([title, text]) => (
          <div key={title} data-reveal>
            <strong>{title}</strong>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export async function BrandTikToks() {
  const { caseStudies } = await getContent();
  const withVideo = caseStudies.filter((c) => c.tiktokId);
  if (withVideo.length === 0) return null;
  return (
    <section className="section wrap brand-tiktoks">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">BRAND WORK ON TIKTOK</p>
          <h2 data-lines>
            <Line>Real briefs.</Line>
            <Line>
              <em>Real reach.</em>
            </Line>
          </h2>
        </div>
        <p>
          TikTok is where most of my audience finds me. These are the sponsored
          videos I made for education brands, with the views each one earned.
        </p>
      </div>
      <div className="short-grid" data-stagger>
        {withVideo.map((c) => (
          <article key={c.brand} className="short-card" data-reveal>
            <TikTokPlayer
              id={c.tiktokId!}
              title={`${c.brand}: ${c.title}`}
              views={c.views}
              poster={c.poster}
              brand={c.brand}
            />
            <h3>{c.brand}</h3>
            <p>{c.title}</p>
          </article>
        ))}
      </div>
      <Link className="button outline" href="/work#brand-work">
        See what each brand needed <span>↗</span>
      </Link>
    </section>
  );
}
export async function CaseStudies() {
  const { caseStudies } = await getContent();
  return (
    <>
      <div className="campaign-grid" data-stagger>
        {caseStudies.map((c) => (
          <article
            key={c.brand}
            className={c.tiktokId ? "has-video" : undefined}
            data-reveal
          >
            {c.tiktokId ? (
              <div className="case-media">
                <TikTokPlayer
                  id={c.tiktokId}
                  title={`${c.brand}: ${c.title}`}
                  poster={c.poster}
                  brand={c.brand}
                />
              </div>
            ) : null}
            <div className="case-body">
              <p className="eyebrow">
                {c.brand} · {c.platform}
              </p>
              <strong className="case-views">
                <span data-count>{c.views}</span>
                <small>{c.viewsLabel}</small>
              </strong>
              <h3>{c.title}</h3>
              <dl className="case-rows">
                <div>
                  <dt>The goal</dt>
                  <dd>{c.goal}</dd>
                </div>
                <div>
                  <dt>What I made</dt>
                  <dd>{c.made}</dd>
                </div>
              </dl>
              {c.quote ? (
                <blockquote className="case-quote">
                  “{c.quote.text}”<cite>{c.quote.by}</cite>
                </blockquote>
              ) : null}
              <div className="case-links">
                {c.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="fineprint">
        TikTok’s player loads only after you press play.{" "}
        <a href="/privacy">Privacy details</a>.
      </p>
    </>
  );
}
