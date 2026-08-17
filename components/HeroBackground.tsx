"use client";

import React, { useEffect, useRef } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { FileText, ImageIcon, Crop, Minimize2, GitMerge, FileOutput, Shield, RefreshCw, SplitSquareVertical } from "lucide-react";

interface HeroBackgroundProps {
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
}

// Node labels for the dynamic network
const FILE_TYPES = [
  "PDF", "PNG", "JPG", "WEBP", "ZIP", "DOCX", "SVG", "AI", "Video", "Audio",
  "Merge", "Split", "Compress", "Resize", "Convert", "Extract"
];

// Node themes for the dynamic colorful network
const THEMES = [
  { color: '59, 130, 246', label: 'PDF' },     // Blue
  { color: '236, 72, 153', label: 'Video' },   // Pink
  { color: '249, 115, 22', label: 'Image' },   // Orange
  { color: '16, 185, 129', label: 'PNG' },     // Emerald
  { color: '168, 85, 247', label: 'DOCX' },    // Purple
  { color: '6, 182, 212', label: 'SVG' },      // Cyan
];

interface ClusterConfig {
  id: string;
  count: number;
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number };
}

interface DeviceConfig {
  tier: 'desktop' | 'tablet' | 'mobile';
  speedMultiplier: number;
  glowRadius: number;
  glowOpacityInner: number;
  glowOpacityMid: number;
  dotRadius: number;
  lineBaseAlpha: number;
  lineMaxDist: number;
  lineWidth: number;
  fontSize: string;
  paddingX: number;
  pillHeight: number;
  labelOffset: number;
  labelOpacityBg: number;
  labelOpacityText: number;
  clusters: ClusterConfig[];
}

function getDeviceConfig(width: number): DeviceConfig {
  if (width < 768) {
    // Mobile (<768px):
    // - Particle count: 8 (47% of desktop 17)
    // - Glow radius: 15 (50% reduction from 30)
    // - Glow opacity: 0.3 (50% reduction from 0.6)
    // - Dot radius: 1.75 (~30% reduction from 2.5)
    // - Line base opacity: 0.42 (~50% reduction from 0.85)
    // - Speed: 0.5x
    // - Smart outward label positioning to eliminate hero text overlap
    return {
      tier: 'mobile',
      speedMultiplier: 0.5,
      glowRadius: 15,
      glowOpacityInner: 0.3,
      glowOpacityMid: 0.08,
      dotRadius: 1.75,
      lineBaseAlpha: 0.42,
      lineMaxDist: 160,
      lineWidth: 1.0,
      fontSize: "600 7.5px Inter, sans-serif",
      paddingX: 5,
      pillHeight: 13,
      labelOffset: 10,
      labelOpacityBg: 0.08,
      labelOpacityText: 0.8,
      clusters: [
        { id: 'TL', count: 2, bounds: { xMin: 0.02, xMax: 0.28, yMin: 0.02, yMax: 0.30 } },
        { id: 'TR', count: 2, bounds: { xMin: 0.72, xMax: 0.98, yMin: 0.02, yMax: 0.30 } },
        { id: 'BL', count: 2, bounds: { xMin: 0.02, xMax: 0.28, yMin: 0.70, yMax: 0.98 } },
        { id: 'BR', count: 2, bounds: { xMin: 0.72, xMax: 0.98, yMin: 0.70, yMax: 0.98 } },
      ],
    };
  } else if (width <= 1024) {
    // Tablet (768px-1024px):
    // - Particle count: 12 (~70% of desktop 17)
    // - Glow opacity: 0.48 (20% reduction from 0.6)
    // - Glow radius: 24 (20% reduction from 30)
    // - Line base opacity: 0.6 (~30% reduction from 0.85)
    // - Speed: 0.75x
    return {
      tier: 'tablet',
      speedMultiplier: 0.75,
      glowRadius: 24,
      glowOpacityInner: 0.48,
      glowOpacityMid: 0.16,
      dotRadius: 2.1,
      lineBaseAlpha: 0.6,
      lineMaxDist: 220,
      lineWidth: 1.2,
      fontSize: "600 8.5px Inter, sans-serif",
      paddingX: 7,
      pillHeight: 15,
      labelOffset: 12,
      labelOpacityBg: 0.1,
      labelOpacityText: 0.85,
      clusters: [
        { id: 'TL', count: 3, bounds: { xMin: 0.02, xMax: 0.35, yMin: 0.04, yMax: 0.40 } },
        { id: 'TR', count: 3, bounds: { xMin: 0.65, xMax: 0.98, yMin: 0.04, yMax: 0.40 } },
        { id: 'BL', count: 2, bounds: { xMin: 0.02, xMax: 0.35, yMin: 0.60, yMax: 0.96 } },
        { id: 'BR', count: 4, bounds: { xMin: 0.65, xMax: 0.98, yMin: 0.60, yMax: 0.96 } },
      ],
    };
  } else {
    // Desktop (>1024px) - Unchanged!
    return {
      tier: 'desktop',
      speedMultiplier: 1.0,
      glowRadius: 30,
      glowOpacityInner: 0.6,
      glowOpacityMid: 0.2,
      dotRadius: 2.5,
      lineBaseAlpha: 0.85,
      lineMaxDist: 280,
      lineWidth: 1.5,
      fontSize: "600 9px Inter, sans-serif",
      paddingX: 8,
      pillHeight: 16,
      labelOffset: 12,
      labelOpacityBg: 0.1,
      labelOpacityText: 0.9,
      clusters: [
        { id: 'TL', count: 5, bounds: { xMin: 0.02, xMax: 0.35, yMin: 0.05, yMax: 0.45 } },
        { id: 'TR', count: 4, bounds: { xMin: 0.65, xMax: 0.98, yMin: 0.05, yMax: 0.45 } },
        { id: 'BL', count: 3, bounds: { xMin: 0.02, xMax: 0.35, yMin: 0.55, yMax: 0.95 } },
        { id: 'BR', count: 5, bounds: { xMin: 0.65, xMax: 0.98, yMin: 0.55, yMax: 0.95 } },
      ],
    };
  }
}

