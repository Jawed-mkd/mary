import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "../content";
import "./PeaceSection.css";

type BreathPhase = "idle" | "breathe-in" | "hold" | "breathe-out";

const BREATHE_IN_MS = 4000;
const HOLD_MS = 2000;
const BREATHE_OUT_MS = 5000;

export default function PeaceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const runCycle = useCallback(() => {
    if (!cycleRef.current) return;

    setPhase("breathe-in");
    timerRef.current = setTimeout(() => {
      if (!cycleRef.current) return;
      setPhase("hold");

      timerRef.current = setTimeout(() => {
        if (!cycleRef.current) return;
        setPhase("breathe-out");

        timerRef.current = setTimeout(() => {
          if (cycleRef.current) {
            runCycle();
          }
        }, BREATHE_OUT_MS);
      }, HOLD_MS);
    }, BREATHE_IN_MS);
  }, []);

  const startBreathing = () => {
    setIsBreathing(true);
    cycleRef.current = true;
    runCycle();
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    cycleRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
  };

  useEffect(() => {
    return () => {
      cycleRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const phaseLabel =
    phase === "breathe-in"
      ? siteConfig.peace.breatheIn
      : phase === "hold"
        ? siteConfig.peace.hold
        : phase === "breathe-out"
          ? siteConfig.peace.breatheOut
          : "";

  return (
    <section
      ref={sectionRef}
      className={`peace-section ${isVisible ? "peace-section--visible" : ""}`}
      aria-label="A moment of peace"
    >
      <div className="peace-container">
        <h2 className="peace-heading">{siteConfig.peace.heading}</h2>

        {/* Breathing orb */}
        <div className="peace-orb-wrapper">
          <div
            className={`peace-orb peace-orb--${phase}`}
            aria-hidden="true"
          >
            <div className="peace-orb__glow" />
            <div className="peace-orb__inner" />
            <div className="peace-orb__ring" />
          </div>

          {isBreathing && (
            <p className="peace-phase-label" aria-live="polite">
              {phaseLabel}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="peace-controls">
          {!isBreathing ? (
            <button
              className="peace-button"
              onClick={startBreathing}
              aria-label="Start breathing exercise"
            >
              Begin a gentle breath ✦
            </button>
          ) : (
            <button
              className="peace-button peace-button--stop"
              onClick={stopBreathing}
              aria-label="Stop breathing exercise"
            >
              I'm okay now ♡
            </button>
          )}
        </div>

        <p className="peace-message">{siteConfig.peace.message}</p>
      </div>
    </section>
  );
}
