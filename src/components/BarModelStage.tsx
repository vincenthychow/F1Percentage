import { AlertTriangle, Anchor, ArrowDown, ArrowUp, CheckCircle2, Scissors } from 'lucide-react';
import { motion } from 'motion/react';
import { ChapterId, ChapterParams, VisualFocus } from '../types/percent';
import {
  analyzePercentageChange,
  analyzeReverseIncrease,
  analyzeShopPrices,
  formatDollar,
  formatPct,
  roundToClean,
} from '../utils/percentMath';
import { PriceTagProp } from './PriceTagProp';

interface BarModelStageProps {
  chapterId: ChapterId;
  params: ChapterParams;
  focus: VisualFocus;
  showWrongOverlay: boolean;
  stepIndex: number;
}

export function BarModelStage({
  chapterId,
  params,
  focus,
  showWrongOverlay,
  stepIndex,
}: BarModelStageProps) {
  if (chapterId === 'base-anchor') {
    return <ChapterOneStage params={params} focus={focus} showWrongOverlay={showWrongOverlay} stepIndex={stepIndex} />;
  }
  if (chapterId === 'reverse-percent') {
    return <ChapterTwoStage params={params} focus={focus} showWrongOverlay={showWrongOverlay} stepIndex={stepIndex} />;
  }
  if (chapterId === 'signed-change') {
    return <ChapterThreeStage params={params} focus={focus} showWrongOverlay={showWrongOverlay} />;
  }
  if (chapterId === 'dollars-vs-percent') {
    return <ChapterFourStage params={params} focus={focus} showWrongOverlay={showWrongOverlay} />;
  }
  return <ChapterFiveStage params={params} focus={focus} showWrongOverlay={showWrongOverlay} />;
}

