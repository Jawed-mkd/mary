import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../content";
import "./MessageSection.css";

export default function MessageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      className={`message-section ${isVisible ? "message-section--visible" : ""}`}
      aria-label="A message for Mary"
    >
      <div className="message-container">
        {/* Decorative flourish */}
        <div className="message-flourish" aria-hidden="true">
          <svg width="80" height="20" viewBox="0 0 80 20" fill="none">
            <path
              d="M0 10 Q20 0 40 10 Q60 20 80 10"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
          </svg>
        </div>

        <h1 className="message-heading">{siteConfig.message.heading}</h1>

        <div className="message-body">
          {siteConfig.message.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="message-paragraph"
              style={{ animationDelay: `${0.3 + index * 0.15}s` }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Decorative divider */}
        <div className="message-divider" aria-hidden="true">
          <span className="message-divider__star">✦</span>
        </div>
      </div>
    </section>
  );
}
