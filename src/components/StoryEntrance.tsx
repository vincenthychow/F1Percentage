import { useState } from 'react';
import { ArrowRight, CheckCircle2, Store } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { ChapterId } from '../types/percent';
import { CartoonCharacter } from './CartoonCharacters';

interface StoryEntranceProps {
  completedChapters: ChapterId[];
  onStartChapter: (chapterId: ChapterId) => void;
  onOpenSandbox: () => void;
}

export function StoryEntrance({
  completedChapters,
  onStartChapter,
  onOpenSandbox,
}: StoryEntranceProps) {
  const [imgError, setImgError] = useState(false);

  const nextRecommended =
    CHAPTERS.find((c) => !completedChapters.includes(c.id)) || CHAPTERS[0];

  return (
    <div className="space-y-10">
      {/* Hero Banner Split (1440px desktop balanced grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 bg-white ink-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-semibold text-blue-700">
              Grade 7 Percentages · Interactive Cartoon Story Studio
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 leading-tight text-balance">
              Master Every Percentage Trap Inside Pippa’s Shop
            </h1>
            <p className="text-base text-slate-700 leading-relaxed max-w-xl">
              Follow Pippa, Felix, and Ollie step by step using animated 100% anchor bar models and live dollar price tags. Spot the exact moments where students divide by the wrong number, drop a minus sign, or mix up dollars and per cent.
            </p>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartChapter(nextRecommended.id)}
              className="ink-button bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <span>
                {completedChapters.length === 0
                  ? 'Start Chapter 1'
                  : `Continue: Chapter ${nextRecommended.number}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSandbox}
              className="ink-button bg-amber-300 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Open Shop Sandbox</span>
            </button>
          </div>
        </div>

        {/* Illustrated Shop Front Card */}
        <div className="lg:col-span-6 ink-card rounded-3xl overflow-hidden bg-[#F1EDE4] min-h-[280px] flex items-center justify-center">
          {!imgError ? (
            <img
              src="/src/assets/images/shop_street_banner_1795417531707.jpg"
              alt="Pippa's Percent Shop cartoon corner storefront with backpacks, mugs, and price tags"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="p-8 text-center space-y-3">
              <Store className="w-12 h-12 text-blue-700 mx-auto" />
              <div className="font-display font-bold text-xl text-slate-900">Pippa’s Percent Shop</div>
              <p className="text-sm text-slate-600">Interactive Cartoon Workshop</p>
            </div>
          )}
        </div>
      </section>

      {/* Meet the Shop Cast Strip */}
      <section className="bg-white ink-card rounded-3xl p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-slate-200 mb-5">
          <h2 className="font-display font-bold text-xl text-slate-900">Meet Your Story Guides</h2>
          <span className="text-xs text-slate-600">
            Three shop characters · Step-by-step reactions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 bg-[#FAF8F3] border-2 border-slate-800 rounded-2xl p-4">
            <CartoonCharacter speaker="pippa" mood="happy" size={88} label={false} />
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">Pippa (Shop Owner)</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Sets the Cost Price, Marked Price, and Selling Price tags on every item in the store.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#FAF8F3] border-2 border-slate-800 rounded-2xl p-4">
            <CartoonCharacter speaker="felix" mood="confused" size={88} label={false} />
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">Felix (Apprentice)</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Makes realistic Grade 7 mistakes—help him spot wrong anchors, missing signs, and unit swaps!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#FAF8F3] border-2 border-slate-800 rounded-2xl p-4">
            <CartoonCharacter speaker="ollie" mood="pointing" size={88} label={false} />
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">Ollie (Anchor Owl)</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Guards the blue 100% Anchor Ruler so you always know which number sits in the denominator.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Chapter Guided Story Trail */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            Five Story Chapters (Every Classic Trap Solved)
          </h2>
          <span className="text-xs font-semibold text-slate-600 tabular-math">
            {completedChapters.length} / {CHAPTERS.length} Chapters Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CHAPTERS.map((chap) => {
            const done = completedChapters.includes(chap.id);
            return (
              <div
                key={chap.id}
                className="bg-white ink-card rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-bold text-blue-700">
                      Chapter {chap.number} · {chap.itemEmojiLabel}
                    </span>
                    {done && (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" /> Done
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-xl text-slate-900">{chap.title}</h3>
                  <div className="text-xs font-semibold text-rose-700">{chap.misconceptionTag}</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{chap.summary}</p>
                </div>

                <button
                  onClick={() => onStartChapter(chap.id)}
                  className={`ink-button w-full py-2.5 px-4 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    done ? 'bg-emerald-50 text-emerald-950' : 'bg-[#FAF8F3] text-slate-900 hover:bg-blue-50'
                  }`}
                >
                  <span>{done ? 'Review Chapter' : 'Enter Chapter'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {/* 6th Card: Open Sandbox Shortcut */}
          <div className="bg-[#F1EDE4] ink-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-800">Freeplay Counter · All Formulas</div>
              <h3 className="font-display font-bold text-xl text-slate-900">Open Shop Sandbox</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Experiment freely with Cost Price, Marked Price, and Selling Price sliders to watch Profit %, Loss %, and Discount % live.
              </p>
            </div>
            <button
              onClick={onOpenSandbox}
              className="ink-button w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-300 text-slate-900 inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Launch Shop Sandbox</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
