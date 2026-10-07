import React, { useEffect, useRef } from 'react';

export const IndustrialHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates
    let mouse = { x: width / 2, y: height / 2, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Particles system: Rubber Crumb & Steel Fibers
    const PARTICLE_COUNT = 85;
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      isSteel: boolean;
      angle: number;
      speed: number;
      distFromCenter: number;
    }

    const particles: Particle[] = [];
    const centerX = width * 0.55;
    const centerY = height * 0.5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isSteel = Math.random() < 0.25;
      const dist = 40 + Math.random() * (Math.min(width, height) * 0.42);
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: isSteel ? 2 : Math.random() * 2.8 + 1.2,
        color: isSteel ? '#38bdf8' : Math.random() > 0.4 ? '#10b981' : '#64748b',
        isSteel,
        angle,
        speed: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        distFromCenter: dist
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const cx = width > 768 ? width * 0.58 : width * 0.5;
      const cy = height * 0.5;

      // 1. Draw Subtle Background Glows
      const radialGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(width, height) * 0.48);
      radialGrad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
      radialGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.05)');
      radialGrad.addColorStop(1, 'rgba(11, 15, 23, 0)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Heavy Industrial Vulcanization Press Guide Lines (Isometric HUD)
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';

      // Crosshairs & concentric circles
      [140, 200, 260].forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 1 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(51, 65, 85, 0.25)';
        ctx.setLineDash(idx === 1 ? [6, 6] : [4, 8]);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // 3. Rotating Tire Tread Geometry (Outer Ring)
      const treadTeeth = 32;
      const outerR = 195;
      const innerR = 180;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.25);

      ctx.beginPath();
      for (let i = 0; i < treadTeeth; i++) {
        const theta1 = (i / treadTeeth) * Math.PI * 2;
        const theta2 = ((i + 0.45) / treadTeeth) * Math.PI * 2;
        const theta3 = ((i + 0.5) / treadTeeth) * Math.PI * 2;
        const theta4 = ((i + 0.95) / treadTeeth) * Math.PI * 2;

        ctx.lineTo(Math.cos(theta1) * outerR, Math.sin(theta1) * outerR);
        ctx.lineTo(Math.cos(theta2) * outerR, Math.sin(theta2) * outerR);
        ctx.lineTo(Math.cos(theta3) * innerR, Math.sin(theta3) * innerR);
        ctx.lineTo(Math.cos(theta4) * innerR, Math.sin(theta4) * innerR);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 4. Center Core: Hydraulic Compression Cylinder & MAG Core
      const pressHeight = 70 + Math.sin(time * 1.5) * 12; // Pulsing hydraulic press compression
      
      // Top press piston
      ctx.save();
      ctx.translate(cx, cy);
      
      const pressGrad = ctx.createLinearGradient(-50, -pressHeight, 50, pressHeight);
      pressGrad.addColorStop(0, '#1e293b');
      pressGrad.addColorStop(0.5, '#334155');
      pressGrad.addColorStop(1, '#0f172a');
      
      // Top piston plate
      ctx.fillStyle = pressGrad;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-60, -pressHeight - 20, 120, 20, 4);
      ctx.fill();
      ctx.stroke();

      // Hydraulic shaft
      ctx.fillStyle = '#475569';
      ctx.fillRect(-15, -pressHeight - 65, 30, 45);

      // Bottom vulcanization mold bed
      ctx.fillStyle = pressGrad;
      ctx.beginPath();
      ctx.roundRect(-60, pressHeight, 120, 20, 4);
      ctx.fill();
      ctx.stroke();

      // Central Compressed Rubber Block (forming between pistons)
      const blockGrad = ctx.createLinearGradient(-45, -pressHeight + 10, 45, pressHeight - 10);
      blockGrad.addColorStop(0, 'rgba(16, 185, 129, 0.85)');
      blockGrad.addColorStop(0.5, 'rgba(5, 150, 105, 0.95)');
      blockGrad.addColorStop(1, 'rgba(16, 185, 129, 0.85)');

      ctx.fillStyle = blockGrad;
      ctx.beginPath();
      ctx.roundRect(-45, -pressHeight + 20, 90, pressHeight * 2 - 20, 6);
      ctx.fill();

      // Embedded Steel Core Inside Rubber (represented as glowing steel insert)
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fillRect(-28, -8, 56, 16);
      ctx.shadowBlur = 0;

      // MAG text on the compressed core
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MAG PRESS', 0, 0);

      ctx.restore();

      // 5. Connective Energy Lines & Particles (Rubber Crumb & Steel Fibers)
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Orbit or movement
        p.angle += p.speed;
        let targetX = cx + Math.cos(p.angle) * p.distFromCenter;
        let targetY = cy + Math.sin(p.angle) * p.distFromCenter;

        // Slight mouse attraction
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distMouse = Math.sqrt(dx * dx + dy * dy);
          if (distMouse < 180) {
            targetX += (dx / distMouse) * 25;
            targetY += (dy / distMouse) * 25;
          }
        }

        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect nearby particles to simulate crumb bonding
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.isSteel || p2.isSteel
              ? `rgba(56, 189, 248, ${0.35 * (1 - dist / 65)})`
              : `rgba(16, 185, 129, ${0.25 * (1 - dist / 65)})`;
            ctx.stroke();
          }
        }
      }

      // 6. Real-time Industrial HUD Telemetry Overlay on Canvas
      ctx.save();
      const hudY = height - 55;
      const hudX = 24;

      // Small telemetry badge 1
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, 150, 36, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(hudX + 16, hudY + 18, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '600 11px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText('ТИСК ПРЕСА: 500 Т', hudX + 28, hudY + 16);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('СТАТУС: ВУЛКАНІЗАЦІЯ', hudX + 28, hudY + 28);

      // Small telemetry badge 2
      const hud2X = hudX + 165;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.beginPath();
      ctx.roundRect(hud2X, hudY, 160, 36, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(hud2X + 16, hudY + 18, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '600 11px system-ui';
      ctx.fillText('СЕПАРАЦІЯ МЕТАЛУ', hud2X + 28, hudY + 16);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('ЧИСТОТА КРИХТИ: 99.98%', hud2X + 28, hudY + 28);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[440px] lg:min-h-[580px] flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-crosshair"
      />
    </div>
  );
};
