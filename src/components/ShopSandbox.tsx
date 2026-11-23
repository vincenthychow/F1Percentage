import { useState } from 'react';
import { AlertTriangle, Anchor, ArrowDown, ArrowUp, RotateCcw, Scissors } from 'lucide-react';
import { motion } from 'motion/react';
import { analyzeShopPrices, formatDollar, formatPct } from '../utils/percentMath';
import { CartoonCharacter } from './CartoonCharacters';
import { PriceTagProp } from './PriceTagProp';

type SandboxFocus = 'all' | 'profit-loss' | 'discount';

interface ShopPreset {
  name: string;
  cp: number;
  mp: number;
  sp: number;
}

const SHOP_PRESETS: ShopPreset[] = [
  { name: 'Canvas Backpack', cp: 80, mp: 120, sp: 96 },
  { name: 'Denim Jacket', cp: 50, mp: 80, sp: 60 },
  { name: 'Ceramic Mug', cp: 20, mp: 40, sp: 30 },
  { name: 'Shop Skateboard', cp: 100, mp: 150, sp: 120 },
  { name: 'Clearance Loss', cp: 100, mp: 120, sp: 80 },
];

export function ShopSandbox() {
  const [itemName, setItemName] = useState('Canvas Backpack');
  const [costPrice, setCostPrice] = useState(80);
  const [markedPrice, setMarkedPrice] = useState(120);
  const [sellingPrice, setSellingPrice] = useState(96);
  const [focus, setFocus] = useState<SandboxFocus>('all');
  const [showMistakeWatch, setShowMistakeWatch] = useState(false);

  const s = analyzeShopPrices(costPrice, markedPrice, sellingPrice);

  // Dynamic character mood & reaction
  const pippaMood = s.isProfit ? 'aha' : s.isLoss ? 'warning' : 'happy';
  const felixMood = showMistakeWatch ? 'confused' : s.isProfit ? 'happy' : 'confused';
  const ollieMood = focus === 'all' ? 'pointing' : 'aha';

  const maxBar = 240;

  return (
    <div className="space-y-8">
      {/* Header Row */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-700 mb-1">
            Interactive Counter · Whole-Dollar Sandbox
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 text-balance">
            Pippa’s Open Shop Counter
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Drag any price tag below to test how Profit %, Loss %, Discount %, and Signed Change react in real time.
          </p>
        </div>

        {/* Focus Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#F1EDE4] rounded-xl border border-slate-300">
          {[
            { id: 'all', label: 'All Bridges' },
            { id: 'profit-loss', label: 'Profit / Loss (CP ↔ SP)' },
            { id: 'discount', label: 'Discount (MP ↔ SP)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFocus(tab.id as SandboxFocus)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                focus === tab.id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Zone Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT STAGE (7/12) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#F1EDE4] ink-card rounded-3xl p-5 sm:p-6 space-y-6">
            {/* Stage Subheader */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-slate-800/15">
              <span className="font-display font-bold text-base text-slate-900">
                Active Shelf Item: {itemName}
              </span>

              <button
                onClick={() => setShowMistakeWatch((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-slate-800 cursor-pointer whitespace-nowrap shrink-0 ${
                  showMistakeWatch ? 'bg-rose-600 text-white' : 'bg-white text-slate-900 hover:bg-rose-50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{showMistakeWatch ? 'Hide Mistake Traps' : 'Show Common Mistakes'}</span>
              </button>
            </div>

            {/* Cast Reaction Strip */}
            <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-[#FAF8F3] rounded-2xl border-2 border-slate-800 items-end">
              <CartoonCharacter speaker="pippa" mood={pippaMood} size={96} />
              <CartoonCharacter speaker="felix" mood={felixMood} size={96} />
              <CartoonCharacter speaker="ollie" mood={ollieMood} size={96} />
            </div>

            {/* Three Physical Price Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PriceTagProp
                label="Cost Price"
                shortCode="CP"
                amount={costPrice}
                tone="anchor"
                isAnchor={focus === 'profit-loss'}
                dimmed={focus === 'discount'}
                subtitle="Shop paid"
              />
              <PriceTagProp
                label="Marked Price"
                shortCode="MP"
                amount={markedPrice}
                tone="marked"
                isAnchor={focus === 'discount'}
                dimmed={focus === 'profit-loss'}
                subtitle="Shelf tag"
              />
              <PriceTagProp
                label="Selling Price"
                shortCode="SP"
                amount={sellingPrice}
                tone={s.isProfit ? 'profit' : s.isLoss ? 'loss' : 'selling'}
                subtitle="Customer paid"
              />
            </div>

            {/* Proportional Bar Comparison */}
            <div className="bg-white border-2 border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Live Price Bars (True $ Scale)</span>
                <span className="tabular-math text-slate-500">$0 to {formatDollar(maxBar)}</span>
              </div>
              <div className="flex justify-between text-[11px] tabular-math text-slate-400 font-semibold">
                <span>$0</span>
                <span>$60</span>
                <span>$120</span>
                <span>$180</span>
                <span>$240</span>
              </div>

              <BarRow
                label="Cost Price (CP)"
                amount={costPrice}
                max={maxBar}
                barColor="bg-blue-600"
                dimmed={focus === 'discount'}
                rightNote="100% Base for Profit/Loss"
              />
              <BarRow
                label="Marked Price (MP)"
                amount={markedPrice}
                max={maxBar}
                barColor="bg-amber-400 text-slate-950"
                dimmed={focus === 'profit-loss'}
                rightNote="100% Base for Discount"
              />
              <BarRow
                label="Selling Price (SP)"
                amount={sellingPrice}
                max={maxBar}
                barColor={s.isProfit ? 'bg-emerald-500' : s.isLoss ? 'bg-rose-600' : 'bg-slate-700'}
                dimmed={false}
                rightNote={`Signed vs CP: ${formatPct(s.profitPct, true)}`}
              />
            </div>

            {/* Live Math Readouts: $ vs % Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`rounded-2xl border-2 p-4 bg-white transition-opacity ${
                  focus === 'discount' ? 'opacity-45 border-slate-300' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-blue-700 inline-flex items-center gap-1">
                    <Anchor className="w-3.5 h-3.5" /> Profit / Loss (Base = CP)
                  </span>
                  <span className="tabular-math text-xs font-semibold text-slate-500">CP ↔ SP</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-slate-600">Actual Amount ($):</span>
                  <span
                    className={`tabular-math text-lg font-bold ${
                      s.isProfit ? 'text-emerald-700' : s.isLoss ? 'text-rose-700' : 'text-slate-800'
                    }`}
                  >
                    {s.isProfit ? `+${formatDollar(s.absProfitDollar)} Profit` : s.isLoss ? `−${formatDollar(s.absProfitDollar)} Loss` : '$0 Break-Even'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-1">
                  <span className="text-xs text-slate-600">Signed Rate (%):</span>
                  <span
                    className={`tabular-math text-lg font-bold inline-flex items-center gap-1 ${
                      s.isProfit ? 'text-emerald-700' : s.isLoss ? 'text-rose-700' : 'text-slate-800'
                    }`}
                  >
                    {s.isProfit && <ArrowUp className="w-4 h-4" />}
                    {s.isLoss && <ArrowDown className="w-4 h-4" />}
                    {formatPct(s.profitPct, true)}
                  </span>
                </div>
                <div className="tabular-math text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  ({formatDollar(s.profitDollar, true)} ÷ CP {formatDollar(s.costPrice)}) × 100%
                </div>
              </div>

              <div
                className={`rounded-2xl border-2 p-4 bg-white transition-opacity ${
                  focus === 'profit-loss' ? 'opacity-45 border-slate-300' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-amber-700 inline-flex items-center gap-1">
                    <Scissors className="w-3.5 h-3.5" /> Discount (Base = MP)
                  </span>
                  <span className="tabular-math text-xs font-semibold text-slate-500">MP ↔ SP</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-slate-600">Actual Discount ($):</span>
                  <span className="tabular-math text-lg font-bold text-amber-800">
                    {s.isDiscount ? `${formatDollar(s.discountDollar)} Off` : '$0 Off'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-1">
                  <span className="text-xs text-slate-600">Discount Rate (%):</span>
                  <span className="tabular-math text-lg font-bold text-amber-800">
                    {s.isDiscount ? `${formatPct(s.discountPct)} Discount` : '0% Discount'}
                  </span>
                </div>
                <div className="tabular-math text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  {s.isDiscount
                    ? `(${formatDollar(s.discountDollar)} ÷ MP ${formatDollar(s.markedPrice)}) × 100%`
                    : 'No markdown from Marked Price'}
                </div>
              </div>
            </div>

            {/* Mistake Watch Panel */}
            {showMistakeWatch && (
              <div className="bg-rose-50 border-2 border-rose-600 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>WATCH OUT FOR THESE 3 TRAPS WITH YOUR CURRENT NUMBERS</span>
                </div>
                <ul className="text-xs text-rose-950 space-y-1.5 tabular-math">
                  <li>
                    • <strong>Wrong New-Value Base:</strong> Dividing profit ({formatDollar(s.absProfitDollar)}) by Selling Price ({formatDollar(s.sellingPrice)}) gives{' '}
                    <strong>{formatPct(s.wrongProfitOverSellingPct)}</strong> ❌ (True is {formatPct(s.absProfitPct)}).
                  </li>
                  <li>
                    • <strong>Wrong Marked-Tag Base for Profit:</strong> Dividing profit ({formatDollar(s.absProfitDollar)}) by Marked Price ({formatDollar(s.markedPrice)}) gives{' '}
                    <strong>{formatPct(s.wrongProfitOverMarkedPct)}</strong> ❌.
                  </li>
                  <li>
                    • <strong>Wrong Cost-Tag Base for Discount:</strong> Dividing discount ({formatDollar(Math.max(0, s.discountDollar))}) by Cost Price ({formatDollar(s.costPrice)}) gives{' '}
                    <strong>{formatPct(s.wrongDiscountOverCostPct)}</strong> ❌ (True Discount is {s.isDiscount ? formatPct(s.discountPct) : '0%'}).
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CONTROLS (5/12) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Presets Card */}
          <div className="bg-white ink-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900">Quick Shop Items</h3>
              <button
                onClick={() => {
                  setItemName('Canvas Backpack');
                  setCostPrice(80);
                  setMarkedPrice(120);
                  setSellingPrice(96);
                }}
                className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SHOP_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setItemName(p.name);
                    setCostPrice(p.cp);
                    setMarkedPrice(p.mp);
                    setSellingPrice(p.sp);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 cursor-pointer transition-colors ${
                    itemName === p.name
                      ? 'bg-blue-600 text-white border-slate-900'
                      : 'bg-[#FAF8F3] text-slate-800 border-slate-300 hover:bg-blue-50'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Price Tag Sliders */}
          <div className="bg-white ink-card rounded-2xl p-5 space-y-5">
            <h3 className="font-display font-bold text-base text-slate-900">Adjust Shop Price Tags ($)</h3>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-blue-800">Cost Price (CP — what Pippa paid)</span>
                <span className="tabular-math text-sm text-slate-900">{formatDollar(costPrice)}</span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full shop-slider"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-amber-800">Marked Price (MP — sticker tag)</span>
                <span className="tabular-math text-sm text-slate-900">{formatDollar(markedPrice)}</span>
              </div>
              <input
                type="range"
                min={10}
                max={240}
                step={5}
                value={markedPrice}
                onChange={(e) => setMarkedPrice(Number(e.target.value))}
                className="w-full shop-slider"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-800">Selling Price (SP — customer paid)</span>
                <span className="tabular-math text-sm text-slate-900">{formatDollar(sellingPrice)}</span>
              </div>
              <input
                type="range"
                min={10}
                max={240}
                step={2}
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full shop-slider"
              />
            </div>
          </div>

          {/* Ollie's Quick Reference Card */}
          <div className="bg-[#FAF8F3] border-2 border-slate-800 rounded-2xl p-5 space-y-2.5">
            <h4 className="font-display font-bold text-base text-slate-900">Ollie’s Two-Bridge Cheat Sheet</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>1. Profit or Loss %:</strong> Always compare <strong>Cost Price (100%)</strong> to Selling Price. Ignore the Marked Price tag!
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>2. Discount %:</strong> Always compare <strong>Marked Price (100%)</strong> to Selling Price. Ignore the Cost Price!
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>3. Dollars vs. Percent:</strong> Profit ($), Loss ($), and Discount ($) are cash amounts. Profit %, Loss %, and Discount % divide that cash by the 100% anchor!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BarRow({
  label,
  amount,
  max,
  barColor,
  dimmed,
  rightNote,
}: {
  label: string;
  amount: number;
  max: number;
  barColor: string;
  dimmed: boolean;
  rightNote: string;
}) {
  const pct = (amount / max) * 100;
  return (
    <div className={`space-y-1 transition-opacity ${dimmed ? 'opacity-35' : 'opacity-100'}`}>
      <div className="flex justify-between text-xs">
        <span className="font-semibold text-slate-800">{label}</span>
        <span className="text-[11px] text-slate-500">{rightNote}</span>
      </div>
      <div className="relative h-8 w-full bg-slate-100 rounded-lg border border-slate-300 flex items-center overflow-hidden">
        <div className="absolute inset-y-0 left-1/4 border-l border-slate-200 pointer-events-none" />
        <div className="absolute inset-y-0 left-1/2 border-l border-slate-200 pointer-events-none" />
        <div className="absolute inset-y-0 left-3/4 border-l border-slate-200 pointer-events-none" />
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className={`h-full shrink-0 min-w-0 border-r border-slate-900 flex items-center justify-center text-xs font-bold tabular-math text-white overflow-hidden whitespace-nowrap ${barColor}`}
        >
          {pct >= 12 && <span>{formatDollar(amount)}</span>}
        </motion.div>
        <span className="tabular-math text-xs font-bold text-slate-900 bg-white/90 border border-slate-300 rounded px-1.5 py-0.5 whitespace-nowrap pointer-events-none absolute right-2">
          {formatDollar(amount)}
        </span>
      </div>
    </div>
  );
}
