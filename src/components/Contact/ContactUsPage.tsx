import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AestheticButton from "../UI/AestheticButton";
import "./ContactUsPage.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-()+]+$/;

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

type FormState = typeof EMPTY_FORM;
type FormErrors = Partial<Record<keyof FormState, string>>;

const ContactUsPage: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".contact-animate");

      cards.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 60, scale: 0.95 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.set(".cup-hero-reveal-line", { yPercent: 120, autoAlpha: 0 });
      // Buttons get a plain fade — no travel, no scale.
      gsap.set(".cup-hero-actions > *", { autoAlpha: 0 });

      const heroTl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.8,
      });

      heroTl.to(".cup-hero-title .cup-hero-reveal-line", {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1,
        skewY: 0,
      });
      heroTl.to(
        ".cup-hero-subtitle .cup-hero-reveal-line",
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.9,
        },
        "-=0.32",
      );
      heroTl.to(
        ".cup-hero-actions > *",
        {
          autoAlpha: 1,
          duration: 0.6,
          ease: "power1.out",
        },
        "-=0.35",
      );
    });

    // Handle scroll to hash after animations
    const scrollToHash = () => {
      if (window.location.hash === "#contact-form") {
        setTimeout(() => {
          const formSection = document.getElementById("contact-form");
          if (formSection) {
            formSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 1200);
      }
    };

    scrollToHash();

    return () => {
      ctx.revert();
    };
  }, []);

  // Field-level messages beat a blocking alert(): the user sees every problem
  // at once, next to the input that caused it, and can fix them in one pass.
  const validate = (data: FormState): FormErrors => {
    const next: FormErrors = {};

    if (!data.name.trim()) next.name = "Please enter your name.";

    if (!data.email.trim()) next.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(data.email.trim()))
      next.email = "That doesn't look like a valid email address.";

    if (!data.phone.trim()) next.phone = "Please enter a contact number.";
    else if (
      !PHONE_RE.test(data.phone.trim()) ||
      data.phone.replace(/\D/g, "").length < 6
    )
      next.phone = "That doesn't look like a valid phone number.";

    if (!data.service) next.service = "Please choose a service.";

    if (!data.message.trim())
      next.message = "Tell us a little about your project.";

    return next;
  };

  const setField = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear this field's error as soon as the user starts correcting it.
    setErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev,
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const next = validate(formData);
    setErrors(next);

    if (Object.keys(next).length > 0) {
      // Move focus to the first field that failed so keyboard and screen
      // reader users are not left guessing where the problem is.
      const firstInvalid = Object.keys(next)[0];
      document.getElementById(`cup-${firstInvalid}`)?.focus();
      return;
    }

    setShowSuccess(true);
    setFormData(EMPTY_FORM);
    setErrors({});

    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const options = [
    "New House Construction",
    "Home Renovation",
    "Kitchen & Bathroom Remodel",
    "Home Extension",
  ];

  const scrollToForm = () => {
    const formSection = document.getElementById("contact-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:admin@shambalahomes.com.au";
  };

  const publicUrl = import.meta.env.BASE_URL || "/";

  const heroBg = `${publicUrl}images/leo.jpeg`;
  const parallaxBg = `${publicUrl}images/parallax-bg.jpg`;

  return (
    <div className="cup-page">
      {/* HERO */}
      <section
        className="cup-hero cup-section cup-section--hero"
        style={
          {
            "--cup-hero-bg": `url(${heroBg})`,
          } as React.CSSProperties
        }
      >
        <div className="cup-hero-overlay" />
        <div className="cup-hero-content">
          <h1 className="cup-hero-title">
            <span className="cup-hero-reveal-line">Let's Connect</span>
          </h1>
          <p className="cup-hero-subtitle">
            <span className="cup-hero-reveal-line">
              New home, refined upgrade, or a commercial property that needs a
              quieter kind of drama— tell us where you are, and we'll help you
              plan what comes next.
            </span>
          </p>

          <div className="cup-hero-actions">
            <AestheticButton onClick={scrollToForm} className="cup-hero-cta">
              Start Your Project
            </AestheticButton>
            <AestheticButton
              onClick={handleEmailClick}
              className="cup-hero-cta"
            >
              Email Our Team
            </AestheticButton>
          </div>
        </div>
      </section>

      {/* MAIN CONTACT SECTION */}
      <section
        className="cup-main cup-section cup-section--main"
        id="contact-form"
      >
        <div className="cup-inner">
          <div className="cup-info-wrapper">
            {/* LEFT – FORM */}
            <form
              className="cup-form contact-animate"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="cup-form-head">
                <h2 className="cup-form-title">Send us a message</h2>
                <p className="cup-form-note">
                  Fill in a few details and we'll come back to you within
                  24–48 hours.
                </p>
              </div>

              <div className="cup-field-grid">
                <div className="cup-field">
                  <label htmlFor="cup-name">Name</label>
                  <input
                    id="cup-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={formData.name}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "cup-name-err" : undefined}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                  {errors.name && (
                    <p className="cup-field-error" id="cup-name-err">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="cup-field">
                  <label htmlFor="cup-phone">Mobile</label>
                  <input
                    id="cup-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="0400 000 000"
                    value={formData.phone}
                    aria-invalid={!!errors.phone}
                    aria-describedby={
                      errors.phone ? "cup-phone-err" : undefined
                    }
                    onChange={(e) => setField("phone", e.target.value)}
                  />
                  {errors.phone && (
                    <p className="cup-field-error" id="cup-phone-err">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="cup-field">
                  <label htmlFor="cup-email">Email</label>
                  <input
                    id="cup-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "cup-email-err" : undefined
                    }
                    onChange={(e) => setField("email", e.target.value)}
                  />
                  {errors.email && (
                    <p className="cup-field-error" id="cup-email-err">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="cup-field">
                  <label htmlFor="cup-service">Service</label>
                  <div className="cup-select-shell">
                    <select
                      id="cup-service"
                      name="service"
                      value={formData.service}
                      aria-invalid={!!errors.service}
                      aria-describedby={
                        errors.service ? "cup-service-err" : undefined
                      }
                      onChange={(e) => setField("service", e.target.value)}
                    >
                      <option value="">Select a service</option>
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 10l5 5 5-5H7z" />
                    </svg>
                  </div>
                  {errors.service && (
                    <p className="cup-field-error" id="cup-service-err">
                      {errors.service}
                    </p>
                  )}
                </div>

                <div className="cup-field cup-field--full">
                  <label htmlFor="cup-message">Project details</label>
                  <textarea
                    id="cup-message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about your site, timeline and budget."
                    value={formData.message}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "cup-message-err" : undefined
                    }
                    onChange={(e) => setField("message", e.target.value)}
                  />
                  {errors.message && (
                    <p className="cup-field-error" id="cup-message-err">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="cup-form-footer">
                <p className="cup-form-privacy">
                  We'll only use these details to reply to your enquiry.
                </p>
                <button type="submit" className="cup-submit">
                  Send enquiry
                </button>
              </div>
            </form>

            {/* RIGHT – CONTACT INFO (shambala) */}
            <aside className="cup-info-column contact-animate">
              <div className="cup-info-head">
                <p className="cup-info-eyebrow">Get in touch</p>
                <h2 className="cup-info-title">Shambala Homes</h2>
              </div>

              {/* Definition list: each row is a label/value pair, which is what
                  this content actually is — and it keeps the label visually
                  quiet instead of bolding half the block. */}
              <dl className="cup-info-list">
                <div className="cup-info-row">
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:admin@shambalahomes.com.au">
                      admin@shambalahomes.com.au
                    </a>
                  </dd>
                </div>
                <div className="cup-info-row">
                  <dt>Phone</dt>
                  <dd>
                    <a href="tel:0428809166">0428 809 166</a>
                  </dd>
                </div>
                <div className="cup-info-row">
                  <dt>Response</dt>
                  <dd>Within 24–48 hours</dd>
                </div>
                <div className="cup-info-row">
                  <dt>Studio</dt>
                  <dd>Narangba 4504 — by appointment</dd>
                </div>
                <div className="cup-info-row">
                  <dt>Hours</dt>
                  <dd>Monday–Friday, 9am–6pm</dd>
                </div>
              </dl>

              <AestheticButton
                href="mailto:admin@shambalahomes.com.au"
                className="cup-info-cta"
                text="Schedule a Call"
              />
            </aside>
          </div>
        </div>
      </section>

      {/* PARALLAX SECTION - SIMPLE AND CLEAN */}
      <section
        className="cup-parallax cup-section cup-section--parallax"
        style={
          {
            "--cup-parallax-bg": `url(${parallaxBg})`,
          } as React.CSSProperties
        }
      >
        <div className="cup-parallax-overlay" />
        <div className="cup-parallax-content contact-animate">
          <div className="cup-parallax-top">
            <h2>Where considered spaces meet calm living.</h2>
          </div>

          <div className="cup-parallax-bottom">
            <p>
              From new builds to thoughtful renovations, we shape architecture
              that balances form, light, and everyday life—so your spaces feel
              timeless, not temporary.
            </p>
            <AestheticButton
              href="mailto:admin@shambalahomes.com.au"
              className="cup-parallax-cta-btn"
              text="Book a Call"
            />
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="cup-map-section cup-section cup-section--map">
        <div className="cup-inner">
          <div className="cup-map-header">
            <h2>Find Us</h2>
            <p>
              Drop by, or schedule a visit in advance. We're happy to walk you
              through everything.
            </p>
          </div>

          <div className="cup-map-wrapper">
            <iframe
              title="Location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.4486912397893!2d-79.6431!3d43.5890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDM1JzIwLjQiTiA3OcKwMzgnMzUuMiJX!5e0!3m2!1sen!2sca!4v1234567890"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* SUCCESS MESSAGE */}
      {showSuccess && (
        <>
          <div
            className="cup-success-overlay"
            onClick={() => setShowSuccess(false)}
          />
          <div className="cup-success-message">
            <h3>Thank You!</h3>
            <p>
              Your message has been sent successfully. We'll get back to you
              soon.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactUsPage;
