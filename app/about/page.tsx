import Image from "next/image";
import Link from "next/link";
import { SiteShell, BrandCTA } from "@/components/portfolio/shell";
import { Line } from "@/components/portfolio/line";
export const metadata = { title: "My Story | Namrata Dahal" };
export default function About() {
    return (
        <SiteShell>
            <main id="main">
                <section className="wrap about-page-hero">
                    <div className="page-hero page-intro">
                        <p className="eyebrow">
                            MY STORY / STILL LEARNING, ALWAYS CREATING
                        </p>
                        <h1 data-lines>
                            <Line>A student first.</Line>
                            <Line>
                                <em>A storyteller always.</em>
                            </Line>
                        </h1>
                        <p>
                            I’m Namrata Dahal—a third-year BSc Nursing student,
                            full-scholarship recipient, and creator based in Pokhara, Nepal.
                        </p>
                        <Link className="text-link" href="/work">
                            See the stories I share ↗
                        </Link>
                    </div>
                    <figure className="real-portrait" data-parallax>
                        <Image
                            src="/namrata-portrait.jpeg"
                            alt="Namrata in her nursing uniform, photographed outside"
                            width={589}
                            height={760}
                            sizes="(max-width: 760px) 88vw, 365px"
                            priority
                        />
                    </figure>
                </section>
                <section className="wrap section story-editorial">
                    <p className="eyebrow">WHY I STARTED</p>
                    <div data-reveal>
                        <h2 data-lines>
                            <Line>I remember having</Line>
                            <Line>
                                <em>all those questions.</em>
                            </Line>
                        </h2>
                        <p className="large-copy">
                            How do I prepare? What does nursing really cost? What is life at
                            nursing college actually like?
                        </p>
                        <p>
                            After earning a full scholarship through CEE, I began sharing my
                            experience so the next student could make a more informed choice.
                            The channel grew into a place for preparation advice, honest
                            conversations, and everyday life.
                        </p>
                        <p>
                            At Pokhara Nursing Campus, TU IOM, I’m continuing to learn through
                            classes and clinical postings. On my channels, I share my
                            perspective as a student—what I have experienced, what I am
                            learning, and what I wish I had understood earlier.
                        </p>
                    </div>
                </section>
                <section className="wide-editorial wrap">
                    <figure data-unveil>
                        <Image
                            src="/images/editorial-study.png"
                            alt=" Editorial scene of Namrata at a study and content-creation desk"
                            width={1536}
                            height={1024}
                            sizes="(max-width: 760px) 100vw, 1304px"
                        />
                    </figure>
                </section>
                <section className="section wrap">
                    <div className="section-heading" data-reveal>
                        <div>
                            <p className="eyebrow">WHAT YOU’LL FIND HERE</p>
                            <h2 data-lines>
                                <Line>Three parts.</Line>
                                <Line>
                                    <em>One point of view.</em>
                                </Line>
                            </h2>
                        </div>
                    </div>
                    <div className="feature-three" data-stagger="soft">
                        {[
                            [
                                "01",
                                "The preparation",
                                "Study routines, CEE experiences, scholarship questions, and lessons from my own journey.",
                            ],
                            [
                                "02",
                                "The nursing life",
                                "Student conversations, course experiences, and the realities of learning to care for people.",
                            ],
                            [
                                "03",
                                "The person",
                                "Friendships, humor, small adventures, and the moments that make student life feel familiar.",
                            ],
                        ].map(([n, t, p]) => (
                            <article key={n} data-reveal>
                                <span>{n}</span>
                                <h3>{t}</h3>
                                <p>{p}</p>
                            </article>
                        ))}
                    </div>
                </section>
                <BrandCTA />
            </main>
        </SiteShell>
    );
}
