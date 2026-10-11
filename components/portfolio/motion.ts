import type { gsap as GsapInstance } from "gsap";
import type { ScrollTrigger as ScrollTriggerStatic } from "gsap/ScrollTrigger";

type Gsap = typeof GsapInstance;
type ScrollTriggerType = typeof ScrollTriggerStatic;

const pinnedProcess = "(min-width: 900px) and (min-height: 700px)";

const lineTargets = (el: Element) =>
  el.querySelectorAll<HTMLElement>(":scope > span > *");

export function setupMotion(
  gsap: Gsap,
  ScrollTrigger: ScrollTriggerType,
  root: HTMLElement,
) {
  const q = gsap.utils.selector(root);

  const ctx = gsap.context(() => {
    const restores: (() => void)[] = [];

    const intro = gsap.timeline();
    q(".page-intro").forEach((block) => {
      let at = 0;
      for (const el of Array.from(block.children)) {
        if (el.hasAttribute("data-lines")) {
          const lines = lineTargets(el);
          intro.fromTo(
            lines,
            { yPercent: 110 },
            { yPercent: 0, duration: 1.1, stagger: 0.1, ease: "expo.out" },
            at,
          );
          at += lines.length * 0.1 + 0.1;
        } else {
          intro.fromTo(
            el,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.75, ease: "power2.out" },
            at,
          );
          at += 0.09;
        }
      }
    });

    const portrait = root.querySelector(".portrait-composition");
    const frame = portrait?.querySelector(".portrait-frame");
    if (portrait && frame) {
      intro
        .fromTo(
          frame,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "expo.inOut",
            clearProps: "clipPath",
          },
          0,
        )
        .fromTo(
          frame.querySelector("img"),
          { scale: 1.18 },
          { scale: 1, duration: 1.8, ease: "expo.out" },
          0.15,
        )
        .fromTo(
          portrait.querySelectorAll(".photo-label, .portrait-caption"),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" },
          1,
        );
    }

    q("[data-sticker]").forEach((sticker) => {
      const rotation = Number(gsap.getProperty(sticker, "rotation"));
      intro.fromTo(
        sticker,
        { opacity: 0, y: 40, rotation: rotation - 15 },
        { opacity: 1, y: 0, rotation, duration: 1.1, ease: "back.out(1.7)" },
        0.85,
      );
    });

    const polaroid = root.querySelector(".real-portrait");
    if (polaroid)
      intro.fromTo(
        polaroid,
        { opacity: 0, rotation: -9, scale: 0.9 },
        {
          opacity: 1,
          rotation: 2,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.4)",
        },
        0.25,
      );

    q("[data-unveil]").forEach((el) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      tl.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.inOut" },
      ).fromTo(
        el.querySelector("img"),
        { scale: 1.2 },
        { scale: 1, duration: 1.6, ease: "expo.out" },
        0,
      );
    });

    q("[data-lines]").forEach((el) => {
      if (el.closest(".page-intro")) return;
      gsap.fromTo(
        lineTargets(el),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    });

    q("[data-reveal]")
      .filter((el) => !el.parentElement?.hasAttribute("data-stagger"))
      .forEach((el) =>
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          },
        ),
      );

    q("[data-stagger]").forEach((group) => {
      const items = Array.from(group.children);
      const soft = group.getAttribute("data-stagger") === "soft";
      gsap.set(items, soft ? { opacity: 0, y: 18 } : { opacity: 0, y: 48, scale: 0.97 });
      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            overwrite: true,
            clearProps: "transform",
          }),
      });
    });

    q("[data-wipe]").forEach((group) =>
      gsap.fromTo(
        group.children,
        { clipPath: "inset(0% 100% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          stagger: 0.12,
          ease: "power3.inOut",
          clearProps: "clipPath",
          scrollTrigger: { trigger: group, start: "top 92%", once: true },
        },
      ),
    );

    q("[data-count]").forEach((el) => {
      const text = el.textContent ?? "";
      const match = text.match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
      if (!match) return;
      const [, before, digits, after] = match;
      const decimals = digits.split(".")[1]?.length ?? 0;
      const format = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: digits.includes(","),
      });
      const counter = { value: 0 };
      const render = () => {
        el.textContent = before + format.format(counter.value) + after;
      };
      // React won't rewrite text it already rendered, so an interrupted count must be undone.
      restores.push(() => {
        el.textContent = text;
      });
      gsap.to(counter, {
        value: parseFloat(digits.replace(/,/g, "")),
        duration: 1.8,
        ease: "power3.out",
        onStart: render,
        onUpdate: render,
        onComplete: () => {
          el.textContent = text;
        },
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });

    gsap.fromTo(
      ".reading-progress",
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: "max",
          scrub: 0.2,
        },
      },
    );

    return () => restores.forEach((restore) => restore());
  }, root);

  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 900px)",
    () => {
      q("[data-parallax]").forEach((el) =>
        gsap.to(el, {
          y: -22,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }),
      );
    },
    root,
  );

  mm.add(
    pinnedProcess,
    () => {
      const section = root.querySelector<HTMLElement>("[data-process-pin]");
      const line = section?.querySelector("[data-process]");
      if (!section || !line) return;
      const steps = Array.from(section.querySelectorAll("[data-step]"));
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: () =>
            section.offsetHeight < window.innerHeight
              ? "center center"
              : "top top",
          end: "+=900",
          scrub: 0.6,
          // Refresh before the reveal triggers below it so they account for the pin spacing.
          refreshPriority: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      steps.forEach((step, i) => {
        const at = i / steps.length;
        const badge = step.querySelector(":scope > span");
        if (badge)
          tl.fromTo(
            badge,
            { scale: 0.6, backgroundColor: "#b9c4ad" },
            {
              scale: 1,
              backgroundColor: getComputedStyle(badge).backgroundColor,
              duration: 0.08,
              ease: "back.out(2)",
            },
            at,
          );
        tl.fromTo(
          step.querySelectorAll("h3, p"),
          { opacity: 0.25 },
          { opacity: 1, duration: 0.1 },
          at,
        );
      });
      tl.to({}, { duration: 0.2 });
    },
    root,
  );

  mm.add(
    `not all and ${pinnedProcess}`,
    () => {
      q("[data-process]").forEach((el) =>
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top 80%",
              end: "bottom 50%",
              scrub: 0.6,
            },
          },
        ),
      );
    },
    root,
  );

  mm.add(
    "(min-width: 900px) and (pointer: fine)",
    () => {
      const detach = q("[data-magnetic]").map((el) => {
        const arrow = el.querySelector(".button > span");
        const ease = { duration: 0.6, ease: "power3" };
        const x = gsap.quickTo(el, "x", ease);
        const y = gsap.quickTo(el, "y", ease);
        const ax = arrow ? gsap.quickTo(arrow, "x", ease) : null;
        const ay = arrow ? gsap.quickTo(arrow, "y", ease) : null;
        const move = (e: Event) => {
          const { clientX, clientY } = e as PointerEvent;
          const r = el.getBoundingClientRect();
          const dx = clientX - (r.left + r.width / 2);
          const dy = clientY - (r.top + r.height / 2);
          x(dx * 0.3);
          y(dy * 0.4);
          ax?.(dx * 0.15);
          ay?.(dy * 0.15);
        };
        const leave = () => {
          x(0);
          y(0);
          ax?.(0);
          ay?.(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => detach.forEach((off) => off());
    },
    root,
  );

  // Filters, FAQs and form steps change page height without a window resize.
  let refreshTimer: ReturnType<typeof setTimeout> | undefined;
  let lastHeight = document.body.offsetHeight;
  const heightWatcher = new ResizeObserver(() => {
    const height = document.body.offsetHeight;
    if (height === lastHeight) return;
    lastHeight = height;
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });
  heightWatcher.observe(document.body);

  return () => {
    heightWatcher.disconnect();
    clearTimeout(refreshTimer);
    mm.revert();
    ctx.revert();
  };
}
