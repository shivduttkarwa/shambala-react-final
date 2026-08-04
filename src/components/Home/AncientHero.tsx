import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "./AncientHero.css";

const publicUrl = import.meta.env.BASE_URL;

const AncientHero: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollBtnRef = useRef<HTMLDivElement>(null);

  const [animationsStarted, setAnimationsStarted] = useState(false);

  useEffect(() => {
    if (particlesRef.current) {
      const particleCount = window.innerWidth < 768 ? 20 : 40;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${Math.random() * 15 + 25}s`;
        particlesRef.current.appendChild(particle);
      }
    }

    // Lock animated elements hidden until GSAP reveals them. All three hero
    // lines sit below their masks, so no opacity is needed to hide them.
    gsap.set(
      [eyebrowRef.current, titleLine1Ref.current, titleLine2Ref.current],
      { y: "100%" },
    );
    gsap.set(subtitleRef.current, { opacity: 0 });
    gsap.set(ctaRef.current, { opacity: 0, clipPath: "inset(0 100% 0 0)" });
    gsap.set(scrollBtnRef.current, { opacity: 0, y: 30 });

    // Preloader adds "content-loaded" to body right before dispatching curtainOpened.
    // If it's already there, we're navigating from another page — animate after short delay.
    // If not, the preloader is still running — wait for it to finish.
    if (document.body.classList.contains("content-loaded")) {
      const timer = setTimeout(() => setAnimationsStarted(true), 10);
      return () => clearTimeout(timer);
    }

    const handler = () => setAnimationsStarted(true);
    window.addEventListener("curtainOpened", handler);
    return () => window.removeEventListener("curtainOpened", handler);
  }, []);

  // GSAP Timeline Animation
  useEffect(() => {
    if (!animationsStarted) return;

    // Entry choreography — reads top-to-bottom, resolves in ~1.45s.
    // Elements overlap heavily so the hero settles as one gesture rather
    // than a queue of separate reveals.
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. All three hero lines rise out of their masks as a visible cascade.
    //
    // The previous 0.14s stagger read as simultaneous. What the eye tracks is
    // the wall-clock gap between lines landing, and 0.14s put only 0.28s
    // between the first and last — while expo.out had already carried line one
    // ~83% of its travel by then, so there was almost nothing left moving to
    // separate them. Widening to 0.22s puts 0.44s end to end, and power3.out
    // keeps more of the motion in the back half where it stays visible.
    tl.fromTo(
      [eyebrowRef.current, titleLine1Ref.current, titleLine2Ref.current],
      { y: "100%" },
      { y: "0%", duration: 0.85, ease: "power3.out", stagger: 0.22 },
      0,
    );

    // 2. Subtitle fades in as the last line is still settling
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      0.7,
    );

    // 3. CTA wipes in
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, clipPath: "inset(0 100% 0 0)" },
      {
        opacity: 1,
        clipPath: "inset(0 0 0 0)",
        duration: 0.55,
        ease: "expo.out",
      },
      0.85,
    );

    // 4. Scroll indicator lands last, overlapping the CTA so there is no
    // pause between the content finishing and the cue appearing.
    tl.fromTo(
      scrollBtnRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
      1.05,
    );

    return () => {
      tl.kill();
    };
  }, [animationsStarted]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    btn.style.setProperty("--x", `${x}%`);
    btn.style.setProperty("--y", `${y}%`);
  };

  return (
    <section
      ref={sectionRef}
      className={`sanctuary ${animationsStarted ? "hero-unveiled" : ""}`}
    >
      {/* Background Image */}
      <div className="sanctuary__bg">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={`${publicUrl}images/home/hero-mobile.webp`}
          />
          <img
            src={`${publicUrl}images/home/hero-desktop.webp`}
            alt="Contemporary Queensland home among native landscaping at dusk"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>

      {/* Atmospheric Effects */}
      <div className="sanctuary__veil" />
      <div className="sanctuary__mist" />

      {/* Sacred Geometry */}
      <div className="mandala">
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="70" />
          <circle cx="100" cy="100" r="50" />
          <circle cx="100" cy="100" r="30" />
          <polygon points="100,10 190,100 100,190 10,100" />
          <polygon points="100,30 170,100 100,170 30,100" />
          <line x1="100" y1="10" x2="100" y2="190" />
          <line x1="10" y1="100" x2="190" y2="100" />
          <line x1="30" y1="30" x2="170" y2="170" />
          <line x1="170" y1="30" x2="30" y2="170" />
        </svg>
      </div>

      {/* Golden Dust - Slower */}
      <div className="particles" ref={particlesRef} />

      {/* Main Content */}
      <div className="sanctuary__content">
        <div className="gateway">
          <div className="eyebrow">
            <span ref={eyebrowRef} className="eyebrow-text">
              Architectural Excellence
            </span>
          </div>
          <h1 className="ancient-hero-title">
            <div className="line-mask">
              <span ref={titleLine1Ref} className="line">
                Architectural Vision
              </span>
            </div>
            <div className="line-mask">
              <span ref={titleLine2Ref} className="line">
                Realized
              </span>
            </div>
          </h1>
          <p ref={subtitleRef} className="ancient-hero-subtitle">
            Where modern design meets exceptional craftsmanship. We create
            architectural masterpieces that stand the test of time.
          </p>

          <Link
            ref={ctaRef}
            to="/contact-us"
            className="ancient-hero-cta"
            onMouseMove={handleMouseMove}
          >
            <span className="wheel" />
            <span>Start Your Project</span>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div ref={scrollBtnRef} className="ancient-hero-scroll-btn">
        <div className="lotus" />
        <div className="lotus-line" />
      </div>
    </section>
  );
};

export default AncientHero;
