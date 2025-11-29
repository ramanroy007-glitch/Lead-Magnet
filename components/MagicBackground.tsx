import React, { useRef, useEffect } from 'react';

const MagicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useRef(window.innerWidth < 768);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    // Initial resize
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // NEW PALETTE: Aqua, Magenta, Violet
    const COLORS = [
      'rgba(0, 240, 255, ', // Neon Aqua
      'rgba(255, 0, 170, ', // Neon Magenta
      'rgba(112, 0, 255, ', // Neon Violet
    ];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      colorBase: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * 1.5 + 0.2; 
        this.speedX = Math.random() * 0.3 - 0.15; 
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.5;
        this.colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Subtle twinkling
        if (this.opacity > 0.01) this.opacity -= 0.002; 
        else this.opacity = Math.random() * 0.5; 

        // Wrap around screen
        if (this.x < 0) this.x = (canvas?.width || 0);
        if (this.x > (canvas?.width || 0)) this.x = 0;
        if (this.y < 0) this.y = (canvas?.height || 0);
        if (this.y > (canvas?.height || 0)) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.colorBase + this.opacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const particleCount = isMobile.current ? 40 : 80; 
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobile.current = window.innerWidth < 768;
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-deep-space">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
    </div>
  );
};

export default MagicBackground;