import { useEffect, useState } from "react";
import "./Preloader.css";

/**
 * Loader budget — the phases below sum to exactly 3000ms, from mount to the
 * `curtainOpened` event that releases the page and lets the hero animate.
 *
 * Keep the sum at 3000 when adjusting: trade time between phases rather than
 * adding to one. The previous version had these as magic numbers scattered
 * through nested setTimeouts and totalled ~3560ms.
 */
const TIMING = {
  /** Dead hold before the counter starts. Mandala is spinning. */
  hold: 450,
  /** Counter sweep. Spread across TICKS calls, not used as a single delay. */
  count: 1250,
  /** Pause once the counter completes, before the curtain moves. */
  settle: 300,
  /** Preloader hides, curtain begins opening. */
  curtainIn: 300,
  /** Curtain finishes; page is released. */
  curtainOut: 700,
} as const;

/** The counter loop runs for count values 0…100 inclusive — 101 calls, not 100. */
const TICKS = 101;

const Preloader = () => {
  const [, setCounter] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [hidePreloader, setHidePreloader] = useState(false);
  const [hideCurtain, setHideCurtain] = useState(false);
  const [, setHideCounter] = useState(false);


  useEffect(() => {
    // Divide by TICKS, not 100 — the loop makes 101 calls, so dividing by 100
    // would overshoot the intended sweep by a full tick.
    const interval = TIMING.count / TICKS;
    let count = 0;
    let timeoutId: number;

    const updateCounter = () => {
      if (count <= 100) {
        setCounter(count);
        count++;
        timeoutId = window.setTimeout(updateCounter, interval);
      } else {
        window.setTimeout(revealHero, TIMING.settle);
      }
    };

    const revealHero = () => {
      setIsLoaded(true);
      setHideCounter(true);

      setTimeout(() => {
        setHidePreloader(true);
        setCurtainOpen(true);
        // Dispatch event when curtain starts opening
        window.dispatchEvent(new CustomEvent("curtainStarted"));

        setTimeout(() => {
          setHideCurtain(true);
          // Allow body scrolling
          document.body.classList.add("content-loaded");
          // Dispatch event to trigger hero animations after curtain opens
          window.dispatchEvent(new CustomEvent("curtainOpened"));
        }, TIMING.curtainOut);
      }, TIMING.curtainIn);
    };

    const startTimer = window.setTimeout(() => {
      updateCounter();
    }, TIMING.hold);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSkip = () => {
    setCounter(100);
    setIsLoaded(true);
    setHideCounter(true);

    setTimeout(() => {
      setHidePreloader(true);
      setCurtainOpen(true);
      // Dispatch event when curtain starts opening
      window.dispatchEvent(new CustomEvent("curtainStarted"));

      setTimeout(() => {
        setHideCurtain(true);
        // Allow body scrolling
        document.body.classList.add("content-loaded");
        // Dispatch event to trigger hero animations after curtain opens
        window.dispatchEvent(new CustomEvent("curtainOpened"));
        // Skipping jumps straight to the curtain, so only the curtain's own
        // duration remains — the hold, counter and settle are all discarded.
      }, TIMING.curtainOut);
    }, 100);
  };

  return (
    <>
      {/* Preloader */}
      <div
        className={`preloader ${isLoaded ? "loaded" : ""}`}
        style={{ display: hidePreloader ? "none" : "flex" }}
        onClick={handleSkip}
      >
        <div className="mandala-container">
          {/* LAYER 1: Outer Energy Ring */}
          <svg className="mandala-svg layer-outer" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.3"
              opacity="0.25"
            />

            <g fill="none" stroke="#d4af37" strokeWidth="0.4" opacity="0.3">
              {[...Array(16)].map((_, i) => (
                <g key={i} transform={`rotate(${i * 22.5} 100 100)`}>
                  <path d="M100,6 Q100,20 100,34" strokeLinecap="round" />
                  <circle cx="100" cy="6" r="1" fill="#d4af37" opacity="0.4" />
                </g>
              ))}
            </g>

            <circle
              cx="100"
              cy="100"
              r="68"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.3"
              opacity="0.3"
              strokeDasharray="2 6"
            />
          </svg>

          {/* LAYER 2: Sacred Lotus */}
          <svg className="mandala-svg layer-lotus" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.4"
              opacity="0.4"
            />

            <g
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.6"
              opacity="0.45"
              strokeLinecap="round"
            >
              {[...Array(8)].map((_, i) => (
                <g key={i} transform={`rotate(${i * 45} 100 100)`}>
                  <path d="M100,42 Q108,50 110,62 Q106,70 100,75 Q94,70 90,62 Q92,50 100,42 Z" />
                  <path
                    d="M100,45 Q104,52 100,65"
                    strokeWidth="0.3"
                    opacity="0.5"
                  />
                </g>
              ))}
            </g>
          </svg>

          {/* LAYER 3: Inner Energy Waves */}
          <svg className="mandala-svg layer-inner" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.4"
              opacity="0.5"
            />

            <g
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.5"
              opacity="0.5"
              strokeLinecap="round"
            >
              {[...Array(12)].map((_, i) => (
                <g key={i} transform={`rotate(${i * 30} 100 100)`}>
                  <path d="M100,62 Q105,75 100,88" />
                  <path d="M100,62 Q95,75 100,88" />
                </g>
              ))}
            </g>
          </svg>

          {/* LAYER 4: Sacred Center */}
          <svg className="mandala-svg layer-center" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="22"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.4"
              opacity="0.6"
            />
            <circle
              cx="100"
              cy="100"
              r="16"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.5"
              opacity="0.7"
            />

            <g
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.7"
              opacity="0.7"
              strokeLinecap="round"
            >
              {[...Array(4)].map((_, i) => (
                <path
                  key={i}
                  d="M100,86 Q106,90 100,94 Q94,90 100,86"
                  transform={`rotate(${i * 90} 100 100)`}
                />
              ))}
            </g>

            <g>
              <circle cx="100" cy="100" r="9" fill="#d4af37" opacity="0.15" />
              <circle cx="100" cy="100" r="6" fill="#d4af37" opacity="0.25" />
              <circle
                cx="100"
                cy="100"
                r="5"
                fill="none"
                stroke="#d4af37"
                strokeWidth="0.6"
                opacity="0.85"
              />
              <circle cx="100" cy="100" r="3" fill="#d4af37" opacity="0.9" />
              <circle cx="100" cy="100" r="1.2" fill="#0d0d0d" opacity="1" />
            </g>
          </svg>
        </div>

      </div>

      {/* Curtain */}
      <div
        className={`curtain ${curtainOpen ? "open" : ""}`}
        style={{ display: hideCurtain ? "none" : "flex" }}
      >
        <div className="curtain-left"></div>
        <div className="curtain-right"></div>
      </div>
    </>
  );
};

export default Preloader;
