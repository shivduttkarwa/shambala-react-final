import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FallingTextVideoComponent.css";

gsap.registerPlugin(ScrollTrigger);

interface FallingTextVideoComponentProps {
  leftText?: string;
  rightText?: string;
  videoSrc?: string;
}

const FallingTextVideoComponent: React.FC<FallingTextVideoComponentProps> = ({
  leftText = "Design",
  rightText = "Philosophy",
  videoSrc = `${import.meta.env.BASE_URL}vid/shambala-demo-vid.mp4`,
}) => {
  const wrapperRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !wrapperRef.current ||
      !videoContainerRef.current ||
      !textLeftRef.current ||
      !textRightRef.current
    ) {
      return;
    }

    // Force video play on mobile
    const handleVideoLoad = async () => {
      if (videoRef.current) {
        try {
          // Remove controls to hide play button
          videoRef.current.controls = false;
          videoRef.current.setAttribute('webkit-playsinline', 'true');
          videoRef.current.setAttribute('playsinline', 'true');
          
          // Try to play the video
          await videoRef.current.play();
        } catch (error) {
          console.log('Video autoplay prevented:', error);
          
          // If autoplay fails, add a one-time click handler to start video
          const handleFirstInteraction = async () => {
            try {
              if (videoRef.current) {
                await videoRef.current.play();
                document.removeEventListener('touchstart', handleFirstInteraction);
                document.removeEventListener('click', handleFirstInteraction);
              }
            } catch (e) {
              console.log('Failed to play video on interaction:', e);
            }
          };
          
          document.addEventListener('touchstart', handleFirstInteraction, { once: true });
          document.addEventListener('click', handleFirstInteraction, { once: true });
        }
      }
    };

    // Defer the video until it is nearly on screen.
    //
    // This section sits below the fold, so there is no reason to spend the
    // initial page load on a multi-megabyte clip. The element ships with
    // preload="metadata" and no autoPlay attribute — autoPlay would make the
    // browser fetch eagerly regardless of preload — and we only switch to
    // preload="auto" and start playback once it approaches the viewport.
    //
    // Gate on `canplay` (readyState 2) rather than `canplaythrough` (3):
    // "through" waits for enough buffer to finish the whole clip uninterrupted,
    // which is a long wait for no benefit on a silent looping background.
    const video = videoRef.current;
    let started = false;

    const startIfReady = () => {
      if (!video) return;
      if (video.readyState >= 2) {
        handleVideoLoad();
      } else {
        video.addEventListener('canplay', handleVideoLoad, { once: true });
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!video) return;
          if (entry.isIntersecting) {
            if (!started) {
              started = true;
              video.preload = 'auto';
              video.load();
              startIfReady();
            } else {
              void video.play().catch(() => {});
            }
          } else if (started) {
            // Offscreen playback burns CPU and battery for nothing.
            video.pause();
          }
        });
      },
      // Start fetching a little before it scrolls in, so it is running by the
      // time the section is actually visible.
      { rootMargin: '300px 0px' },
    );

    if (video) io.observe(video);

    const ctx = gsap.context(() => {
      // Initial state for top text
      gsap.set(textLeftRef.current, { xPercent: -150, opacity: 0 });
      gsap.set(textRightRef.current, { xPercent: 150, opacity: 0 });

      // Slide in top text
      gsap.to([textLeftRef.current, textRightRef.current], {
        xPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 70%",
          toggleActions: "play reverse play reverse",
        },
      });

      // Main scroll animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: ".ftv-video-content",
          pinSpacing: true,
        },
      });

      // Video expansion to full screen - takes 60% of timeline (0 to 0.6)
      tl.to(
        videoContainerRef.current,
        {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          ease: "power2.inOut",
          duration: 0.6,
        },
        0
      )

      // Top text fades out in sync with video expansion
      .to(
        textLeftRef.current,
        {
          x: -500,
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.6,
        },
        0
      )
      .to(
        textRightRef.current,
        {
          x: 500,
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.6,
        },
        0
      )
      .to({}, { duration: 0.3 });

    }, wrapperRef);

    return () => {
      io.disconnect();
      video?.removeEventListener('canplay', handleVideoLoad);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={wrapperRef} className="ftv-video-wrapper">
      <div className="ftv-video-content">
        {/* Top big headings */}
        <div className="ftv-text-container">
          <div ref={textLeftRef} className="ftv-text-left">
            {leftText}
          </div>
          <div ref={textRightRef} className="ftv-text-right">
            {rightText}
          </div>
        </div>

        {/* Center video */}
        <div ref={videoContainerRef} className="ftv-video-container">
          {/* No autoPlay and preload="metadata" on purpose — both are what keep
              this off the initial page load. An IntersectionObserver above
              upgrades preload and starts playback as it scrolls into view. */}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            controls={false}
            preload="metadata"
            webkit-playsinline="true"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Scroll down indicator */}
        <div className="ftv-bottom-text">
          <div className="ftv-scroll-down-indicator">
            <div className="ftv-scroll-arrow">
              <span>↓</span>
            </div>
            <div className="ftv-scroll-text">Scroll</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FallingTextVideoComponent;
