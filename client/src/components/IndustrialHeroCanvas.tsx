import React, { useEffect, useRef, useState } from 'react';

export const IndustrialHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hintText, setHintText] = useState<'idle' | 'pressing' | 'struck'>('idle');
  const [pressedCount, setPressedCount] = useState(0);

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

    // Audio Context for Industrial SFX (Hydraulic pump + Impact thud + Steam hiss)
    let audioCtx: AudioContext | null = null;
    const initAudio = () => {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    };

    const playImpactSound = () => {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);

        // Steam hiss
        const bufferSize = audioCtx.sampleRate * 0.4;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1800;
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.25, audioCtx.currentTime + 0.05);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noise.start(audioCtx.currentTime + 0.05);
      } catch (_) {}
    };

    // State Variables for Interactive Press
    let isUserPressing = false;
    let compressionProgress = 0; // 0 = rest, 1 = fully compressed
    let targetProgress = 0;
    let hasTriggeredImpact = false;
    let shakeIntensity = 0;
    let flashIntensity = 0;

    // Sparks & Steam systems
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      life: number;
    }
    interface Steam {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }

    const sparks: Spark[] = [];
    const steamClouds: Steam[] = [];

    // Mouse & Touch events
    let mouse = { x: width / 2, y: height / 2, active: false };

    const startInteraction = (clientX: number, clientY: number) => {
      initAudio();
      isUserPressing = true;
      hasTriggeredImpact = false;
      const rect = canvas.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      mouse.active = true;
      setHintText('pressing');
    };

    const moveInteraction = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      mouse.active = true;

      if (isUserPressing) {
        const cy = height * 0.5;
        // Drag calculation relative to press center
        const delta = (mouse.y - (cy - 120)) / 140;
        targetProgress = Math.min(1.0, Math.max(0.2, delta));
      }
    };

    const endInteraction = () => {
      if (isUserPressing) {
        isUserPressing = false;
        targetProgress = 0;

        // Emit steam on release
        const cx = width > 768 ? width * 0.58 : width * 0.5;
        const cy = height * 0.5;
        for (let i = 0; i < 18; i++) {
          steamClouds.push({
            x: cx + (Math.random() - 0.5) * 80,
            y: cy + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 2.5,
            vy: -Math.random() * 2.5 - 1.2,
            radius: Math.random() * 12 + 6,
            alpha: 0.6
          });
        }
        setHintText('idle');
      }
    };

    // Listeners for Mouse
    const onMouseDown = (e: MouseEvent) => startInteraction(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => moveInteraction(e.clientX, e.clientY);
    const onMouseUp = () => endInteraction();
    const onMouseLeave = () => {
      mouse.active = false;
      endInteraction();
    };

    // Listeners for Touch
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        startInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        moveInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => endInteraction();

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

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
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isSteel = Math.random() < 0.28;
      const dist = 40 + Math.random() * (Math.min(width, height) * 0.44);
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x: width * 0.55 + Math.cos(angle) * dist,
        y: height * 0.5 + Math.sin(angle) * dist,
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

      // Handle Smooth Compression Dynamics
      if (isUserPressing) {
        targetProgress = Math.max(targetProgress, 0.45); // minimum engagement on click
        compressionProgress += (targetProgress - compressionProgress) * 0.22;
      } else {
        // Idle gentle breathing motion
        const idleVal = (Math.sin(time * 1.5) + 1) * 0.08;
        compressionProgress += (idleVal - compressionProgress) * 0.08;
      }

      // Check Impact Trigger (Peak 500 Tons Strike)
      if (compressionProgress > 0.88 && !hasTriggeredImpact) {
        hasTriggeredImpact = true;
        shakeIntensity = 10;
        flashIntensity = 1.0;
        playImpactSound();
        setHintText('struck');
        setPressedCount(prev => prev + 1);

        const cx = width > 768 ? width * 0.58 : width * 0.5;
        const cy = height * 0.5;

        // Spawn Hot Sparks (Metal cord & molten vulcanization)
        for (let i = 0; i < 45; i++) {
          const sparkAngle = Math.random() * Math.PI * 2;
          const sparkSpeed = Math.random() * 7 + 3;
          sparks.push({
            x: cx + (Math.random() - 0.5) * 60,
            y: cy,
            vx: Math.cos(sparkAngle) * sparkSpeed,
            vy: Math.sin(sparkAngle) * sparkSpeed,
            color: Math.random() > 0.3 ? '#34d399' : '#38bdf8',
            size: Math.random() * 3 + 1.5,
            alpha: 1.0,
            life: Math.random() * 25 + 15
          });
        }
      }

      // Screen Shake application
      let shakeX = 0;
      let shakeY = 0;
      if (shakeIntensity > 0) {
        shakeX = (Math.random() - 0.5) * shakeIntensity;
        shakeY = (Math.random() - 0.5) * shakeIntensity;
        shakeIntensity *= 0.85;
        if (shakeIntensity < 0.2) shakeIntensity = 0;
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      const cx = width > 768 ? width * 0.58 : width * 0.5;
      const cy = height * 0.5;

      // 1. Subtle Radial Glow Background
      const glowColor = hasTriggeredImpact
        ? 'rgba(52, 211, 153, 0.25)'
        : 'rgba(16, 185, 129, 0.12)';
      const radialGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(width, height) * 0.48);
      radialGrad.addColorStop(0, glowColor);
      radialGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.05)');
      radialGrad.addColorStop(1, 'rgba(11, 15, 23, 0)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Flash Light Overlay
      if (flashIntensity > 0) {
        ctx.fillStyle = `rgba(52, 211, 153, ${flashIntensity * 0.35})`;
        ctx.fillRect(0, 0, width, height);
        flashIntensity *= 0.88;
      }

      // 2. Heavy Industrial Vulcanization Press Guide Lines
      ctx.save();
      ctx.lineWidth = 1;
      [140, 200, 260].forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 1 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(51, 65, 85, 0.25)';
        ctx.setLineDash(idx === 1 ? [6, 6] : [4, 8]);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.restore();

      // 3. Rotating Tire Tread Ring
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
      ctx.strokeStyle = hasTriggeredImpact ? 'rgba(52, 211, 153, 0.8)' : 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = hasTriggeredImpact ? 2.5 : 2;
      ctx.stroke();
      ctx.restore();

      // 4. Hydraulic Press Piston & Bed
      // Gap distance between top piston and bottom bed
      // Rest gap = 75px, Compressed gap = 16px!
      const currentGap = 75 - compressionProgress * 55;

      ctx.save();
      ctx.translate(cx, cy);

      const pressGrad = ctx.createLinearGradient(-60, -currentGap, 60, currentGap);
      pressGrad.addColorStop(0, '#1e293b');
      pressGrad.addColorStop(0.5, '#334155');
      pressGrad.addColorStop(1, '#0f172a');

      // Top Piston Plate (moves downward with user interaction!)
      ctx.fillStyle = pressGrad;
      ctx.strokeStyle = isUserPressing ? '#34d399' : '#10b981';
      ctx.lineWidth = isUserPressing ? 2.5 : 1.5;
      ctx.shadowColor = isUserPressing ? '#10b981' : 'transparent';
      ctx.shadowBlur = isUserPressing ? 15 : 0;

      ctx.beginPath();
      ctx.roundRect(-65, -currentGap - 22, 130, 22, 5);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Heavy Hydraulic Shaft Piston Cylinder
      ctx.fillStyle = '#475569';
      ctx.fillRect(-18, -currentGap - 80, 36, 60);

      // Interactive Grip Chevron on top piston
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-15, -currentGap - 11);
      ctx.lineTo(0, -currentGap - 4);
      ctx.lineTo(15, -currentGap - 11);
      ctx.stroke();

      // Bottom Vulcanization Mold Bed
      ctx.fillStyle = pressGrad;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-65, currentGap, 130, 22, 5);
      ctx.fill();
      ctx.stroke();

      // The Compressed Rubber Block Forming Between Pistons
      const blockHeight = currentGap * 2 - 8;
      const blockGrad = ctx.createLinearGradient(-45, -currentGap + 5, 45, currentGap - 5);
      if (hasTriggeredImpact) {
        blockGrad.addColorStop(0, '#34d399');
        blockGrad.addColorStop(0.5, '#059669');
        blockGrad.addColorStop(1, '#10b981');
      } else {
        blockGrad.addColorStop(0, 'rgba(16, 185, 129, 0.85)');
        blockGrad.addColorStop(0.5, 'rgba(5, 150, 105, 0.95)');
        blockGrad.addColorStop(1, 'rgba(16, 185, 129, 0.85)');
      }

      ctx.fillStyle = blockGrad;
      ctx.beginPath();
      ctx.roundRect(-48, -currentGap + 6, 96, blockHeight, 6);
      ctx.fill();

      // Embedded Steel Core Inside Rubber
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = hasTriggeredImpact ? 16 : 8;
      ctx.fillRect(-30, -5, 60, 10);
      ctx.shadowBlur = 0;

      // MAG PRESS label on core
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(hasTriggeredImpact ? 'MAG 500T ★' : 'MAG PRESS', 0, 0);

      ctx.restore();

      // 5. Connective Crumb Particles & Steel Fibers
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;
        let targetX = cx + Math.cos(p.angle) * p.distFromCenter;
        let targetY = cy + Math.sin(p.angle) * p.distFromCenter;

        // If user is actively pressing, particles rush toward the center press core!
        if (isUserPressing) {
          const attraction = compressionProgress * 0.45;
          targetX = targetX * (1 - attraction) + cx * attraction;
          targetY = targetY * (1 - attraction) + cy * attraction;
        }

        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.isSteel || p2.isSteel
              ? `rgba(56, 189, 248, ${0.35 * (1 - dist / 60)})`
              : `rgba(16, 185, 129, ${0.25 * (1 - dist / 60)})`;
            ctx.stroke();
          }
        }
      }

      // 6. Draw Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.15; // gravity
        s.alpha *= 0.94;
        s.life -= 1;

        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (s.life <= 0 || s.alpha < 0.05) {
          sparks.splice(i, 1);
        }
      }

      // 7. Draw Steam Clouds
      for (let i = steamClouds.length - 1; i >= 0; i--) {
        const st = steamClouds[i];
        st.x += st.vx;
        st.y += st.vy;
        st.radius += 0.45;
        st.alpha *= 0.95;

        ctx.fillStyle = 'rgba(241, 245, 249, 0.45)';
        ctx.globalAlpha = Math.max(0, st.alpha);
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (st.alpha < 0.02) {
          steamClouds.splice(i, 1);
        }
      }

      // 8. Real-time Industrial HUD Telemetry Overlay on Canvas
      ctx.save();
      const hudY = height - 55;
      const hudX = 24;

      // Dynamic tonnage calculation based on compressionProgress
      const currentTonnage = Math.round(compressionProgress * 500);

      // Telemetry badge 1: Dynamic Pressure
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = hasTriggeredImpact
        ? 'rgba(52, 211, 153, 0.9)'
        : isUserPressing
        ? 'rgba(56, 189, 248, 0.8)'
        : 'rgba(51, 65, 85, 0.6)';
      ctx.lineWidth = hasTriggeredImpact ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, 160, 38, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = hasTriggeredImpact ? '#34d399' : isUserPressing ? '#38bdf8' : '#10b981';
      ctx.beginPath();
      ctx.arc(hudX + 16, hudY + 19, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = hasTriggeredImpact ? '#34d399' : '#ffffff';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(`ТИСК: ${currentTonnage} Т / 500 Т`, hudX + 28, hudY + 16);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(
        hasTriggeredImpact
          ? 'СТАН: МОНОЛІТ ГОТОВИЙ'
          : isUserPressing
          ? 'СТАН: ПРЕСУВАННЯ...'
          : 'СТАН: ОЧІКУВАННЯ',
        hudX + 28,
        hudY + 29
      );

      // Telemetry badge 2: Cycles counter
      const hud2X = hudX + 175;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(hud2X, hudY, 150, 38, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(hud2X + 16, hudY + 19, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui';
      ctx.fillText(`ЦИКЛІВ: ${pressedCount}`, hud2X + 28, hudY + 16);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('ТЕМП: 165°C ГАРЯЧЕ', hud2X + 28, hudY + 29);

      ctx.restore();
      ctx.restore(); // end shake

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseLeave);

      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [pressedCount]);

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[590px] flex items-center justify-center overflow-hidden select-none">
      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Floating Interactive Call to Action Banner on Top */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-300 shadow-xl border ${
            hintText === 'struck'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-400 scale-105 shadow-emerald-500/20'
              : hintText === 'pressing'
              ? 'bg-blue-950/90 text-cyan-300 border-cyan-400 scale-100 shadow-cyan-500/20'
              : 'bg-slate-900/85 text-slate-200 border-emerald-500/40 hover:border-emerald-400'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                hintText === 'struck' ? 'bg-emerald-400' : 'bg-emerald-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                hintText === 'struck' ? 'bg-emerald-400' : 'bg-emerald-400'
              }`}
            />
          </span>

          <span>
            {hintText === 'struck'
              ? '💥 500 ТОНН! ВИРІБ СФОРМОВАНО'
              : hintText === 'pressing'
              ? '⚡ ТИСНІТЬ / ТЯГНІТЬ ДО 500 ТОНН'
              : '👆 ЗАТИСНІТЬ ПРЕС ДЛЯ ЗАПУСКУ'}
          </span>
        </div>
      </div>
    </div>
  );
};
