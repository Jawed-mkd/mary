import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../content";
import "./FinalGift.css";

export default function FinalGift() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

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

  const handleReveal = () => {
    setShowSparkles(true);
    setTimeout(() => {
      setIsRevealed(true);
    }, 600);
  };

  return (
    <section
      ref={sectionRef}
      className={`final-section ${isVisible ? "final-section--visible" : ""}`}
      aria-label="A final gift"
    >
      <div className="final-container">
        <h2 className="final-heading">{siteConfig.finalGift.heading}</h2>

        {!isRevealed ? (
          <div className="final-star-wrapper">
            {/* Sparkle particles */}
            {showSparkles && (
              <div className="final-sparkles" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className="final-sparkle"
                    style={{
                      "--angle": `${i * 30}deg`,
                      "--delay": `${i * 0.05}s`,
                      "--distance": `${40 + Math.random() * 30}px`,
                    } as React.CSSProperties}
                  >
                    ✦
                  </span>
                ))}
              </div>
            )}

            <button
              className={`final-star-button ${showSparkles ? "final-star-button--clicked" : ""}`}
              onClick={handleReveal}
              aria-label="Reveal the final gift"
            >
              <svg
                className="final-star-svg"
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="30"
                  cy="30"
                  r="28"
                  fill="url(#starGrad)"
                  opacity="0.2"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="18"
                  fill="url(#starGrad)"
                  opacity="0.4"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="8"
                  fill="url(#starGrad)"
                  opacity="0.8"
                />
                <defs>
                  <radialGradient id="starGrad">
                    <stop offset="0%" stopColor="#e8d5b0" />
                    <stop offset="100%" stopColor="#d4a574" />
                  </radialGradient>
                </defs>
              </svg>
            </button>

            <p className="final-star-hint">
              ✦ tap the star ✦
            </p>
          </div>
        ) : (
          <div className="final-revealed">
            {siteConfig.finalGift.revealMessage.map((line, index) => (
              <p
                key={index}
                className="final-revealed__line"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer
          className={`final-footer ${isRevealed ? "final-footer--visible" : ""}`}
        >
          <div className="final-footer__divider" aria-hidden="true">
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>
          <p className="final-footer__text">{siteConfig.finalGift.footer}</p>
        </footer>
      </div>
    </section>
  );
}
