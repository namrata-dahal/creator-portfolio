"use client";
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {socialLinks} from '@/lib/portfolio';
export function SiteShell({children}:{children:React.ReactNode}){
 const path=usePathname();const [menu,setMenu]=useState(false);const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{setMenu(false);let disposed=false;let cleanup:(()=>void)|undefined;
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
  if(disposed)return;gsap.registerPlugin(ScrollTrigger);
  const ctx=gsap.context(()=>{
   gsap.fromTo('.page-intro > *',{y:22,opacity:0},{y:0,opacity:1,stagger:.09,duration:.75,ease:'power2.out'});
   gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>gsap.fromTo(el,{y:24,opacity:0},{y:0,opacity:1,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
   gsap.fromTo('.reading-progress',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:document.documentElement,start:0,end:'max',scrub:.2}});
   if(window.matchMedia('(min-width: 900px)').matches)gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el=>gsap.to(el,{y:-22,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}}));
   gsap.utils.toArray<HTMLElement>('[data-process]').forEach(el=>gsap.fromTo(el,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top 80%',end:'bottom 50%',scrub:.6}}));
  },root);cleanup=()=>ctx.revert();ScrollTrigger.refresh();
 }).catch(()=>{});return()=>{disposed=true;cleanup?.();};
 },[path]);
 const links=[['Work','/work'],['My story','/about'],['For brands','/partnerships']];
 return <div ref={root}><div className="reading-progress" aria-hidden="true"/><a className="skip" href="#main">Skip to content</a><header className="header wrap"><a className="wordmark" href="/">namrata<span> dahal</span><i>.</i></a><button className="menu-toggle" aria-controls="nav" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?'Close':'Menu'}</button><nav id="nav" className={menu?'nav open':'nav'} aria-label="Main navigation">{links.map(([label,href])=><a key={href} href={href} aria-current={path===href?'page':undefined}>{label}</a>)}<a className="nav-cta" href="/collaborate" aria-current={path==='/collaborate'?'page':undefined}>Let’s collaborate <span aria-hidden="true">↗</span></a></nav></header>{children}<footer className="wrap footer multi-footer"><div><a className="wordmark" href="/">namrata<span> dahal</span><i>.</i></a><p>Learning. Creating. Becoming.</p></div><div className="footer-links">{socialLinks.map(([name,url])=><a key={name} href={url} target="_blank" rel="noopener noreferrer">{name} ↗</a>)}</div><div className="footer-small"><a href="/media-kit">Media kit</a><a href="/privacy">Privacy</a><a href="/inbox">Creator inbox</a><span>© 2026 Namrata Dahal</span></div></footer></div>
}
export function BrandCTA(){return <section className="closing-cta"><div className="wrap" data-reveal><p className="eyebrow">A GOOD FIT STARTS WITH A CONVERSATION</p><h2>Let’s make your next<br/><em>story matter.</em></h2><div><a className="button light" href="/collaborate">Start a collaboration <span aria-hidden="true">↗</span></a><a className="underlink" href="/partnerships">Read the partnership guide</a></div></div></section>}
export function Proof(){return <section className="proof-band"><div className="wrap proof-grid"><div><strong>313.4K</strong><p>TikTok video views</p><small>Last 60 days supplied</small></div><div><strong>80.8K</strong><p>YouTube views</p><small>11 Jul–8 Oct 2026 · 90 days</small></div><div><strong>5</strong><p>Paid brand collaborations</p><small>Creator-reported to date</small></div><div><strong>3M</strong><p>Breakout TikTok views</p><small>One selected video · lifetime</small></div></div><p className="data-note wrap">Creator-provided snapshots, 10 October 2026. Different reporting periods. Views are not unique reach or a guarantee of campaign results.</p></section>}
