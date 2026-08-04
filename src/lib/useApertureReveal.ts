import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Aperture reveal — the site's standard image entrance.
 *
 * A circular clip opens from the centre of the frame while the photograph
 * inside counter-zooms back down to 1×. The opposing motion is what creates
 * the depth: the frame grows outward as the subject settles back.
 *
 * Pass a ref to the *frame* (the clipping wrapper). The hook finds the first
 * <img> inside it and drives the counter-zoom on that, so it works whether the
 * image is bare or wrapped in a <picture>.
 *
 * Requirements on the frame element:
 *   - overflow: hidden   (contains the oversized image before it settles)
 *   - the img should be width/height 100% with object-fit: cover
 */

/**
 * 75% is not arbitrary. For circle() a percentage resolves against
 * sqrt(w² + h²) / sqrt(2), so any radius above sqrt(2)/2 ≈ 70.7% reaches the
 * corners of *any* rectangle. 75% clears them with margin, which matters
 * because these frames are portrait on desktop and landscape on mobile.
 */
const CLIP_FROM = "circle(0% at 50% 50%)";
const CLIP_TO = "circle(75% at 50% 50%)";

const ZOOM_FROM = 1.45;
const CLIP_DURATION = 1.4;
/** Slightly longer than the clip, so the zoom is still easing as the frame
 *  finishes opening rather than both landing on the same frame. */
const ZOOM_DURATION = 1.6;
const START = "top 80%";

export function useApertureReveal(
  frameRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const img = frame.querySelector("img");

    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion lands on the finished state immediately — not a shorter
    // animation, no animation.
    if (reduced) {
      gsap.set(frame, { clipPath: CLIP_TO });
      if (img) gsap.set(img, { scale: 1 });
      return;
    }

    // Scoped to the frame so revert() cleans up both the tweens and the
    // ScrollTrigger, and restores inline styles — which matters under
    // StrictMode's double-invoked effects.
    const ctx = gsap.context(() => {
      gsap.set(frame, { clipPath: CLIP_FROM });

      if (img) {
        // Suppress any stylesheet `transition: transform` for the duration.
        // Several of these images carry an 0.8s hover-zoom transition, and it
        // would smooth every per-frame value GSAP writes — the reveal ends up
        // lagging ~0.8s behind and looking mushy. Cleared on complete so the
        // hover transition works normally again.
        gsap.set(img, { scale: ZOOM_FROM, transition: "none" });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: frame,
          start: START,
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.to(
        frame,
        { clipPath: CLIP_TO, duration: CLIP_DURATION, ease: "power3.inOut" },
        0,
      );

      if (img) {
        tl.to(
          img,
          {
            scale: 1,
            duration: ZOOM_DURATION,
            ease: "power2.out",
            // Hand the element back to the stylesheet so hover behaves again.
            onComplete: () => {
              gsap.set(img, { clearProps: "transition" });
            },
          },
          0,
        );
      }
    }, frame);

    return () => ctx.revert();
  }, [frameRef]);
}

export default useApertureReveal;
