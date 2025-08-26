import React, { useEffect, useRef } from "react";

export interface ParticleEffectsProps {
  type: "legendary" | "mythic";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export const ParticleEffects: React.FC<ParticleEffectsProps> = ({ type, intensity = "medium", className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    hue: number;
    life: number;
  }

  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();

    // Particle configuration
    const particleCount = intensity === "low" ? 8 : intensity === "medium" ? 15 : 25;
    const particles: Particle[] = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        hue: type === "legendary" ? 45 : Math.random() * 360, // Gold for legendary
        life: Math.random() * 100 + 50,
      });
    }

    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life--;

        // Legendary golden sparkles
        if (type === "legendary") {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = `hsl(${particle.hue}, 100%, 70%)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Mythic rainbow particles
        if (type === "mythic") {
          particle.hue += 2; // Cycle through colors
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsl(${particle.hue}, 80%, 60%)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Reset particle if out of bounds or dead
        if (
          particle.x < 0 ||
          particle.x > canvas.width ||
          particle.y < 0 ||
          particle.y > canvas.height ||
          particle.life <= 0
        ) {
          particles[index] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            hue: type === "legendary" ? 45 : Math.random() * 360,
            life: Math.random() * 100 + 50,
          };
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [type, intensity]);

  return (
    <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 1 }} />
  );
};

export default ParticleEffects;
