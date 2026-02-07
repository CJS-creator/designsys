import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Glassmorphism base styles
export const glassStyles = {
  base: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl',
  elevated: 'bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl',
  surface: 'bg-black/20 backdrop-blur-lg border border-white/10 shadow-lg',
  interactive: 'bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300',
  subtle: 'bg-white/5 backdrop-blur-sm border border-white/5',
  strong: 'bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl',
} as const;

// Glass card props
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'low' | 'medium' | 'high';
  hoverEffect?: boolean;
  childrenClassName?: string;
}

// Glass card component
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      elevation = 'medium',
      hoverEffect = false,
      childrenClassName,
    },
    ref
  ) => {
    const elevations = {
      low: 'shadow-lg',
      medium: 'shadow-xl',
      high: 'shadow-2xl',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-2xl',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none',
          'after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/5 after:to-transparent after:pointer-events-none',
          glassStyles.base,
          elevations[elevation],
          hoverEffect && 'hover:scale-[1.02] hover:shadow-2xl transition-transform duration-300',
          className
        )}
        whileHover={hoverEffect ? { scale: 1.02 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className={cn('relative z-10', childrenClassName)}>{children}</div>
      </motion.div>
    );
  }
);
GlassCard.displayName = 'GlassCard';

// Animated gradient border props
export interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  duration?: number;
  width?: number;
}

// Animated gradient border component
export const GradientBorder = React.forwardRef<HTMLDivElement, GradientBorderProps>(
  (
    {
      children,
      className,
      colors = ['#ff0080', '#7928ca', '#ff0080'],
      duration = 3,
      // width = 2, // Unused
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('relative p-[1px] rounded-2xl overflow-hidden', className)}>
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${colors.join(', ')})`,
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
          }}
          transition={{
            duration,
            ease: 'linear',
            repeat: Infinity,
          }}
        />
        <div className="relative bg-background rounded-[15px] p-6">{children}</div>
      </div>
    );
  }
);
GradientBorder.displayName = 'GradientBorder';

// Shimmer effect props
export interface ShimmerProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
}

// Shimmer loading effect component
export const Shimmer = React.forwardRef<HTMLDivElement, ShimmerProps>(
  (
    {
      children,
      className,
      direction = 'right',
      duration = 1.5,
      delay = 0,
    },
    ref
  ) => {
    const directions = {
      left: { x: ['100%', '-100%'] },
      right: { x: ['-100%', '100%'] },
      up: { y: ['100%', '-100%'] },
      down: { y: ['-100%', '100%'] },
    };

    return (
      <div ref={ref} className={cn('relative overflow-hidden', className)}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={directions[direction]}
          transition={{
            duration,
            ease: 'easeInOut',
            repeat: Infinity,
            delay,
          }}
          style={{
            width: '150%',
            transform: direction === 'left' || direction === 'right' ? 'translateY(-50%)' : 'translateX(-50%)',
          }}
        />
        {children}
      </div>
    );
  }
);
Shimmer.displayName = 'Shimmer';

// Noise texture overlay
export interface NoiseOverlayProps {
  className?: string;
  opacity?: number;
}

// Noise texture overlay component
export const NoiseOverlay: React.FC<NoiseOverlayProps> = ({
  className,
  opacity = 0.03,
}) => {
  return (
    <div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity,
      }}
    />
  );
};

// Glow effect props
export interface GlowProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  intensity?: number;
  size?: number;
  blur?: number;
}

// Glow effect component
export const Glow: React.FC<GlowProps> = ({
  children,
  className,
  color = 'var(--primary)',
  intensity = 0.5,
  size = 200,
  blur = 40,
}) => {
  return (
    <div className={cn('relative inline-flex', className)}>
      <div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background: color,
          opacity: intensity,
          filter: `blur(${blur}px)`,
          width: size,
          height: size,
          transform: 'translate(-50%, -50%)',
        }}
      />
      {children}
    </div>
  );
};

// Ambient light props
export interface AmbientLightProps {
  className?: string;
  colors?: string[];
  duration?: number;
}

// Ambient background light effect
export const AmbientLight: React.FC<AmbientLightProps> = ({
  className,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  duration = 10,
}) => {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
        animate={{
          background: colors.map((c, i) => (i % 2 === 0 ? c : colors[(i + 1) % colors.length])),
          x: [0, 100, 0, -100, 0],
          y: [0, -50, 0, 50, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: colors[0],
          top: '20%',
          left: '30%',
        }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full blur-[80px]"
        animate={{
          background: colors.map((_c, i) => colors[(i + 1) % colors.length]),
          x: [0, -100, 0, 100, 0],
          y: [0, 50, 0, -50, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: duration / 2,
        }}
        style={{
          background: colors[1],
          bottom: '20%',
          right: '20%',
        }}
      />
    </div>
  );
};

// Backdrop blur props
export interface BackdropBlurProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

// Backdrop blur wrapper
export const BackdropBlur: React.FC<BackdropBlurProps> = ({
  children,
  className,
  intensity = 'medium',
}) => {
  const intensities = {
    low: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    high: 'backdrop-blur-lg',
  };

  return (
    <div className={cn('relative', className)}>
      <div className={cn('relative z-10', intensities[intensity])}>{children}</div>
    </div>
  );
};

// Spotlight effect props
export interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  size?: number;
}

// Spotlight effect component
export const Spotlight: React.FC<SpotlightProps> = ({
  children,
  className,
  color = 'white',
  size = 400,
}) => {
  return (
    <div className={cn('relative', className)}>
      <motion.div
        className="absolute rounded-full blur-3xl pointer-events-none"
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: color,
          width: size,
          height: size,
          filter: 'blur(100px)',
          opacity: 0.4,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// CSS glassmorphism utilities
export const glassUtilities = `
  /* Glass effect utilities */
  .glass {
    @apply bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl;
  }
  
  .glass-sm {
    @apply bg-white/5 backdrop-blur-md border border-white/10;
  }
  
  .glass-lg {
    @apply bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl;
  }
  
  .glass-hover {
    @apply transition-all duration-300;
  }
  
  .glass-hover:hover {
    @apply bg-white/20 border-white/30;
  }
  
  /* Animated gradient border */
  .gradient-border {
    @apply relative p-[1px] rounded-2xl overflow-hidden;
    background: linear-gradient(90deg, #ff0080, #7928ca, #ff0080);
    background-size: 200% 100%;
    animation: gradient-slide 3s linear infinite;
  }
  
  @keyframes gradient-slide {
    0% { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
  }
  
  /* Noise texture */
  .noise-overlay {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
  }
  
  /* Shimmer effect */
  .shimmer {
    @apply relative overflow-hidden;
  }
  
  .shimmer::after {
    content: '';
    @apply absolute inset-0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    animation: shimmer-slide 1.5s infinite;
  }
  
  @keyframes shimmer-slide {
    100% { transform: translateX(100%); }
  }
  
  /* Glow effect */
  .glow {
    @apply relative;
  }
  
  .glow::before {
    content: '';
    @apply absolute inset-0 rounded-full;
    background: var(--glow-color, var(--primary));
    filter: blur(var(--glow-blur, 40px));
    opacity: var(--glow-opacity, 0.5);
  }
`;