export const HeroBackground = React.memo(function HeroBackground({ smoothMouseX, smoothMouseY }: HeroBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Transforms
  const gridX = useTransform(smoothMouseX, [-500, 500], [4, -4]);
  const gridY = useTransform(smoothMouseY, [-500, 500], [4, -4]);
  
  const iconsX = useTransform(smoothMouseX, [-500, 500], [15, -15]);
  const iconsY = useTransform(smoothMouseY, [-500, 500], [15, -15]);
  
  // Floating decorative icons (Layer 4)
  const floatingIcons = [
    { Icon: FileText, top: "12%", left: "8%", delay: 0 },
    { Icon: ImageIcon, top: "28%", right: "10%", delay: 0.2 },
    { Icon: Crop, bottom: "35%", left: "12%", delay: 0.4 },
    { Icon: Minimize2, bottom: "22%", right: "18%", delay: 0.6 },
    { Icon: GitMerge, top: "45%", left: "4%", delay: 0.8 },
    { Icon: FileOutput, top: "48%", right: "6%", delay: 1 },
    { Icon: Shield, top: "8%", right: "28%", delay: 1.2 },
    { Icon: RefreshCw, bottom: "12%", left: "35%", delay: 1.4 },
    { Icon: SplitSquareVertical, bottom: "42%", right: "8%", delay: 1.6 },
  ];

  useEffect(() => {
    if (shouldReduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let currentConfig = getDeviceConfig(width);
    
    // Cache for pre-rendered node glows
    const glowCache: Record<string, HTMLCanvasElement> = {};

    const preRenderGlow = (theme: typeof THEMES[0], config: DeviceConfig) => {
      const glowR = config.glowRadius;
      const size = glowR * 2;
      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const oCtx = offscreen.getContext('2d');
      if (!oCtx) return offscreen;

      const gradient = oCtx.createRadialGradient(glowR, glowR, 0, glowR, glowR, glowR);
      gradient.addColorStop(0, `rgba(${theme.color}, ${config.glowOpacityInner})`);
      gradient.addColorStop(0.3, `rgba(${theme.color}, ${config.glowOpacityMid})`);
      gradient.addColorStop(1, `rgba(${theme.color}, 0)`);
      
      oCtx.fillStyle = gradient;
      oCtx.beginPath();
      oCtx.arc(glowR, glowR, glowR, 0, Math.PI * 2);
      oCtx.fill();

      // Solid center point
      oCtx.fillStyle = `rgba(${theme.color}, 1)`;
      oCtx.beginPath();
      oCtx.arc(glowR, glowR, config.dotRadius, 0, Math.PI * 2);
      oCtx.fill();

      return offscreen;
    };

    const updateGlowCache = () => {
      THEMES.forEach(theme => {
        glowCache[theme.label] = preRenderGlow(theme, currentConfig);
      });
    };

    class NetworkNode {
      x: number; y: number;
      vx: number; vy: number;
      theme: typeof THEMES[0];
      label: string;
      cluster: ClusterConfig;

      constructor(cluster: ClusterConfig, index: number, w: number, h: number, speedMultiplier: number) {
        this.cluster = cluster;
        
        const b = this.cluster.bounds;
        const minX = w * b.xMin;
        const maxX = w * b.xMax;
        const minY = h * b.yMin;
        const maxY = h * b.yMax;

        this.x = minX + Math.random() * (maxX - minX);
        this.y = minY + Math.random() * (maxY - minY);
        
        this.vx = (Math.random() - 0.5) * 0.15 * speedMultiplier;
        this.vy = (Math.random() - 0.5) * 0.15 * speedMultiplier;
        this.theme = THEMES[index % THEMES.length];
        this.label = FILE_TYPES[Math.floor(Math.random() * FILE_TYPES.length)];
      }

      update(mx: number, my: number, w: number, h: number, speedMultiplier: number) {
        this.x += this.vx;
        this.y += this.vy;
        
        // Hover interaction (repel from mouse)
        const dx = this.x - mx;
        const dy = this.y - my;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        if (distToMouse < 120 && distToMouse > 0) {
            const force = (120 - distToMouse) / 120;
            this.vx += (dx / distToMouse) * force * 0.8;
            this.vy += (dy / distToMouse) * force * 0.8;
        }
        
        const b = this.cluster.bounds;
        const minX = w * b.xMin;
        const maxX = w * b.xMax;
        const minY = h * b.yMin;
        const maxY = h * b.yMax;

        // Soft bounce off cluster boundaries to keep them contained
        if (this.x < minX) { this.x = minX; this.vx *= -1; }
        if (this.x > maxX) { this.x = maxX; this.vx *= -1; }
        if (this.y < minY) { this.y = minY; this.vy *= -1; }
        if (this.y > maxY) { this.y = maxY; this.vy *= -1; }

        // Friction to prevent infinite acceleration
        this.vx *= 0.999;
        this.vy *= 0.999;
        
        // Random idle movement (slight wandering scaled by speed)
        if (Math.random() < 0.02) {
            this.vx += (Math.random() - 0.5) * 0.05 * speedMultiplier;
            this.vy += (Math.random() - 0.5) * 0.05 * speedMultiplier;
        }
      }

      draw(ctx: CanvasRenderingContext2D, config: DeviceConfig, w: number, h: number) {
        // Draw Glowing Dot (Pre-rendered)
        const glowCanvas = glowCache[this.theme.label];
        if (glowCanvas) {
          ctx.drawImage(glowCanvas, this.x - config.glowRadius, this.y - config.glowRadius);
        }

        // Draw Pill Label
        ctx.font = config.fontSize;
        const textWidth = ctx.measureText(this.label).width;
        const paddingX = config.paddingX;
        const pillHeight = config.pillHeight;
        
        // Smart directional label offset based on node position to project away from center and avoid overlapping
        let labelX: number;
        let labelY: number;

        if (config.tier === 'mobile') {
          labelX = this.x < w / 2 
            ? this.x + config.labelOffset 
            : this.x - (textWidth + paddingX * 2 + config.labelOffset);
          labelY = this.y < h / 2 
            ? this.y + config.labelOffset 
            : this.y - (pillHeight + config.labelOffset);
        } else {
          labelX = this.x + config.labelOffset;
          labelY = this.y - config.labelOffset;
        }

        // Pill background
        ctx.fillStyle = `rgba(${this.theme.color}, ${config.labelOpacityBg})`;
        ctx.beginPath();
        ctx.roundRect(labelX, labelY - pillHeight / 2, textWidth + paddingX * 2, pillHeight, pillHeight / 2);
        ctx.fill();
        
        // Pill text
        ctx.fillStyle = `rgba(${this.theme.color}, ${config.labelOpacityText})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.label, labelX + textWidth / 2 + paddingX, labelY);
      }
    }

    let nodes: NetworkNode[] = [];

    const initNodes = () => {
      nodes = [];
      let nodeIndex = 0;
      currentConfig.clusters.forEach(cluster => {
        for (let i = 0; i < cluster.count; i++) {
          nodes.push(new NetworkNode(cluster, nodeIndex++, width, height, currentConfig.speedMultiplier));
        }
      });
    };

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      
      const newConfig = getDeviceConfig(width);
      const tierChanged = newConfig.tier !== currentConfig.tier;
      currentConfig = newConfig;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      if (tierChanged || nodes.length === 0) {
        updateGlowCache();
        initNodes();
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = smoothMouseX.get() + width / 2;
      const my = smoothMouseY.get() + height / 2;

      // Draw dashed connections first so they render under the nodes
      ctx.setLineDash([3, 6]);

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < currentConfig.lineMaxDist) {
            const alpha = currentConfig.lineBaseAlpha * (1 - dist / currentConfig.lineMaxDist);
            
            const grad = ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
            grad.addColorStop(0, `rgba(${nodeA.theme.color}, ${alpha})`);
            grad.addColorStop(1, `rgba(${nodeB.theme.color}, ${alpha})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = currentConfig.lineWidth;
            
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            
            const midX = (nodeA.x + nodeB.x) / 2;
            const midY = (nodeA.y + nodeB.y) / 2;
            const offset = dist * 0.15 * (i % 2 === 0 ? 1 : -1);
            
            ctx.quadraticCurveTo(midX + offset, midY - offset, nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }
      
      // Reset dash for other potential drawings
      ctx.setLineDash([]);

      // Draw Nodes on top
      nodes.forEach(node => {
        node.update(mx, my, width, height, currentConfig.speedMultiplier);
        node.draw(ctx, currentConfig, width, height);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion, smoothMouseX, smoothMouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden bg-white">
      
      {/* Layer 1: Minimal Radial Lighting */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(59,130,246,0.03) 0%, transparent 70%)' }}></div>

      {/* Layer 2: Interactive Blueprint Grid */}
      <motion.div 
        style={{ x: gridX, y: gridY }}
        className="absolute -inset-10 opacity-40"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNSwgMjMsIDQyLCAwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_75%)]" />
      </motion.div>

      {/* Layer 3: Canvas Engine (Colorful Network Nodes & Connections) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Layer 4: Floating File Icons (Hidden on small mobile screens to keep view clean) */}
      {floatingIcons.map((item, idx) => (
        <motion.div
          key={idx}
          className="hidden sm:block absolute text-[#CBD5E1] opacity-[0.03] blur-[1px] will-change-transform [transform:translateZ(0)]"
          style={{ 
            top: item.top, 
            left: item.left, 
            right: item.right, 
            bottom: item.bottom,
            x: iconsX,
            y: iconsY,
          }}
          animate={shouldReduceMotion ? {} : { 
            y: [0, -10, 0],
            opacity: [0.02, 0.04, 0.02]
          }}
          transition={{ duration: 10 + (idx % 3), repeat: Infinity, ease: "easeInOut", delay: item.delay }}
        >
          <item.Icon className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1} />
        </motion.div>
      ))}

    </div>
  );
});
