import Image from "next/image";
import Link from "next/link";
import {
    SiteShell,
    BrandCTA,
    Proof,
    ContactOptions,
} from "@/components/portfolio/shell";
import { Platforms } from "@/components/portfolio/showcase";
import { Line } from "@/components/portfolio/line";
import { contact, services } from "@/lib/portfolio";
import { getContent } from "@/lib/content";
export const metadata = {
    title: "Brand Partnership Guide | Work With Namrata Dahal",
    description:
        "Explore campaign formats, the collaboration process, usage rights, review stages, and how to request a proposal from Namrata Dahal.",
};
const terms = [
    [
        "Deliverables",
        "Video count, format, length, platform, posting or delivery date.",
    ],
    [
        "Usage rights",
        "Where the content can appear, for how long, and whether paid advertising is included.",
    ],
    [
        "Revisions",
        "The number of review rounds and what changes fall within the agreed brief.",
    ],
    [
        "Exclusivity",
        "Any competitor restrictions, with the category and duration defined.",
    ],
    [
        "Results",
        "Available views, engagement, and tracked clicks. Conversion data requires brand-side tracking.",
    ],
    [
        "Transparency",
        "Paid partnerships are disclosed. Product claims must be supportable and opinions remain honest.",
    ],
];
const faqs = [
    [
        "What does a brand partnership include?",
        "The agreed creative work and deliverables: for example, a sponsored video on my channel or a video produced for your channels. The written scope sets the format, length, platforms, dates, revisions, payment terms, and usage rights.",
    ],
    [
        "Do you offer content without posting it to your audience?",
        "Yes. Presenter-led content can be created for your brand’s own social pages. Audience posting, paid advertising, and extended usage are separate options to agree in the brief.",
    ],
    [
        "How is pricing decided?",
        "Pricing depends on the number of deliverables, research and production required, platforms, timeline, usage period, advertising rights, and exclusivity. Share a budget range in your inquiry so we can discuss a realistic scope.",
    ],
    [
        "Can we run the video as a paid advertisement?",
        "Only when advertising usage is explicitly agreed. Organic posting rights do not automatically include paid ads, partnership ads, or unrestricted reuse. Include platforms, duration, and intended use in your inquiry.",
    ],
    [
        "Can we review the content before it goes live?",
        "Yes. Review stages and revision rounds are agreed before production. Factual corrections and changes within the agreed brief are discussed separately from new concepts, reshoots, or expanded scope.",
    ],
    [
        "Can you guarantee views, sales, or admissions?",
        "No. Past performance shows previous reach, not a guarantee. We can agree a clear message, call to action, and tracking approach; purchases and admissions depend on factors beyond the content itself.",
    ],
    [
        "Which brands are the best fit?",
        "Education and preparation tools, nursing resources, student essentials, and relevant lifestyle products. The product, its claims, and its usefulness to viewers are considered before accepting a partnership.",
    ],
    [
        "What happens after I submit an inquiry?",
        `Your request goes straight to my private inbox. I aim to reply ${contact.responseTime} at the email you provide. Submitting a request does not confirm a booking or reserve a date.`,
    ],
];
export const revalidate = 300;
export default async function Partnerships() {
    const { stats, statsDate } = await getContent();
    return (
        <SiteShell>
            <main id="main">
                <section className="wrap partnership-hero">
                    <div className="page-hero page-intro">
                        <p className="eyebrow">THE BRAND PARTNERSHIP GUIDE</p>
                        <h1 data-lines>
                            <Line>A clear process.</Line>
                            <Line>
                                <em>A genuine connection.</em>
                            </Line>
                        </h1>
                        <p>
                            Everything you need to explore a collaboration—from choosing a
                            format to agreeing the brief and measuring what happened.
                        </p>
                        <div className="hero-actions">
                            <Link className="button dark" href="/collaborate">
                                Request a proposal <span>↗</span>
                            </Link>
                            <Link className="text-link" href="/media-kit">
                                Download media kit ↗
                            </Link>
                        </div>
                    </div>
                    <figure data-parallax data-unveil>
                        <Image
                            src="/images/editorial-portrait.png"
                            alt=" Editorial portrait of Namrata"
                            width={1122}
                            height={1402}
                            sizes="(max-width: 760px) 260px, 25vw"
                            priority
                        />
                    </figure>
                </section>
                <Proof stats={stats} statsDate={statsDate} />
                <Platforms />
                <section className="wrap section">
                    <div className="section-heading" data-reveal>
                        <div>
                            <p className="eyebrow">01 / CHOOSE THE RIGHT FORMAT</p>
                            <h2 data-lines>
                                <Line>What would you</Line>
                                <Line>
                                    <em>like to create?</em>
                                </Line>
                            </h2>
                        </div>
                        <p>
                            These are starting points. The final proposal is tailored to your
                            goal, audience, and production needs.
                        </p>
                    </div>
                    <div className="offer-grid" data-stagger>
                        {services.map((s, i) => (
                            <article key={s.title} data-reveal>
                                <div className="offer-top">
                                    <span>0{i + 1}</span>
                                    <p className="eyebrow">{s.tag}</p>
                                </div>
                                <h3>{s.title}</h3>
                                <p className="offer-short">{s.short}</p>
                                <p>{s.description}</p>
                                <ul>
                                    {s.items.map((x) => (
                                        <li key={x}>{x}</li>
                                    ))}
                                </ul>
                                <Link
                                    className="text-link"
                                    href={`/collaborate?format=${encodeURIComponent(s.format)}`}
                                >
                                    Discuss this format ↗
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
                <section className="process-section" data-process-pin>
                    <div className="wrap section">
                        <div className="section-heading" data-reveal>
                            <div>
                                <p className="eyebrow">02 / FROM FIRST HELLO TO FINAL STORY</p>
                                <h2 data-lines>
                                    <Line>Good work starts</Line>
                                    <Line>
                                        <em>with a good brief.</em>
                                    </Line>
                                </h2>
                            </div>
                        </div>
                        <div className="process-track">
                            <span className="process-line" data-process aria-hidden="true" />
                            {[
                                [
                                    "Share your brief",
                                    "Tell me about the product, goal, audience, budget, and timeline.",
                                ],
                                [
                                    "Agree the scope",
                                    "We confirm fit, deliverables, usage, review rounds, fee, and payment schedule.",
                                ],
                                [
                                    "Create & review",
                                    "I develop the concept and content, with the agreed review stages before delivery.",
                                ],
                                [
                                    "Publish & learn",
                                    "Content goes live or is delivered. We review the available results against the agreed goal.",
                                ],
                            ].map(([t, p], i) => (
                                <article key={t} data-reveal data-step>
                                    <span>0{i + 1}</span>
                                    <h3>{t}</h3>
                                    <p>{p}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="wrap section">
                    <div className="section-heading" data-reveal>
                        <div>
                            <p className="eyebrow">03 / A FEW IMPORTANT DETAILS</p>
                            <h2 data-lines>
                                <Line>Clear expectations.</Line>
                                <Line>
                                    <em>Better partnerships.</em>
                                </Line>
                            </h2>
                        </div>
                    </div>
                    <div
                        className="terms-table"
                        data-stagger="soft"
                        role="table"
                        aria-label="Partnership terms to agree"
                    >
                        {terms.map(([k, v]) => (
                            <div key={k} role="row">
                                <strong role="cell">{k}</strong>
                                <p role="cell">{v}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="wrap faq-section">
                    <div>
                        <p className="eyebrow">BEFORE YOU ASK</p>
                        <h2 data-lines>
                            <Line>A little more</Line>
                            <Line>
                                <em>clarity.</em>
                            </Line>
                        </h2>
                        <p className="response-note">
                            Still have a question?{" "}
                            <strong>I reply {contact.responseTime}.</strong>
                        </p>
                        <ContactOptions />
                    </div>
                    <div>
                        {faqs.map(([q, a]) => (
                            <details key={q}>
                                <summary>
                                    {q}
                                    <span aria-hidden="true">+</span>
                                </summary>
                                <p>{a}</p>
                            </details>
                        ))}
                    </div>
                </section>
                <BrandCTA />
            </main>
        </SiteShell>
    );
}
