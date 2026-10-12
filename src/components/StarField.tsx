import { useEffect, useRef } from "react";
import "./StarField.css";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = document.documentElement.scrollHeight;
      generateStars();
    }

    function generateStars() {
      const count = Math.floor(
        (canvas!.width * canvas!.height) / 12000
      );
      starsRef.current = Array.from({ length: Math.min(count, 200) }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const star of starsRef.current) {
        const alpha = prefersReducedMotion
          ? star.opacity
          : star.opacity *
            (0.5 +
              0.5 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset));

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(232, 213, 176, ${alpha})`;
        ctx!.fill();

        // Subtle glow
        if (star.size > 1.2) {
          ctx!.beginPath();
          ctx!.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(232, 213, 176, ${alpha * 0.15})`;
          ctx!.fill();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    }

    resize();

    // Use ResizeObserver on document body to catch height changes
    const resizeObserver = new ResizeObserver(() => {
      canvas!.width = window.innerWidth;
      canvas!.height = document.documentElement.scrollHeight;
    });
    resizeObserver.observe(document.body);

    window.addEventListener("resize", resize);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="star-field"
      aria-hidden="true"
    />
  );
}
