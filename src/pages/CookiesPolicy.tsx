import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import "./LegalPages.css";

const CookiesPolicy: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const publicUrl = import.meta.env.BASE_URL;
  const heroDesktop = `${publicUrl}images/legal/privacy-hero-v2-desktop.webp`;
  const heroMobile = `${publicUrl}images/legal/privacy-hero-v2-mobile.webp`;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, { yPercent: 120, autoAlpha: 0 });
      gsap.set(subtitleRef.current, { y: 20, autoAlpha: 0 });

      const heroTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.4,
      });

      heroTl
        .to(titleRef.current, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1,
        })
        .to(
          subtitleRef.current,
          { y: 0, autoAlpha: 1, duration: 0.7 },
          "-=0.35",
        );

      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay: 0.8,
          ease: "power3.out",
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-header legal-header--cookies">
        <picture className="legal-header__media">
          <source media="(max-width: 767px)" srcSet={heroMobile} />
          <img
            src={heroDesktop}
            alt=""
            width="1600"
            height="640"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="legal-header__content">
          <div className="legal-header__title-wrap">
            <h1>
              <span ref={titleRef} className="legal-header__reveal-line">
                Cookies Policy
              </span>
            </h1>
          </div>
          <div className="legal-header__divider" />
          <p ref={subtitleRef}>Last updated: 4 August 2026</p>
        </div>
      </div>

      <div className="legal-content" ref={contentRef}>
        <div className="legal-container">
          <section className="legal-section">
            <h2>About This Policy</h2>
            <p>
              This Cookies Policy explains how the Shambala Homes website uses
              cookies and similar technologies. It should be read together with
              our <Link to="/privacy-policy">Privacy Policy</Link>.
            </p>
          </section>

          <section className="legal-section">
            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files that a website or third-party service
              can store on your device. Similar technologies include local
              storage, pixels, and device identifiers. They can support website
              functionality, remember preferences, measure usage, or enable
              third-party features.
            </p>
            <p>
              Cookie data may be personal information when it identifies you or
              can reasonably be linked to you.
            </p>
          </section>

          <section className="legal-section">
            <h2>Cookies Used on This Website</h2>

            <h3>First-Party Cookies</h3>
            <p>
              The current Shambala Homes website does not intentionally set
              first-party analytics, advertising, or personalisation cookies.
              It does not currently include Google Analytics or advertising
              pixels.
            </p>

            <h3>Google Maps</h3>
            <p>
              Our Contact page includes an embedded Google Map. When you load
              that page, Google may receive technical information such as your IP
              address, browser or device information, and the page you visited.
              Google may also set or read cookies depending on your browser and
              Google account settings.
            </p>
            <p>
              You can learn more in Google&apos;s{" "}
              <a
                href="https://policies.google.com/technologies/cookies/embedded"
                target="_blank"
                rel="noreferrer"
              >
                information about cookies used on sites with embedded Google
                content
              </a>{" "}
              and its{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </a>
              .
            </p>

            <h3>Essential Hosting and Security Technologies</h3>
            <p>
              Our hosting or security providers may use strictly necessary
              technologies to deliver the website, balance traffic, prevent
              misuse, or maintain security. These technologies depend on the
              provider and hosting configuration in use when you visit.
            </p>
          </section>

          <section className="legal-section">
            <h2>Cookie Categories</h2>
            <ul>
              <li>
                <strong>Strictly necessary:</strong> support delivery, security,
                and core website operation.
              </li>
              <li>
                <strong>Functional and third-party:</strong> enable features such
                as the embedded Google Map.
              </li>
              <li>
                <strong>Analytics:</strong> not intentionally used by the current
                website.
              </li>
              <li>
                <strong>Advertising:</strong> not intentionally used by the
                current website.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Your Choices</h2>
            <p>
              You can block or delete cookies through your browser settings. You
              can also configure your browser to restrict third-party cookies.
              Blocking third-party content may prevent the embedded map or other
              external features from working correctly.
            </p>
            <p>
              If you use a Google account, you can review your controls in{" "}
              <a
                href="https://myaccount.google.com/data-and-privacy"
                target="_blank"
                rel="noreferrer"
              >
                Google Data &amp; Privacy
              </a>
              .
            </p>
          </section>

          <section className="legal-section">
            <h2>Changes to This Policy</h2>
            <p>
              We may update this policy if the website, our service providers, or
              applicable requirements change. The date at the top of this page
              shows when the policy was last updated.
            </p>
          </section>

          <section className="legal-section">
            <h2>Contact Us</h2>
            <p>
              If you have a question about our use of cookies or personal
              information, please contact us:
            </p>
            <div className="contact-info">
              <p>
                Email:{" "}
                <a href="mailto:admin@shambalahomes.com.au">
                  admin@shambalahomes.com.au
                </a>
              </p>
              <p>
                Phone: <a href="tel:0428809166">0428 809 166</a>
              </p>
              <p>Address: Narangba QLD 4504, Australia</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;
