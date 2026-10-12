import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../content";
import "./ReminderCards.css";

const cardIcons = ["✦", "❋", "✧", "❊", "✿", "◇"];

export default function ReminderCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

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

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className={`reminder-section ${isVisible ? "reminder-section--visible" : ""}`}
      aria-label="Things I hope you never forget"
    >
      <div className="reminder-container">
        <h2 className="reminder-heading">
          Things I hope you never forget
        </h2>

        <div className="reminder-grid">
          {siteConfig.cards.map((card, index) => (
            <article
              key={index}
              className={`reminder-card ${expandedCard === index ? "reminder-card--expanded" : ""}`}
              style={{ animationDelay: `${0.1 + index * 0.12}s` }}
            >
              <button
                className="reminder-card__toggle"
                onClick={() => toggleCard(index)}
                aria-expanded={expandedCard === index}
                aria-label={`${card.title} — click to ${expandedCard === index ? "collapse" : "expand"}`}
              >
                <span className="reminder-card__icon" aria-hidden="true">
                  {cardIcons[index % cardIcons.length]}
                </span>
                <span className="reminder-card__number" aria-hidden="true">
                  {card.number}
                </span>
                <h3 className="reminder-card__title">{card.title}</h3>
                <p className="reminder-card__short">{card.short}</p>
                <span className="reminder-card__expand-hint" aria-hidden="true">
                  {expandedCard === index ? "—" : "+"}
                </span>
              </button>

              <div
                className="reminder-card__long"
                role="region"
                aria-hidden={expandedCard !== index}
              >
                <p>{card.long}</p>
              </div>

              {/* Decorative corner */}
              <div className="reminder-card__corner" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
