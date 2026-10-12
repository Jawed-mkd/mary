import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../content";
import "./LetterSection.css";

export default function LetterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const { paragraphs, closing, finalLine } = siteConfig.letter;

  const handleReveal = () => {
    if (isRevealed) return;

    // Gradually reveal paragraphs
    let count = 0;
    timerRef.current = setInterval(() => {
      count++;
      setRevealProgress(count);
      if (count >= paragraphs.length + 2) {
        // +2 for closing and final line
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRevealed(true);
      }
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // For accessibility: if user prefers reduced motion, show everything
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const showAll = isRevealed || prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      className={`letter-section ${isVisible ? "letter-section--visible" : ""}`}
      aria-label="A letter for you"
    >
      <div className="letter-container">
        <h2 className="letter-heading">{siteConfig.letter.heading}</h2>

        {!isRevealed && !prefersReducedMotion && (
          <button
            className="letter-reveal-button"
            onClick={handleReveal}
            aria-label="Reveal the letter"
          >
            {siteConfig.letter.revealButtonText}
          </button>
        )}

        <div className="letter-paper">
          {/* Decorative elements */}
          <div className="letter-paper__edge" aria-hidden="true" />

          <div className="letter-content">
            {paragraphs.map((paragraph, index) => {
              const isShown = showAll || revealProgress > index;
              return (
                <p
                  key={index}
                  className={`letter-paragraph ${
                    isShown ? "letter-paragraph--visible" : ""
                  } ${index === 0 ? "letter-paragraph--greeting" : ""}`}
                >
                  {paragraph}
                </p>
              );
            })}

            {/* Closing */}
            <div
              className={`letter-closing ${
                showAll || revealProgress > paragraphs.length
                  ? "letter-closing--visible"
                  : ""
              }`}
            >
              <p className="letter-closing__text">{closing}</p>
              <p className="letter-closing__final">{finalLine}</p>
              <p className="letter-closing__signature">
                {siteConfig.senderName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
