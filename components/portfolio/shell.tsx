"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { contact, socialLinks } from "@/lib/portfolio";
import type { Stat } from "@/lib/content";
import { setupMotion } from "@/components/portfolio/motion";
import { Line } from "@/components/portfolio/line";
export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const showMobileCta = path !== "/collaborate";
  useEffect(() => {
    setMenu(false);
    let disposed = false;
    let cleanup: (() => void) | undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed || !root.current) return;
        gsap.registerPlugin(ScrollTrigger);
        cleanup = setupMotion(gsap, ScrollTrigger, root.current);
        ScrollTrigger.refresh();
      })
      .catch(() => {});
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [path]);
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menu]);
  const links = [
    ["Work", "/work"],
    ["My story", "/about"],
    ["For brands", "/partnerships"],
  ];
  return (
    <div ref={root} className={showMobileCta ? "has-mobile-cta" : undefined}>
      <div className="reading-progress" aria-hidden="true" />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header ref={header} className="header wrap">
        <Link className="wordmark" href="/">
          namrata<span> dahal</span>
          <i>.</i>
        </Link>
        <button
          className="menu-toggle"
          aria-controls="nav"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? "Close" : "Menu"}
        </button>
        <nav
          id="nav"
          className={menu ? "nav open" : "nav"}
          aria-label="Main navigation"
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              onClick={() => setMenu(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            className="nav-cta"
            href="/collaborate"
            aria-current={path === "/collaborate" ? "page" : undefined}
            onClick={() => setMenu(false)}
          >
            Let’s collaborate <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>
      {children}
      <footer className="wrap footer multi-footer">
        <div>
          <Link className="wordmark" href="/">
            namrata<span> dahal</span>
            <i>.</i>
          </Link>
          <p>Learning. Creating. Becoming.</p>
        </div>
        <div className="footer-links">
          {socialLinks.map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer">
              {name} ↗
            </a>
          ))}
        </div>
        <div className="footer-small">
          <Link href="/media-kit">Media kit</Link>
          <Link href="/partnerships">For brands</Link>
          <Link href="/privacy">Privacy</Link>
          <span>© 2026 Namrata Dahal</span>
        </div>
      </footer>
      {showMobileCta ? (
        <div className="mobile-cta">
          <Link className="button dark" href="/collaborate">
            Work with me <span aria-hidden="true">↗</span>
          </Link>
          <Link className="button outline" href="/media-kit">
            Media kit
          </Link>
        </div>
      ) : null}
    </div>
  );
}
export function ContactOptions() {
  const subject = encodeURIComponent("Brand collaboration inquiry");
  return (
    <div className="contact-options">
      {contact.email ? (
        <a href={`mailto:${contact.email}?subject=${subject}`}>✉ Email me</a>
      ) : null}
      {contact.whatsapp ? (
        <a
          href={`https://wa.me/${contact.whatsapp}?text=${subject}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp ↗
        </a>
      ) : null}
      <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
        Instagram {contact.instagramHandle} ↗
      </a>
    </div>
  );
}
export function BrandCTA() {
  return (
    <section className="closing-cta">
      <div className="wrap" data-reveal>
        <p className="eyebrow">A GOOD FIT STARTS WITH A CONVERSATION</p>
        <h2 data-lines>
          <Line>Let’s make your next</Line>
          <Line>
            <em>story matter.</em>
          </Line>
        </h2>
        <div>
          <span className="magnetic" data-magnetic>
            <Link className="button light" href="/collaborate">
              Start a collaboration <span aria-hidden="true">↗</span>
            </Link>
          </span>
          <Link className="underlink" href="/media-kit">
            Download the media kit
          </Link>
        </div>
      </div>
    </section>
  );
}
export function Proof({
  stats,
  statsDate,
}: {
  stats: Stat[];
  statsDate: string;
}) {
  return (
    <section className="proof-band">
      <div className="wrap proof-grid" data-stagger="soft">
        {stats.map(({ value, label, period }) => (
          <div key={label}>
            <strong data-count>{value}</strong>
            <p>{label}</p>
            <small>{period}</small>
          </div>
        ))}
      </div>
      <p className="data-note wrap">
        Stats as of {statsDate}.{" "}
        <Link href="/media-kit">See the media kit</Link> for details.
      </p>
    </section>
  );
}
