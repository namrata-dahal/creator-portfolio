import Image from "next/image";
import Link from "next/link";
import { SiteShell, BrandCTA, Proof } from "@/components/portfolio/shell";
import { VideoLibrary } from "@/components/portfolio/video-library";
import { BrandTikToks, Skills } from "@/components/portfolio/showcase";
import { Line } from "@/components/portfolio/line";
import { getContent } from "@/lib/content";
export const revalidate = 300;
export default async function Home() {
    const { caseStudies, stats, statsDate, videos, videoViewsDate } =
        await getContent();
    return (
        <SiteShell>
            <main id="main">
                <section className="hero wrap home-v2">
                    <div className="hero-copy page-intro">
                        <p className="eyebrow">
                            <span className="status-dot" /> NAMRATA DAHAL · CREATOR &amp;
                            NURSING STUDENT
                        </p>
                        <h1 data-lines>
                            <Line>Nursing life.</Line>
                            <Line>Student stories.</Line>
                            <Line>
                                <em>Real connection.</em>
                            </Line>
                        </h1>
                        <p className="intro">
                            I turn what I learn, live, and care about into stories for the
                            next generation of Nepali students.
                        </p>
                        <div className="hero-actions">
                            <Link className="button dark" href="/collaborate">
                                Work with me <span>↗</span>
                            </Link>
                            <Link className="text-link" href="/work">
                                Watch my work <span>↗</span>
                            </Link>
                        </div>
                        <div className="hero-signoff">
                            <span>Pokhara, Nepal · Stories in Nepali</span>
                            <span>BSc Nursing, Pokhara Nursing Campus · TU IOM</span>
                        </div>
                    </div>
                    <figure className="portrait-composition" data-parallax>
                        <div className="portrait-frame editorial-frame">
                            <Image
                                src="/images/editorial-portrait.png"
                                alt=" Editorial portrait of Namrata Dahal in a sage overshirt"
                                width={1122}
                                height={1402}
                                sizes="(max-width: 760px) 90vw, 40vw"
                                priority
                            />
                            <span className="photo-label">
                                A STUDENT. A CREATOR. STILL BECOMING.
                            </span>
                        </div>
                        <div className="portrait-sticker" data-sticker>
                            <span aria-hidden="true">✳</span>
                            <p>
                                A little science.
                                <br />A little life.
                                <br />
                                <em>All my own voice.</em>
                            </p>
                        </div>
                        <figcaption className="portrait-caption">
                            <span>नमस्ते, I’m Namrata.</span>
                        </figcaption>
                    </figure>
                </section>
                <Proof stats={stats} statsDate={statsDate} />
                <section className="wrap collaborators">
                    <p className="eyebrow">BRANDS I’VE CREATED CONTENT FOR</p>
                    <div data-wipe>
                        {caseStudies.map((c) => (
                            <span key={c.brand}>{c.brand}</span>
                        ))}
                    </div>
                </section>
                <BrandTikToks />
                <section className="section wrap">
                    <div className="section-heading" data-reveal>
                        <div>
                            <p className="eyebrow">THE WORK, IN MY OWN WORDS</p>
                            <h2 data-lines>
                                <Line>Press play.</Line>
                                <Line>
                                    <em>Get to know my voice.</em>
                                </Line>
                            </h2>
                        </div>
                        <p>
                            Personal experience, practical questions, and conversations that
                            feel like talking to a senior who has been there.
                        </p>
                    </div>
                    <VideoLibrary
                        videos={videos}
                        viewsDate={videoViewsDate}
                        featured
                    />
                    <Link className="button outline" href="/work">
                        Explore all selected work <span>↗</span>
                    </Link>
                </section>
                <section className="home-story">
                    <div className="wrap story-split">
                        <figure data-unveil>
                            <Image
                                src="/images/editorial-study.png"
                                alt="Namrata writing notes beside a phone on a tripod"
                                width={1536}
                                height={1024}
                                sizes="(max-width: 760px) 100vw, 55vw"
                            />
                        </figure>
                        <div data-reveal>
                            <p className="eyebrow">THE PERSON BEHIND THE POSTS</p>
                            <h2 data-lines>
                                <Line>A scholarship opened</Line>
                                <Line>
                                    <em>a new chapter.</em>
                                </Line>
                            </h2>
                            <p>
                                Now I share the questions, lessons, and everyday moments that
                                come with studying nursing. It’s the kind of perspective I
                                wanted when I was starting out.
                            </p>
                            <Link className="text-link" href="/about">
                                Read my story <span>↗</span>
                            </Link>
                        </div>
                    </div>
                </section>
                <Skills />
                <BrandCTA />
            </main>
        </SiteShell>
    );
}
