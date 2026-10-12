import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "../content";
import "./KindWords.css";

export default function KindWords() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shownIndices, setShownIndices] = useState<number[]>([0]);

  const { affirmations } = siteConfig.kindWords;

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

  const showNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setShownIndices((prev) => {
        // If all have been shown, reset
        let available = affirmations
          .map((_, i) => i)
          .filter((i) => !prev.includes(i));

        if (available.length === 0) {
          // Reset — pick a random one that isn't the current
          available = affirmations
            .map((_, i) => i)
            .filter((i) => i !== currentIndex);
          const next =
            available[Math.floor(Math.random() * available.length)];
          setCurrentIndex(next);
          return [next];
        }

        const next =
          available[Math.floor(Math.random() * available.length)];
        setCurrentIndex(next);
        return [...prev, next];
      });

      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  }, [isTransitioning, currentIndex, affirmations]);

  return (
    <section
      ref={sectionRef}
      className={`kind-words-section ${isVisible ? "kind-words-section--visible" : ""}`}
      aria-label="Kind words for you"
    >
      <div className="kind-words-container">
        <h2 className="kind-words-heading">{siteConfig.kindWords.heading}</h2>

        {/* Note display */}
        <div className="kind-words-note-wrapper">
          <div
            className={`kind-words-note ${isTransitioning ? "kind-words-note--fading" : ""}`}
            aria-live="polite"
          >
            <span className="kind-words-note__quote" aria-hidden="true">
              "
            </span>
            <p className="kind-words-note__text">
              {affirmations[currentIndex]}
            </p>
            <span className="kind-words-note__quote kind-words-note__quote--end" aria-hidden="true">
              "
            </span>

            {/* Paper texture decoration */}
            <div className="kind-words-note__pin" aria-hidden="true">
              ✦
            </div>
          </div>
        </div>

        <button
          className="kind-words-button"
          onClick={showNext}
          aria-label="Show another kind reminder"
        >
          {siteConfig.kindWords.buttonText}
        </button>

        {/* Small progress indicator */}
        <p className="kind-words-progress" aria-hidden="true">
          {shownIndices.length} of {affirmations.length} little notes
        </p>
      </div>
    </section>
  );
}
