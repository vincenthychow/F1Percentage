import { motion } from 'motion/react';
import { CharacterMood, SpeakerId } from '../types/percent';

interface CharacterProps {
  speaker: SpeakerId;
  mood: CharacterMood;
  size?: number;
  label?: boolean;
}

const CHARACTER_INFO: Record<SpeakerId, { name: string; role: string; badgeBg: string }> = {
  pippa: { name: 'Pippa', role: 'Shop Owner', badgeBg: 'bg-rose-100 text-rose-900' },
  felix: { name: 'Felix', role: 'Apprentice', badgeBg: 'bg-amber-100 text-amber-900' },
  ollie: { name: 'Ollie', role: 'Anchor Owl', badgeBg: 'bg-blue-100 text-blue-900' },
};

export function CartoonCharacter({ speaker, mood, size = 128, label = true }: CharacterProps) {
  const info = CHARACTER_INFO[speaker];

  // Expressive bounce based on mood
  const bounceVariants = {
    happy: { y: [0, -3, 0], rotate: 0 },
    aha: { y: [0, -7, 0], rotate: [0, -2, 2, 0] },
    confused: { y: 0, rotate: [-2, 2, -2] },
    pointing: { y: [0, -2, 0], rotate: 1 },
    warning: { y: [0, -4, 0], rotate: [-1.5, 1.5, 0] },
  };

  return (
    <div className="flex flex-col items-center select-none">
      <motion.div
        animate={bounceVariants[mood]}
        transition={{
          duration: mood === 'aha' ? 0.9 : 2.6,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center"
      >
        {speaker === 'pippa' && <PippaSvg mood={mood} />}
        {speaker === 'felix' && <FelixSvg mood={mood} />}
        {speaker === 'ollie' && <OllieSvg mood={mood} />}

        {/* Expressive comic symbol above head */}
        {mood === 'confused' && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: -2 }}
            className="absolute -top-2 right-1 font-display font-bold text-lg text-amber-600 bg-white border-2 border-slate-800 rounded-full w-7 h-7 flex items-center justify-center shadow-[0_2px_0_#1e293b]"
          >
            ?
          </motion.span>
        )}
        {mood === 'aha' && (
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute -top-2 right-1 font-display font-bold text-base text-emerald-700 bg-emerald-100 border-2 border-slate-800 rounded-full w-7 h-7 flex items-center justify-center shadow-[0_2px_0_#1e293b]"
          >
            !
          </motion.span>
        )}
        {mood === 'warning' && (
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -top-2 right-1 font-display font-bold text-sm text-rose-700 bg-rose-100 border-2 border-slate-800 rounded-full w-7 h-7 flex items-center justify-center shadow-[0_2px_0_#1e293b]"
          >
            !!
          </motion.span>
        )}
      </motion.div>

      {label && (
        <div className="mt-1 text-center">
          <span className="font-display font-semibold text-sm text-slate-900">{info.name}</span>
          <span className="text-xs text-slate-500 ml-1.5">{info.role}</span>
        </div>
      )}
    </div>
  );
}

function EyesAndBrows({ mood, cx1 = 48, cx2 = 72, cy = 54 }: { mood: CharacterMood; cx1?: number; cx2?: number; cy?: number }) {
  if (mood === 'aha' || mood === 'happy') {
    return (
      <g>
        <path d={`M ${cx1 - 5} ${cy - 9} Q ${cx1} ${cy - 13} ${cx1 + 5} ${cy - 9}`} stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d={`M ${cx2 - 5} ${cy - 9} Q ${cx2} ${cy - 13} ${cx2 + 5} ${cy - 9}`} stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx={cx1} cy={cy} r="3.6" fill="#1E293B" />
        <circle cx={cx2} cy={cy} r="3.6" fill="#1E293B" />
        <circle cx={cx1 + 1.2} cy={cy - 1.2} r="1.2" fill="#FFFFFF" />
        <circle cx={cx2 + 1.2} cy={cy - 1.2} r="1.2" fill="#FFFFFF" />
      </g>
    );
  }
  if (mood === 'confused') {
    return (
      <g>
        <path d={`M ${cx1 - 5} ${cy - 8} L ${cx1 + 5} ${cy - 11}`} stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d={`M ${cx2 - 5} ${cy - 11} L ${cx2 + 5} ${cy - 8}`} stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx={cx1} cy={cy} r="3.6" fill="#1E293B" />
        <circle cx={cx2} cy={cy} r="3.6" fill="#1E293B" />
        <circle cx={cx1 + 1} cy={cy - 1} r="1.1" fill="#FFFFFF" />
        <circle cx={cx2 + 1} cy={cy - 1} r="1.1" fill="#FFFFFF" />
      </g>
    );
  }
  return (
    <g>
      <path d={`M ${cx1 - 5} ${cy - 10} Q ${cx1} ${cy - 12} ${cx1 + 5} ${cy - 10}`} stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d={`M ${cx2 - 5} ${cy - 10} Q ${cx2} ${cy - 12} ${cx2 + 5} ${cy - 10}`} stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx={cx1} cy={cy} r="3.6" fill="#1E293B" />
      <circle cx={cx2} cy={cy} r="3.6" fill="#1E293B" />
      <circle cx={cx1 + 1.2} cy={cy - 1.2} r="1.2" fill="#FFFFFF" />
      <circle cx={cx2 + 1.2} cy={cy - 1.2} r="1.2" fill="#FFFFFF" />
    </g>
  );
}

function Mouth({ mood, cx = 60, cy = 67 }: { mood: CharacterMood; cx?: number; cy?: number }) {
  if (mood === 'aha') {
    return <path d={`M ${cx - 8} ${cy - 2} Q ${cx} ${cy + 9} ${cx + 8} ${cy - 2} Z`} fill="#DC2626" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />;
  }
  if (mood === 'confused') {
    return <path d={`M ${cx - 7} ${cy + 2} Q ${cx - 2} ${cy - 2} ${cx + 2} ${cy + 2} T ${cx + 7} ${cy}`} stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  }
  if (mood === 'warning') {
    return <ellipse cx={cx} cy={cy + 1} rx="5" ry="4" fill="#DC2626" stroke="#1E293B" strokeWidth="2.2" />;
  }
  return <path d={`M ${cx - 8} ${cy - 1} Q ${cx} ${cy + 7} ${cx + 8} ${cy - 1}`} stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
}

function PippaSvg({ mood }: { mood: CharacterMood }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible" aria-label="Pippa the shop owner">
      {/* Hair bun */}
      <circle cx="60" cy="22" r="12" fill="#7C3F23" stroke="#1E293B" strokeWidth="3" />
      {/* Body & Shirt */}
      <path d="M 32 114 C 32 84 88 84 88 114 Z" fill="#F97316" stroke="#1E293B" strokeWidth="3" />
      {/* White Shop Apron */}
      <path d="M 42 86 L 78 86 L 82 114 L 38 114 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" strokeLinejoin="round" />
      <rect x="52" y="96" width="16" height="11" rx="2" fill="#EFF6FF" stroke="#1E293B" strokeWidth="2" />
      <text x="60" y="105" textAnchor="middle" fontSize="9" fontWeight="700" fill="#2563EB" fontFamily="Fredoka, sans-serif">
        %
      </text>
      {/* Head */}
      <circle cx="60" cy="54" r="24" fill="#FDE0C2" stroke="#1E293B" strokeWidth="3" />
      {/* Hair bangs */}
      <path d="M 36 50 C 37 32 83 32 84 50 C 75 40 45 40 36 50 Z" fill="#7C3F23" stroke="#1E293B" strokeWidth="3" />
      {/* Pencil behind ear */}
      <rect x="81" y="38" width="16" height="5" rx="2" transform="rotate(-24 81 38)" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
      {/* Cheeks */}
      <circle cx="43" cy="61" r="3.5" fill="#FDA4AF" opacity="0.7" />
      <circle cx="77" cy="61" r="3.5" fill="#FDA4AF" opacity="0.7" />
      <EyesAndBrows mood={mood} />
      <Mouth mood={mood} />
      {/* Pointing Arm */}
      {mood === 'pointing' && (
        <path d="M 84 94 L 105 80" stroke="#FDE0C2" strokeWidth="8" strokeLinecap="round" />
      )}
      {mood === 'pointing' && (
        <path d="M 84 94 L 105 80" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}

function FelixSvg({ mood }: { mood: CharacterMood }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible" aria-label="Felix the shop apprentice">
      {/* Body */}
      <path d="M 33 114 C 33 84 87 84 87 114 Z" fill="#0EA5E9" stroke="#1E293B" strokeWidth="3" />
      {/* Striped vest */}
      <path d="M 45 86 L 75 86 L 78 114 L 42 114 Z" fill="#FACC15" stroke="#1E293B" strokeWidth="3" />
      {/* Head */}
      <circle cx="60" cy="56" r="23" fill="#FCD5B5" stroke="#1E293B" strokeWidth="3" />
      {/* Cap */}
      <path d="M 36 46 C 36 28 84 28 84 46 Z" fill="#2563EB" stroke="#1E293B" strokeWidth="3" />
      <path d="M 34 46 L 93 46 C 95 46 95 51 87 51 L 36 51 Z" fill="#1D4ED8" stroke="#1E293B" strokeWidth="2.8" />
      <circle cx="60" cy="36" r="4.5" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
      {/* Cheeks */}
      <circle cx="44" cy="63" r="3.2" fill="#FDA4AF" opacity="0.65" />
      <circle cx="76" cy="63" r="3.2" fill="#FDA4AF" opacity="0.65" />
      <EyesAndBrows mood={mood} cy={56} />
      <Mouth mood={mood} cy={69} />
      {/* Hand scratching head when confused */}
      {mood === 'confused' && (
        <g>
          <path d="M 35 94 Q 20 68 35 46" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 35 94 Q 20 68 35 46" stroke="#FCD5B5" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        </g>
      )}
    </svg>
  );
}

function OllieSvg({ mood }: { mood: CharacterMood }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible" aria-label="Ollie the anchor owl">
      {/* Owl Body */}
      <ellipse cx="60" cy="70" rx="30" ry="38" fill="#475569" stroke="#1E293B" strokeWidth="3" />
      {/* Cream Belly */}
      <ellipse cx="60" cy="84" rx="19" ry="22" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2.5" />
      {/* Ear tufts */}
      <path d="M 35 38 L 28 24 L 45 33 Z" fill="#334155" stroke="#1E293B" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M 85 38 L 92 24 L 75 33 Z" fill="#334155" stroke="#1E293B" strokeWidth="2.8" strokeLinejoin="round" />
      {/* Eye circles & glasses */}
      <circle cx="48" cy="52" r="11" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
      <circle cx="72" cy="52" r="11" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
      <line x1="58" y1="52" x2="62" y2="52" stroke="#1E293B" strokeWidth="3" />
      {/* Pupils */}
      <circle cx="49" cy="52" r="4.2" fill="#1E293B" />
      <circle cx="71" cy="52" r="4.2" fill="#1E293B" />
      <circle cx="50.5" cy="50.5" r="1.4" fill="#FFFFFF" />
      <circle cx="72.5" cy="50.5" r="1.4" fill="#FFFFFF" />
      {/* Eyebrows for mood */}
      {mood === 'warning' && (
        <g>
          <line x1="39" y1="39" x2="55" y2="43" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="81" y1="39" x2="65" y2="43" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {/* Beak */}
      <path d="M 55 58 L 65 58 L 60 66 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
      {/* 100% Anchor Ruler held on right wing */}
      <g transform="translate(82, 54) rotate(12)">
        <rect x="0" y="0" width="14" height="44" rx="3" fill="#2563EB" stroke="#1E293B" strokeWidth="2.5" />
        <line x1="0" y1="10" x2="5" y2="10" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="0" y1="20" x2="7" y2="20" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="0" y1="30" x2="5" y2="30" stroke="#FFFFFF" strokeWidth="2" />
        <text x="7" y="40" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace">
          100
        </text>
      </g>
    </svg>
  );
}

export function SpeechBubble({
  speaker,
  title,
  speech,
  tip,
  formula,
}: {
  speaker: SpeakerId;
  title: string;
  speech: string;
  tip?: string;
  formula?: string;
}) {
  const info = CHARACTER_INFO[speaker];
  return (
    <div className="bg-white ink-card rounded-2xl p-5 relative">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-display font-bold text-sm text-slate-900">{info.name}</span>
          <span aria-hidden="true">·</span>
          <span>{info.role}</span>
        </div>
      </div>

      <h3 className="font-display font-bold text-xl text-slate-900 mb-2 text-balance">{title}</h3>
      <p className="text-[15px] leading-relaxed text-slate-700 mb-3">{speech}</p>

      {formula && (
        <div className="bg-[#FAF8F3] border-2 border-slate-800 rounded-xl px-3.5 py-2.5 mb-3">
          <div className="text-[11px] font-semibold text-slate-500 mb-0.5">Step Equation</div>
          <div className="tabular-math text-sm font-bold text-slate-900 break-words">{formula}</div>
        </div>
      )}

      {tip && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed text-amber-950">
          <span className="font-bold">Anchor Note: </span>
          {tip}
        </div>
      )}
    </div>
  );
}