/* -------------------------------------------------------------------------- */
/* CHAPTER 1: WHO OWNS 100%? (ORIGINAL VS NEW DENOMINATOR)                    */
/* -------------------------------------------------------------------------- */
function ChapterOneStage({
  params,
  focus,
  showWrongOverlay,
  stepIndex,
}: {
  params: ChapterParams;
  focus: VisualFocus;
  showWrongOverlay: boolean;
  stepIndex: number;
}) {
  const a = analyzePercentageChange(params.originalPrice, params.newPrice);
  const SCALE_MAX = 150;
  const origWidth = (a.original / SCALE_MAX) * 100;
  const newWidth = (a.current / SCALE_MAX) * 100;
  const diffWidth = (a.absDiff / SCALE_MAX) * 100;
  const showTrap = showWrongOverlay || focus === 'wrong-way';

  return (
    <div className="space-y-5">
      {/* Hanging Price Tags Row */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <PriceTagProp
          label="Original Price"
          shortCode="START"
          amount={a.original}
          tone="anchor"
          isAnchor={true}
          subtitle="Yesterday’s tag"
        />
        <div className="flex flex-col items-center text-slate-700">
          {a.isIncrease ? (
            <span className="inline-flex items-center gap-1 font-display font-bold text-emerald-700 text-lg">
              <ArrowUp className="w-5 h-5" />
              {formatDollar(a.diff, true)}
            </span>
          ) : a.isDecrease ? (
            <span className="inline-flex items-center gap-1 font-display font-bold text-rose-700 text-lg">
              <ArrowDown className="w-5 h-5" />
              {formatDollar(a.diff, true)}
            </span>
          ) : (
            <span className="font-display font-bold text-slate-500 text-lg">$0</span>
          )}
          <span className="text-xs text-slate-500">Dollar Change</span>
        </div>
        <PriceTagProp
          label="New Price"
          shortCode="NOW"
          amount={a.current}
          tone={a.isIncrease ? 'profit' : a.isDecrease ? 'loss' : 'neutral'}
          subtitle="Today’s tag"
        />
      </div>

      {/* Synchronized Bar Model (Strictly to Dollar Scale) */}
      <div className="bg-white border-2 border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5 text-blue-700 font-bold">
            <Anchor className="w-4 h-4" />
            100% Anchor locked onto Original ({formatDollar(a.original)})
          </span>
          <span className="tabular-math text-slate-500">True Scale: $0 to ${SCALE_MAX}</span>
        </div>

        {/* Ruler Scale Ticks */}
        <div className="relative flex justify-between text-[11px] tabular-math text-slate-400 font-semibold px-0.5">
          <span>$0</span>
          <span>$50</span>
          <span>$100</span>
          <span>$150</span>
        </div>

        {/* Original 100% Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-800">
            <span>Original Price Bar</span>
            <span className="tabular-math text-blue-700 font-bold">{formatDollar(a.original)} = 100%</span>
          </div>
          <div className="relative h-11 w-full bg-slate-100 rounded-xl border border-slate-300 flex items-center overflow-hidden">
            {/* Background guide ticks at $50 and $100 */}
            <div className="absolute inset-y-0 left-1/3 border-l border-slate-300/80 pointer-events-none" />
            <div className="absolute inset-y-0 left-2/3 border-l border-slate-300/80 pointer-events-none" />

            <motion.div
              animate={{ width: `${origWidth}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              className="h-full shrink-0 min-w-0 bg-blue-600 border-r-2 border-slate-900 flex items-center justify-center text-white font-bold text-xs overflow-hidden whitespace-nowrap"
            >
              {origWidth >= 14 && <span className="tabular-math px-1">{formatDollar(a.original)}</span>}
            </motion.div>
            <span className="tabular-math text-xs font-bold text-blue-900 bg-white/90 border border-slate-300 rounded px-1.5 py-0.5 whitespace-nowrap pointer-events-none absolute right-2">
              {formatDollar(a.original)} (100%)
            </span>
          </div>
        </div>

        {/* New Price Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-800">
            <span>New Price Bar</span>
            <span className="tabular-math font-bold text-slate-900">
              {formatDollar(a.current)} ({formatPct(100 + a.pctChange)} of original)
            </span>
          </div>
          <div className="relative h-11 w-full bg-slate-100 rounded-xl border border-slate-300 flex items-center overflow-hidden">
            {/* Background guide ticks at $50 and $100 */}
            <div className="absolute inset-y-0 left-1/3 border-l border-slate-300/80 pointer-events-none" />
            <div className="absolute inset-y-0 left-2/3 border-l border-slate-300/80 pointer-events-none" />

            {a.isIncrease ? (
              <>
                <motion.div
                  animate={{ width: `${origWidth}%` }}
                  transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                  className="h-full shrink-0 min-w-0 bg-blue-100 border-r-2 border-blue-700 flex items-center justify-center text-blue-900 font-bold text-xs tabular-math overflow-hidden whitespace-nowrap"
                >
                  {origWidth >= 14 && <span>{formatDollar(a.original)}</span>}
                </motion.div>
                <motion.div
                  animate={{ width: `${diffWidth}%` }}
                  transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                  className="h-full shrink-0 min-w-0 bg-emerald-500 border-r-2 border-slate-900 flex items-center justify-center text-white font-bold text-xs tabular-math overflow-hidden whitespace-nowrap"
                >
                  {diffWidth >= 10 && <span>+{formatDollar(a.absDiff)}</span>}
                </motion.div>
                <span className="tabular-math text-xs font-bold text-emerald-900 bg-white/90 border border-slate-300 rounded px-1.5 py-0.5 whitespace-nowrap pointer-events-none absolute right-2">
                  {formatDollar(a.current)} (+{formatDollar(a.absDiff)})
                </span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ width: `${newWidth}%` }}
                  transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                  className="h-full shrink-0 min-w-0 bg-slate-700 border-r-2 border-slate-900 flex items-center justify-center text-white font-bold text-xs tabular-math overflow-hidden whitespace-nowrap"
                >
                  {newWidth >= 14 && <span>{formatDollar(a.current)}</span>}
                </motion.div>
                {a.isDecrease && (
                  <motion.div
                    animate={{ width: `${origWidth - newWidth}%` }}
                    transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                    className="h-full shrink-0 min-w-0 bg-rose-100 border-y-2 border-r-2 border-dashed border-rose-600 flex items-center justify-center text-rose-800 font-bold text-xs tabular-math overflow-hidden whitespace-nowrap"
                  >
                    {origWidth - newWidth >= 10 && <span>−{formatDollar(a.absDiff)}</span>}
                  </motion.div>
                )}
                <span className="tabular-math text-xs font-bold text-slate-900 bg-white/90 border border-slate-300 rounded px-1.5 py-0.5 whitespace-nowrap pointer-events-none absolute right-2">
                  {formatDollar(a.current)} {a.isDecrease ? `(−${formatDollar(a.absDiff)})` : ''}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Comparison Box: Wrong Way vs Right Way */}
        {(showTrap || stepIndex >= 2) && (
          <div className={`grid gap-3 pt-2 ${showTrap ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {showTrap && (
              <div className="bg-rose-50 border-2 border-rose-600 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs mb-1">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>WRONG WAY (Dividing by New Price)</span>
                </div>
                <div className="tabular-math text-sm font-bold text-rose-950">
                  {formatDollar(a.absDiff)} ÷ {formatDollar(a.current)} = {formatPct(a.wrongNewBasePct)} ❌
                </div>
                <p className="text-xs text-rose-900 mt-1">
                  Uses {formatDollar(a.current)} as if it were 100%, shrinking or inflating the true rate!
                </p>
              </div>
            )}

            <div className="bg-emerald-50 border-2 border-emerald-700 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>RIGHT WAY (Dividing by 100% Original)</span>
              </div>
              <div className="tabular-math text-sm font-bold text-emerald-950">
                {formatDollar(a.absDiff)} ÷ {formatDollar(a.original)} = {formatPct(a.absPct)}{' '}
                {a.isIncrease ? 'Increase' : a.isDecrease ? 'Decrease' : ''} ✅
              </div>
              <p className="text-xs text-emerald-900 mt-1">
                Every percentage compares against the {formatDollar(a.original)} starting anchor.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CHAPTER 2: THE REVERSE-TRIP TRAP (FIND ORIGINAL FROM NEW)                  */
/* -------------------------------------------------------------------------- */
function ChapterTwoStage({
  params,
  focus,
  showWrongOverlay,
  stepIndex,
}: {
  params: ChapterParams;
  focus: VisualFocus;
  showWrongOverlay: boolean;
  stepIndex: number;
}) {
  const r = analyzeReverseIncrease(params.reverseNewPrice, params.reverseIncreasePct);
  const showTrap = showWrongOverlay || focus === 'wrong-way' || stepIndex >= 1;

  return (
    <div className="space-y-5">
      {/* Known New Tag vs Mystery Original Tag */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <PriceTagProp
          label="Original Price"
          shortCode="100%"
          amount={r.originalPrice}
          tone="anchor"
          isAnchor={true}
          subtitle={stepIndex < 3 ? 'Solved via blocks!' : 'Verified original'}
        />
        <div className="flex flex-col items-center text-emerald-700 font-display font-bold">
          <span className="inline-flex items-center gap-1 text-base">
            <ArrowUp className="w-4 h-4" /> +{r.increasePct}% markup
          </span>
          <span className="text-xs text-slate-500">Adds {r.extraBlocks} extra block{r.extraBlocks > 1 ? 's' : ''}</span>
        </div>
        <PriceTagProp
          label="New Price"
          shortCode={`${r.totalPct}%`}
          amount={r.newPrice}
          tone="profit"
          subtitle="Given on tag"
        />
      </div>

      {/* Equal Unit Block Bar Model */}
      <div className="bg-white border-2 border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-800">
            Equal Block Model ({r.totalBlocks} blocks = {r.totalPct}% = {formatDollar(r.newPrice)})
          </span>
          <span className="tabular-math font-bold text-blue-700">
            1 block ({r.unitBlockPct}%) = ${r.valuePerBlock}
          </span>
        </div>

        {/* Visual Block Strip */}
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${r.totalBlocks}, minmax(0, 1fr))` }}>
          {Array.from({ length: r.totalBlocks }).map((_, i) => {
            const isExtra = i >= r.originalBlocks;
            return (
              <motion.div
                key={i}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-lg border-2 border-slate-800 py-3 px-1 text-center flex flex-col items-center justify-center ${
                  isExtra ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                <span className="tabular-math text-xs font-bold">${r.valuePerBlock}</span>
                <span className="text-[10px] opacity-90">{r.unitBlockPct}%</span>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-1">
          <span className="inline-flex items-center gap-1.5 font-semibold text-blue-800">
            <span className="w-3 h-3 rounded-sm bg-blue-600 border border-slate-800 inline-block" />
            Original 100% ({r.originalBlocks} blocks = ${r.originalPrice})
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 border border-slate-800 inline-block" />
            Markup +{r.increasePct}% ({r.extraBlocks} block{r.extraBlocks > 1 ? 's' : ''} = +${roundToClean(r.valuePerBlock * r.extraBlocks, 2)})
          </span>
        </div>

        {showTrap && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-rose-50 border-2 border-rose-600 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs mb-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>TRAP (Subtracting {r.increasePct}% of ${r.newPrice})</span>
              </div>
              <div className="tabular-math text-sm font-bold text-rose-950">
                ${r.newPrice} − ${r.wrongSubtractAmount} = ${r.wrongOriginalPrice} ❌
              </div>
              <p className="text-xs text-rose-900 mt-1">
                {r.increasePct}% of the BIGGER ${r.newPrice} bar removes too much! Check: ${r.wrongOriginalPrice} + {r.increasePct}% ≠ ${r.newPrice}.
              </p>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-700 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>RIGHT WAY (Divide by {r.totalPct}%)</span>
              </div>
              <div className="tabular-math text-sm font-bold text-emerald-950">
                ${r.newPrice} ÷ {(r.totalPct / 100).toFixed(2)} = ${r.originalPrice} ✅
              </div>
              <p className="text-xs text-emerald-900 mt-1">
                Forward check: ${r.originalPrice} + {r.increasePct}% = ${r.newPrice}!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CHAPTER 3: SIGNED PERCENTAGE CHANGE (+ / -)                                */
/* -------------------------------------------------------------------------- */
function ChapterThreeStage({
  params,
  focus,
  showWrongOverlay,
}: {
  params: ChapterParams;
  focus: VisualFocus;
  showWrongOverlay: boolean;
}) {
  const forward = analyzePercentageChange(params.originalPrice, params.newPrice);
  const reverse = analyzePercentageChange(params.newPrice, params.originalPrice);
  const showTrap = showWrongOverlay || focus === 'wrong-way';

  return (
    <div className="space-y-5">
      <div className="bg-white border-2 border-slate-800 rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="font-display font-bold text-base text-slate-900">
            Two-Way Price Elevator (Watch the + and − Signs!)
          </h4>
          <span className="text-xs font-semibold text-slate-500">Sign = Direction · Number = Size</span>
        </div>

        {/* Forward Trip */}
        <div className="p-4 rounded-xl bg-[#FAF8F3] border-2 border-slate-800 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-bold text-slate-800">
              Trip 1: Start {formatDollar(forward.original)} → End {formatDollar(forward.current)}
            </span>
            <span
              className={`tabular-math text-base font-bold px-3 py-1 rounded-lg border-2 border-slate-800 inline-flex items-center gap-1 ${
                forward.diff > 0
                  ? 'bg-emerald-500 text-white'
                  : forward.diff < 0
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-200 text-slate-800'
              }`}
            >
              {forward.diff > 0 && <ArrowUp className="w-4 h-4" />}
              {forward.diff < 0 && <ArrowDown className="w-4 h-4" />}
              {formatPct(forward.pctChange, true)}
            </span>
          </div>
          <div className="tabular-math text-xs text-slate-700">
            (New − Original) ÷ Original = ({formatDollar(forward.current)} − {formatDollar(forward.original)}) ÷{' '}
            {formatDollar(forward.original)} = {formatDollar(forward.diff, true)} ÷ {formatDollar(forward.original)} ={' '}
            <strong>{formatPct(forward.pctChange, true)}</strong>
          </div>
        </div>

        {/* Return Trip */}
        <div className="p-4 rounded-xl bg-[#FAF8F3] border-2 border-slate-800 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-bold text-slate-800">
              Trip 2 (Return): Start {formatDollar(reverse.original)} → End {formatDollar(reverse.current)}
            </span>
            <span
              className={`tabular-math text-base font-bold px-3 py-1 rounded-lg border-2 border-slate-800 inline-flex items-center gap-1 ${
                reverse.diff > 0
                  ? 'bg-emerald-500 text-white'
                  : reverse.diff < 0
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-200 text-slate-800'
              }`}
            >
              {reverse.diff > 0 && <ArrowUp className="w-4 h-4" />}
              {reverse.diff < 0 && <ArrowDown className="w-4 h-4" />}
              {formatPct(reverse.pctChange, true)}
            </span>
          </div>
          <div className="tabular-math text-xs text-slate-700">
            New 100% anchor is {formatDollar(reverse.original)}! ({formatDollar(reverse.current)} −{' '}
            {formatDollar(reverse.original)}) ÷ {formatDollar(reverse.original)} ={' '}
            <strong>{formatPct(reverse.pctChange, true)}</strong>
          </div>
        </div>

        {showTrap && (
          <div className="bg-rose-50 border-2 border-rose-600 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>SIGN TRAP: Writing “{formatPct(forward.absPct)}” without + or −</span>
            </div>
            <p className="text-xs text-rose-900">
              Without a sign, “{formatPct(forward.absPct)}” could mean up or down! Also notice Trip 1 ({formatPct(forward.pctChange, true)}) and Trip 2 ({formatPct(reverse.pctChange, true)}) do NOT have the same size because their starting 100% anchors changed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CHAPTER 4: DOLLARS ($) VS PERCENT (%)                                      */
/* -------------------------------------------------------------------------- */
function ChapterFourStage({
  params,
  focus,
  showWrongOverlay,
}: {
  params: ChapterParams;
  focus: VisualFocus;
  showWrongOverlay: boolean;
}) {
  const pctA = roundToClean((params.sharedDollarDiff / params.itemAPrice) * 100, 1);
  const pctB = roundToClean((params.sharedDollarDiff / params.itemBPrice) * 100, 1);
  const showTrap = showWrongOverlay || focus === 'wrong-way';

  const SCALE_MAX = 225;
  const itemAWidth = (params.itemAPrice / SCALE_MAX) * 100;
  const itemBWidth = (params.itemBPrice / SCALE_MAX) * 100;
  const diffWidth = (params.sharedDollarDiff / SCALE_MAX) * 100;

  return (
    <div className="space-y-5">
      <div className="bg-white border-2 border-slate-800 rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="font-display font-bold text-base text-slate-900">
            Same {formatDollar(params.sharedDollarDiff, true)} Dollar Profit — Completely Different %!
          </h4>
          <span className="tabular-math text-xs font-bold text-emerald-700">
            True Scale: $0 to ${SCALE_MAX}
          </span>
        </div>

        {/* Ruler Scale Ticks */}
        <div className="flex justify-between text-[11px] tabular-math text-slate-400 font-semibold px-0.5">
          <span>$0</span>
          <span>$75</span>
          <span>$150</span>
          <span>$225</span>
        </div>

        {/* Item A: Small Mug */}
        <div className="p-4 rounded-xl bg-[#FAF8F3] border-2 border-slate-800 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-display font-bold text-slate-900">
              Item A: Ceramic Mug (Cost {formatDollar(params.itemAPrice)})
            </span>
            <span className="tabular-math text-sm font-bold text-emerald-700">
              Profit = ${params.sharedDollarDiff} · Profit % = +{formatPct(pctA)}
            </span>
          </div>
          <div className="relative h-10 w-full bg-white rounded-lg border border-slate-300 flex items-center overflow-hidden">
            <div className="absolute inset-y-0 left-1/3 border-l border-slate-200 pointer-events-none" />
            <div className="absolute inset-y-0 left-2/3 border-l border-slate-200 pointer-events-none" />
            <motion.div
              animate={{ width: `${itemAWidth}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              className="h-full shrink-0 min-w-0 bg-blue-600 border-r-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold tabular-math overflow-hidden whitespace-nowrap"
            >
              {itemAWidth >= 12 && <span>{formatDollar(params.itemAPrice)}</span>}
            </motion.div>
            <motion.div
              animate={{ width: `${diffWidth}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              className="h-full shrink-0 min-w-0 bg-emerald-500 border-r-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold tabular-math overflow-hidden whitespace-nowrap"
            >
              {diffWidth >= 8 && <span>+${params.sharedDollarDiff}</span>}
            </motion.div>
            <span className="tabular-math text-xs font-bold text-slate-900 bg-white/90 border border-slate-300 rounded px-1.5 py-0.5 whitespace-nowrap pointer-events-none absolute right-2">
              {formatDollar(params.itemAPrice)} + ${params.sharedDollarDiff} (+{formatPct(pctA)})
            </span>
          </div>
        </div>

        {/* Item B: Shop Bike */}
        <div className="p-4 rounded-xl bg-[#FAF8F3] border-2 border-slate-800 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-display font-bold text-slate-900">
              Item B: Shop Bicycle (Cost {formatDollar(params.itemBPrice)})
            </span>
            <span className="tabular-math text-sm font-bold text-emerald-700">
              Profit = ${params.sharedDollarDiff} · Profit % = +{formatPct(pctB)}
            </span>
          </div>
          <div className="relative h-10 w-full bg-white rounded-lg border border-slate-300 flex items-center overflow-hidden">
            <div className="absolute inset-y-0 left-1/3 border-l border-slate-200 pointer-events-none" />
            <div className="absolute inset-y-0 left-2/3 border-l border-slate-200 pointer-events-none" />
            <motion.div
              animate={{ width: `${itemBWidth}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              className="h-full shrink-0 min-w-0 bg-blue-600 border-r-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold tabular-math overflow-hidden whitespace-nowrap"
            >
              {itemBWidth >= 12 && <span>{formatDollar(params.itemBPrice)}</span>}
            </motion.div>
            <motion.div
              animate={{ width: `${diffWidth}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              className="h-full shrink-0 min-w-0 bg-emerald-500 border-r-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold tabular-math overflow-hidden whitespace-nowrap"
            >
              {diffWidth >= 8 && <span>+${params.sharedDollarDiff}</span>}
            </motion.div>
            <span className="tabular-math text-xs font-bold text-slate-900 bg-white/90 border border-slate-300 rounded px-1.5 py-0.5 whitespace-nowrap pointer-events-none absolute right-2">
              {formatDollar(params.itemBPrice)} + ${params.sharedDollarDiff} (+{formatPct(pctB)})
            </span>
          </div>
        </div>

        {showTrap && (
          <div className="bg-rose-50 border-2 border-rose-600 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>UNIT TRAP: Thinking “${params.sharedDollarDiff} Profit = {params.sharedDollarDiff}% Profit”</span>
            </div>
            <p className="text-xs text-rose-900">
              Actual Profit is measured in dollars (${params.sharedDollarDiff}). Profit % depends on the 100% Cost Price—so the same ${params.sharedDollarDiff} is{' '}
              <strong>{formatPct(pctA)}</strong> on a ${params.itemAPrice} mug but only <strong>{formatPct(pctB)}</strong> on a ${params.itemBPrice} bike!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CHAPTER 5: THE THREE PRICE TAGS (CP, MP & SP BRIDGES)                      */
/* -------------------------------------------------------------------------- */
function ChapterFiveStage({
  params,
  focus,
  showWrongOverlay,
}: {
  params: ChapterParams;
  focus: VisualFocus;
  showWrongOverlay: boolean;
}) {
  const s = analyzeShopPrices(params.costPrice, params.markedPrice, params.sellingPrice);
  const profitFocus = focus === 'bridge-profit';
  const discountFocus = focus === 'bridge-discount';
  const showTrap = showWrongOverlay || focus === 'wrong-way';

  return (
    <div className="space-y-5">
      {/* The 3 Physical Hanging Price Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        <PriceTagProp
          label="Cost Price"
          shortCode="CP"
          amount={s.costPrice}
          tone="anchor"
          isAnchor={profitFocus}
          dimmed={discountFocus}
          subtitle="What Pippa paid"
        />
        <PriceTagProp
          label="Marked Price"
          shortCode="MP"
          amount={s.markedPrice}
          tone="marked"
          isAnchor={discountFocus}
          dimmed={profitFocus}
          subtitle="Sticker price on shelf"
        />
        <PriceTagProp
          label="Selling Price"
          shortCode="SP"
          amount={s.sellingPrice}
          tone={s.isProfit ? 'profit' : s.isLoss ? 'loss' : 'selling'}
          subtitle="What customer paid"
        />
      </div>

      {/* Two Distinct Comparison Bridges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profit / Loss Bridge: CP <-> SP */}
        <div
          className={`rounded-2xl border-2 p-4 transition-opacity ${
            discountFocus ? 'opacity-45 bg-slate-50 border-slate-300' : 'bg-white border-slate-800 shadow-[0_3px_0_#1e293b]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-display font-bold text-sm text-slate-900">
              Bridge 1: {s.isLoss ? 'Loss %' : 'Profit %'} (CP ↔ SP)
            </span>
            <span className="text-[11px] font-bold text-blue-700 inline-flex items-center gap-1">
              <Anchor className="w-3 h-3" /> Base: Cost ({formatDollar(s.costPrice)})
            </span>
          </div>
          <div className="tabular-math text-lg font-bold text-slate-900 mb-1">
            {s.isProfit ? (
              <span className="text-emerald-700">
                +{formatDollar(s.absProfitDollar)} Profit → {formatPct(s.absProfitPct)}
              </span>
            ) : s.isLoss ? (
              <span className="text-rose-700">
                −{formatDollar(s.absProfitDollar)} Loss → {formatPct(s.absProfitPct)}
              </span>
            ) : (
              <span>$0 Break-Even → 0%</span>
            )}
          </div>
          <div className="tabular-math text-xs text-slate-600">
            ({formatDollar(s.absProfitDollar)} ÷ CP {formatDollar(s.costPrice)}) × 100%
          </div>
        </div>

        {/* Discount Bridge: MP <-> SP */}
        <div
          className={`rounded-2xl border-2 p-4 transition-opacity ${
            profitFocus ? 'opacity-45 bg-slate-50 border-slate-300' : 'bg-white border-slate-800 shadow-[0_3px_0_#1e293b]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-display font-bold text-sm text-slate-900">Bridge 2: Discount % (MP ↔ SP)</span>
            <span className="text-[11px] font-bold text-amber-700 inline-flex items-center gap-1">
              <Scissors className="w-3 h-3" /> Base: Marked ({formatDollar(s.markedPrice)})
            </span>
          </div>
          <div className="tabular-math text-lg font-bold text-slate-900 mb-1">
            {s.isDiscount ? (
              <span className="text-amber-700">
                {formatDollar(s.discountDollar)} Off → {formatPct(s.discountPct)} Discount
              </span>
            ) : (
              <span className="text-slate-600">No Discount (0%)</span>
            )}
          </div>
          <div className="tabular-math text-xs text-slate-600">
            {s.isDiscount
              ? `(${formatDollar(s.discountDollar)} ÷ MP ${formatDollar(s.markedPrice)}) × 100%`
              : 'Selling Price is at or above Marked Price'}
          </div>
        </div>
      </div>

      {showTrap && (
        <div className="bg-rose-50 border-2 border-rose-600 rounded-xl p-4">
          <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs mb-1">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>WRONG-TAG TRAP: Dividing Profit by Marked Price (or Discount by Cost Price)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-rose-950 mt-2 tabular-math">
            <div>
              <strong>Wrong Profit %:</strong> {formatDollar(s.absProfitDollar)} ÷ MP {formatDollar(s.markedPrice)} ={' '}
              <span className="underline">{formatPct(s.wrongProfitOverMarkedPct)}</span> ❌ (True is {formatPct(s.absProfitPct)})
            </div>
            <div>
              <strong>Wrong Discount %:</strong> {formatDollar(Math.max(0, s.discountDollar))} ÷ CP {formatDollar(s.costPrice)} ={' '}
              <span className="underline">{formatPct(s.wrongDiscountOverCostPct)}</span> ❌ (True is{' '}
              {s.isDiscount ? formatPct(s.discountPct) : '0%'})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
