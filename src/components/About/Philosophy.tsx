import React, { useEffect, useRef } from "react";
import "./Philosophy.css";
import TiltTextGsap from "../UI/TiltTextGsap";
import { initGsapSwitchAnimations } from "../../lib/gsapSwitchAnimations";

type Principle = {
  n: string;
  title: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    n: "01",
    title: "Human-scaled planning",
    body: "Rooms proportioned around how you actually move, gather and rest — not around a floor-plan template.",
  },
  {
    n: "02",
    title: "Natural light first",
    body: "Orientation, openings and shade are resolved before anything else. Everything downstream is easier for it.",
  },
  {
    n: "03",
    title: "Materials that age well",
    body: "Warm, durable surfaces chosen because they improve with time rather than merely survive it.",
  },
  {
    n: "04",
    title: "Detailed early, built once",
    body: "Junctions and finishes resolved on paper, so the build protects the design intent instead of negotiating it.",
  },
];

const Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => initGsapSwitchAnimations(sectionRef.current || undefined), []);

  return (
    <section className="phl" ref={sectionRef}>
      <div className="phl__shell">
        {/* Masthead rule — eyebrow on the left, hairline running to the edge */}
        <div className="phl__masthead">
          <span data-gsap="fade-up" className="phl__eyebrow">
            Company Philosophy
          </span>
          <span className="phl__rule" aria-hidden="true" />
          <span data-gsap="fade-up" data-gsap-delay="0.1" className="phl__count">
            {PRINCIPLES.length} principles
          </span>
        </div>

        <div className="phl__grid">
          {/* ---------- Statement ---------- */}
          <div className="phl__statement">
            <TiltTextGsap
              tag="h2"
              className="phl__title"
              startTrigger="top 85%"
            >
              Quietly bold, built for life
            </TiltTextGsap>

            <p
              data-gsap="fade-up"
              data-gsap-delay="0.1"
              className="phl__lead"
            >
              We believe architecture should feel effortless — calm light,
              intuitive flow, and materials that age beautifully. Every decision
              is guided by real life: how you move, gather, and rest.
            </p>

            <blockquote
              data-gsap="fade-up"
              data-gsap-delay="0.2"
              className="phl__quote"
            >
              <p>
                Design is the quiet craft of making daily life feel clear,
                generous, and grounded.
              </p>
              <cite>Shambala Homes — Architecture &amp; Build</cite>
            </blockquote>
          </div>

          {/* ---------- Principles ledger ---------- */}
          <ol className="phl__list">
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.n}
                className="phl__item"
                data-gsap="fade-up"
                data-gsap-delay={`${0.1 + i * 0.08}`}
              >
                <span className="phl__n" aria-hidden="true">
                  {p.n}
                </span>
                <div className="phl__item-body">
                  <h3 className="phl__item-title">{p.title}</h3>
                  <p className="phl__item-copy">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
