import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EssenceSection.css";
import AestheticButton from "../UI/AestheticButton";
import FallingTextVideoComponent from "../UI/FallingTextVideoComponent";
import TiltTextGsap from "../UI/TiltTextGsap";
import { initGsapSwitchAnimations } from "../../lib/gsapSwitchAnimations";

interface EssenceSectionProps {
  logo?: string;
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  image?: {
    src: string;
    desktop?: string;
    tablet?: string;
    mobile?: string;
    alt: string;
  };
  videoUrl?: string;
}

const publicUrl = import.meta.env.BASE_URL;

const EssenceSection: React.FC<EssenceSectionProps> = ({
  logo,
  heading = "WE SHAPE THE ESSENCE OF LIVING",
  description = "We envision spaces that are not just lived in, but felt — where every element has been curated to inspire connection, serenity, and belonging. Our approach transcends traditional architecture, creating environments that nurture the soul and elevate everyday moments into extraordinary experiences of comfort and beauty. From the way light moves through a room to the textures you brush past each morning, we obsess over the details so that each space tells a story, reflects its inhabitants, and quietly refreshes the spirit day after day.",
  ctaText = "Get to Know Us",
  ctaHref = "/about",
  image = {
    src: `${publicUrl}images/home/essence-desktop.webp`,
    mobile: `${publicUrl}images/home/essence-mobile.webp`,
    alt: "Climate-responsive Queensland living space opening to a subtropical garden",
  },
  videoUrl = `${publicUrl}images/home-hero.mp4`,
}) => {
  const shortDescription =
    "We envision spaces that are not just lived in, but felt — where every element has been curated to inspire connection, serenity, and belonging. Our approach transcends traditional architecture, creating environments that nurture the soul and elevate everyday moments into extraordinary experiences of comfort and beauty.";

  const extraLargeDescription =
    "We envision spaces that are not just lived in, but felt — where every element has been curated to inspire connection, serenity, and belonging. Our approach transcends traditional architecture, creating environments that nurture the soul and elevate everyday moments into extraordinary experiences of comfort.";

  const sectionRef = useRef<HTMLDivElement>(null);
  const imageMaskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageMaskRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const mask = imageMaskRef.current;
    const img = mask.querySelector("img");

    // APERTURE reveal (see play.html #01).
    //
    // A circular clip opens from the centre while the photograph counter-zooms
    // back down to 1×. The opposing motion is what creates the depth — the
    // frame grows outward as the subject settles back.
    //
    // 75% is not arbitrary: for circle() a percentage resolves against
    // sqrt(w² + h²) / sqrt(2), so any radius above sqrt(2)/2 ≈ 70.7% reaches
    // the corners of *any* rectangle. 75% clears them with margin to spare,
    // which matters here because this mask is a tall portrait box on desktop
    // and a wide one on mobile.
    //
    // clip-path and transform are both GPU-composited, so nothing reflows and
    // the image is laid out once rather than re-cropped mid-animation.
    gsap.set(mask, { clipPath: "circle(0% at 50% 50%)" });
    if (img) gsap.set(img, { scale: 1.45 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mask,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
      },
    });

    tl.to(
      mask,
      {
        clipPath: "circle(75% at 50% 50%)",
        duration: 1.4,
        ease: "power3.inOut",
      },
      0,
    );

    if (img) {
      // Slightly longer than the clip so the zoom is still easing as the frame
      // finishes opening, rather than both landing on the same frame.
      tl.to(
        img,
        {
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
        },
        0,
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === mask) {
          st.kill();
        }
      });
    };
  }, []);

  useEffect(() => {
    return initGsapSwitchAnimations(sectionRef.current || undefined);
  }, []);

  return (
    <section className="essence-section" ref={sectionRef}>
      {/* Main Content Section */}
      <div className="essence-container">
        <div className="essence-layout">
          {/* Left side: Content with beige background */}
          <div className="essence-content">
            {logo && (
              <div className="essence-logo">
                <img src={logo} alt="Logo" />
              </div>
            )}

            <div className="essence-heading">
              <TiltTextGsap startTrigger="top 70%" endTrigger="bottom -10%">
                {heading}
              </TiltTextGsap>
            </div>

            <div
              className="essence-description"
              data-gsap="fade-up"
              data-gsap-delay="0.1"
            >
              {typeof window !== "undefined" && window.innerWidth >= 1600
                ? extraLargeDescription
                : typeof window !== "undefined" && window.innerWidth < 1600
                  ? shortDescription
                  : description}
            </div>

            <div className="essence-cta-desktop" data-gsap="btn-clip-bottom">
              <AestheticButton className="essence-cta-btn" href={ctaHref}>
                {ctaText}
              </AestheticButton>
            </div>
          </div>

          {/* Right side: beige bg + image sliding in over it */}
          <div className="essence-image">
            <div className="essence-image-mask" ref={imageMaskRef}>
              <picture>
                {image.mobile && (
                  <source media="(max-width: 767px)" srcSet={image.mobile} />
                )}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="essence-img"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
          </div>

          {/* Mobile CTA - only visible on mobile after image */}
          <div data-gsap="btn-clip-bottom" className="essence-cta-mobile">
            <AestheticButton className="essence-cta-btn" href={ctaHref}>
              {ctaText}
            </AestheticButton>
          </div>
        </div>
      </div>

      {/* Video Text Animation Section */}
      {videoUrl && (
        <FallingTextVideoComponent
          leftText="PRECISION"
          rightText="ARTISTRY"
          videoSrc={videoUrl}
        />
      )}
    </section>
  );
};

export default EssenceSection;
