import { Anchor, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDollar } from '../utils/percentMath';

export type TagTone = 'anchor' | 'marked' | 'selling' | 'profit' | 'loss' | 'neutral';

interface PriceTagPropProps {
  label: string;
  shortCode: string;
  amount: number;
  tone: TagTone;
  isAnchor?: boolean;
  dimmed?: boolean;
  subtitle?: string;
}

const TONE_STYLES: Record<TagTone, { bg: string; header: string; text: string }> = {
  anchor: { bg: 'bg-blue-50', header: 'bg-blue-600 text-white', text: 'text-blue-950' },
  marked: { bg: 'bg-amber-50', header: 'bg-amber-500 text-slate-950', text: 'text-amber-950' },
  selling: { bg: 'bg-white', header: 'bg-slate-800 text-white', text: 'text-slate-900' },
  profit: { bg: 'bg-emerald-50', header: 'bg-emerald-600 text-white', text: 'text-emerald-950' },
  loss: { bg: 'bg-rose-50', header: 'bg-rose-600 text-white', text: 'text-rose-950' },
  neutral: { bg: 'bg-slate-50', header: 'bg-slate-600 text-white', text: 'text-slate-900' },
};

export function PriceTagProp({
  label,
  shortCode,
  amount,
  tone,
  isAnchor = false,
  dimmed = false,
  subtitle,
}: PriceTagPropProps) {
  const style = TONE_STYLES[tone];

  return (
    <motion.div
      animate={{
        opacity: dimmed ? 0.35 : 1,
        scale: isAnchor && !dimmed ? 1.03 : dimmed ? 0.96 : 1,
      }}
      transition={{ duration: 0.22 }}
      className={`relative rounded-xl border-2 border-slate-800 ${style.bg} shadow-[0_4px_0_#1e293b] overflow-hidden min-w-[136px]`}
    >
      {/* Tag String Hole */}
      <div className={`${style.header} px-3 py-1.5 flex items-center justify-between gap-2 border-b-2 border-slate-800`}>
        <span className="text-xs font-bold tracking-tight whitespace-nowrap">{label}</span>
        <span className="tabular-math text-[11px] font-bold opacity-90">{shortCode}</span>
      </div>

      <div className="p-3 text-center">
        <div className={`tabular-math text-2xl font-bold ${style.text}`}>{formatDollar(amount)}</div>
        {subtitle && <div className="text-[11px] text-slate-600 mt-0.5">{subtitle}</div>}

        {isAnchor && !dimmed && (
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-bold border border-slate-800">
            <Anchor className="w-3 h-3" />
            <span>100% ANCHOR</span>
          </div>
        )}

        {dimmed && (
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 text-[11px] font-semibold">
            <Tag className="w-3 h-3" />
            <span>Not in this bridge</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
