import React from 'react';
import { GraduationCap, Zap } from 'lucide-react';

interface GraduationCapLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GraduationCapLogo: React.FC<GraduationCapLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', cap: 18, zap: 10 },
    md: { box: 'w-10 h-10', cap: 22, zap: 12 },
    lg: { box: 'w-14 h-14', cap: 32, zap: 16 },
  };

  const { box, cap, zap } = sizeMap[size];

  return (
    <div
      id="graduation-cap-logo"
      className={`relative inline-flex items-center justify-center rounded-xl bg-neutral-900 border border-cyan-500/30 ${box} ${className}`}
      title="StudyMate AI Logo"
    >
      {/* Glowing Neon Cyan Lightning Effect ONLY on the graduation cap icon */}
      <div className="relative flex items-center justify-center neon-cyan-lightning-glow">
        <GraduationCap
          size={cap}
          className="text-[#00f0ff] stroke-[2.2]"
          aria-hidden="true"
        />
        {/* Miniature neon lightning electric spark accent */}
        <Zap
          size={zap}
          className="absolute -top-1 -right-1 text-[#00f0ff] fill-[#00f0ff] neon-cyan-spark animate-pulse stroke-[2.5]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
