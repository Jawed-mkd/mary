import { useState } from "react";
import { siteConfig } from "../content";
import "./Envelope.css";

interface EnvelopeProps {
  onOpen: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsOpened(true);
      setTimeout(() => {
        onOpen();
      }, 800);
    }, 1200);
  };

  return (
    <section
      className={`envelope-section ${isOpened ? "envelope-section--opened" : ""}`}
      aria-label="Welcome"
    >
      <div className="envelope-container">
        {/* Floating particles */}
        <div className="envelope-particles" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={`particle particle--${i + 1}`}>✦</span>
          ))}
        </div>

        <p className="envelope-greeting">{siteConfig.envelope.greeting}</p>
        <p className="envelope-subtitle">{siteConfig.envelope.subtitle}</p>

        {/* Envelope visual */}
        <div
          className={`envelope ${isOpening ? "envelope--opening" : ""}`}
          aria-hidden="true"
        >
          <div className="envelope__flap" />
          <div className="envelope__body">
            <div className="envelope__letter">
              <div className="envelope__letter-lines">
                <span /><span /><span /><span />
              </div>
              <div className="envelope__heart">♡</div>
            </div>
          </div>
        </div>

        {!isOpening && (
          <button
            className="envelope-button"
            onClick={handleOpen}
            aria-label="Open the gift"
          >
            {siteConfig.envelope.buttonText}
          </button>
        )}
      </div>
    </section>
  );
}
