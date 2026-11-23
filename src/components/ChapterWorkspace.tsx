import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { buildChapterSteps, CHAPTERS } from '../data/chapters';
import { ChapterId, ChapterMeta, ChapterParams } from '../types/percent';
import { BarModelStage } from './BarModelStage';
import { CartoonCharacter, SpeechBubble } from './CartoonCharacters';

interface ChapterWorkspaceProps {
  chapter: ChapterMeta;
  completedChapters: ChapterId[];
  solvedQuestionIds: string[];
  onSolveQuestion: (questionId: string) => void;
  onCompleteChapter: (chapterId: ChapterId) => void;
  onSelectChapter: (chapterId: ChapterId) => void;
  onOpenSandbox: () => void;
}

export function ChapterWorkspace({
  chapter,
  completedChapters,
  solvedQuestionIds,
  onSolveQuestion,
  onCompleteChapter,
  onSelectChapter,
  onOpenSandbox,
}: ChapterWorkspaceProps) {
  const [params, setParams] = useState<ChapterParams>(chapter.defaultParams);
  const [stepIndex, setStepIndex] = useState(0);
  const [showWrongOverlay, setShowWrongOverlay] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});

  // Reset stage cleanly when switching chapters
  useEffect(() => {
    setParams(chapter.defaultParams);
    setStepIndex(0);
    setShowWrongOverlay(false);
  }, [chapter]);

  const steps = buildChapterSteps(chapter.id, params, showWrongOverlay);
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];

  const allQuestionsSolved = chapter.questions.every((q) => solvedQuestionIds.includes(q.id));
  const currentChapterIdx = CHAPTERS.findIndex((c) => c.id === chapter.id);
  const nextChapter = CHAPTERS[currentChapterIdx + 1];

  const handleChoiceSelect = (questionId: string, choiceId: string, isCorrect: boolean) => {
    setSelectedChoices((prev) => ({ ...prev, [questionId]: choiceId }));
    if (isCorrect) {
      onSolveQuestion(questionId);
      // Check if this finishes all questions in the chapter
      const otherSolved = chapter.questions
        .filter((q) => q.id !== questionId)
        .every((q) => solvedQuestionIds.includes(q.id));
      if (otherSolved) {
        onCompleteChapter(chapter.id);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Chapter Switcher Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
            <span className="font-semibold text-blue-700">Chapter {chapter.number} of 5</span>
            <span aria-hidden="true">·</span>
            <span>{chapter.misconceptionTag}</span>
            {completedChapters.includes(chapter.id) && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-emerald-700">Completed</span>
              </>
            )}
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 text-balance">
            {chapter.title}
          </h1>
        </div>

        {/* Interactive Chapter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1EDE4] rounded-xl border border-slate-300">
          {CHAPTERS.map((c) => {
            const active = c.id === chapter.id;
            const done = completedChapters.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => onSelectChapter(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white'
                    : done
                      ? 'bg-white text-emerald-800 hover:bg-emerald-50'
                      : 'text-slate-700 hover:bg-white'
                }`}
              >
                {c.number}. {c.shortTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Zone Sandbox Layout (Left 65% Stage + Right 35% Control & Story Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT ZONE: Animated Shop Stage & Bar Model (7/12 ~ 60%) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#F1EDE4] ink-card rounded-3xl p-5 sm:p-6 space-y-6">
            {/* Awning Header Strip inside Stage */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-slate-800/15">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span>Item: {chapter.itemEmojiLabel}</span>
                <span aria-hidden="true">·</span>
                <span>
                  Step {stepIndex + 1} of {steps.length}
                </span>
              </div>

              <button
                onClick={() => setShowWrongOverlay((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  showWrongOverlay
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-slate-900 hover:bg-rose-50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{showWrongOverlay ? 'Hide Wrong-Way Trap' : 'Compare Wrong Way vs. Right Way'}</span>
              </button>
            </div>

            {/* Cartoon Cast Reacting on Shop Floor */}
            <div className="flex items-end justify-around gap-4 py-2 px-4 bg-[#FAF8F3] rounded-2xl border-2 border-slate-800">
              <CartoonCharacter
                speaker={currentStep.speaker}
                mood={currentStep.mood}
                size={112}
              />
              {currentStep.secondarySpeaker && (
                <CartoonCharacter
                  speaker={currentStep.secondarySpeaker}
                  mood={currentStep.secondaryMood || 'happy'}
                  size={102}
                />
              )}
            </div>

            {/* Interactive Bar Model & Price Tags */}
            <BarModelStage
              chapterId={chapter.id}
              params={params}
              focus={currentStep.focus}
              showWrongOverlay={showWrongOverlay}
              stepIndex={stepIndex}
            />
          </div>
        </div>

        {/* RIGHT ZONE: Speech Narration, Step Controls & Live Sliders (5/12 ~ 40%) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Character Speech Bubble */}
          <SpeechBubble
            speaker={currentStep.speaker}
            title={currentStep.title}
            speech={currentStep.speech}
            tip={currentStep.tip}
            formula={currentStep.formula}
          />

          {/* Step-by-Step Navigation Controls */}
          <div className="bg-white ink-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">Step-by-Step Guide</span>
              <div className="flex items-center gap-1">
                {steps.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setStepIndex(idx)}
                    aria-label={`Go to step ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === stepIndex ? 'w-7 bg-blue-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                disabled={stepIndex === 0}
                className="ink-button bg-white px-3 py-2 rounded-xl text-xs font-bold text-slate-900 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={() => {
                  setStepIndex(0);
                  setParams(chapter.defaultParams);
                  setShowWrongOverlay(false);
                }}
                className="ink-button bg-white px-3 py-2 rounded-xl text-xs font-bold text-slate-700 inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
                disabled={stepIndex >= steps.length - 1}
                className="ink-button bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40 inline-flex items-center gap-1 ml-auto cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Whole-Number Sliders */}
          <div className="bg-white ink-card rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-base text-slate-900">Try Your Own Numbers ($)</h4>
              <span className="text-xs text-slate-500">Live updates above</span>
            </div>

            <ChapterSliders chapterId={chapter.id} params={params} onChange={setParams} />
          </div>
        </div>
      </div>

      {/* Bottom Section: "Help Felix Fix His Mistake!" Interactive Check */}
      <section className="bg-white ink-card rounded-3xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900">
              Help Felix Fix His Mistake!
            </h2>
            <p className="text-sm text-slate-600">
              Solve both quick checks to mark Chapter {chapter.number} complete.
            </p>
          </div>
          <div className="text-xs font-bold text-slate-700 tabular-math">
            {chapter.questions.filter((q) => solvedQuestionIds.includes(q.id)).length} / {chapter.questions.length} Solved
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapter.questions.map((q, qIdx) => {
            const chosenId = selectedChoices[q.id];
            const chosenObj = q.choices.find((c) => c.id === chosenId);
            const isSolved = solvedQuestionIds.includes(q.id);

            return (
              <div key={q.id} className="bg-[#FAF8F3] border-2 border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Check {qIdx + 1}</span>
                  {isSolved && (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> Fixed!
                    </span>
                  )}
                </div>
                <p className="font-display font-bold text-base text-slate-900">{q.prompt}</p>
                <p className="text-xs text-slate-600">{q.contextLine}</p>

                <div className="space-y-2 pt-1">
                  {q.choices.map((choice) => {
                    const isPicked = chosenId === choice.id;
                    let btnStyle = 'bg-white hover:bg-blue-50 border-slate-800 text-slate-900';
                    if (isPicked && choice.isCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-700 text-emerald-950';
                    } else if (isPicked && !choice.isCorrect) {
                      btnStyle = 'bg-rose-100 border-rose-600 text-rose-950';
                    }

                    return (
                      <button
                        key={choice.id}
                        onClick={() => handleChoiceSelect(q.id, choice.id, choice.isCorrect)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border-2 transition-colors cursor-pointer ${btnStyle}`}
                      >
                        <div className="font-bold text-sm tabular-math">{choice.label}</div>
                        {choice.sublabel && <div className="text-xs opacity-80">{choice.sublabel}</div>}
                      </button>
                    );
                  })}
                </div>

                {chosenObj && (
                  <div
                    className={`rounded-xl p-3 text-xs leading-relaxed border ${
                      chosenObj.isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                        : 'bg-rose-50 border-rose-400 text-rose-950'
                    }`}
                  >
                    <strong>{chosenObj.isCorrect ? 'Ollie says: ' : 'Watch the trap: '}</strong>
                    {chosenObj.feedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Chapter / Sandbox Footer Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200">
          <span className="text-xs text-slate-600">
            {allQuestionsSolved
              ? `Great job! Chapter ${chapter.number} is checked off.`
              : 'Tip: Try dragging the sliders above before answering.'}
          </span>

          {nextChapter ? (
            <button
              onClick={() => onSelectChapter(nextChapter.id)}
              className="ink-button bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Chapter {nextChapter.number} ({nextChapter.shortTitle})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenSandbox}
              className="ink-button bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Open Full Shop Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PER-CHAPTER WHOLE-DOLLAR SLIDERS                                           */
/* -------------------------------------------------------------------------- */
function ChapterSliders({
  chapterId,
  params,
  onChange,
}: {
  chapterId: ChapterId;
  params: ChapterParams;
  onChange: (next: ChapterParams) => void;
}) {
  if (chapterId === 'base-anchor' || chapterId === 'signed-change') {
    return (
      <div className="space-y-4">
        <SliderRow
          label="Original Price (100% Anchor)"
          valueText={`$${params.originalPrice}`}
          value={params.originalPrice}
          min={10}
          max={100}
          step={5}
          onChange={(val) => onChange({ ...params, originalPrice: val })}
        />
        <SliderRow
          label="New Price"
          valueText={`$${params.newPrice}`}
          value={params.newPrice}
          min={10}
          max={150}
          step={5}
          onChange={(val) => onChange({ ...params, newPrice: val })}
        />
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: '$40 → $50 (+25%)', orig: 40, next: 50 },
            { label: '$50 → $40 (−20%)', orig: 50, next: 40 },
            { label: '$80 → $100 (+25%)', orig: 80, next: 100 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => onChange({ ...params, originalPrice: preset.orig, newPrice: preset.next })}
              className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] border border-slate-300 text-xs font-semibold text-slate-800 hover:bg-blue-50 cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (chapterId === 'reverse-percent') {
    const cleanPresets = [
      { label: '$60 after +20%', newP: 60, pct: 20 },
      { label: '$100 after +25%', newP: 100, pct: 25 },
      { label: '$55 after +10%', newP: 55, pct: 10 },
      { label: '$90 after +50%', newP: 90, pct: 50 },
    ];
    return (
      <div className="space-y-4">
        <SliderRow
          label="New Price (After Increase)"
          valueText={`$${params.reverseNewPrice}`}
          value={params.reverseNewPrice}
          min={30}
          max={180}
          step={5}
          onChange={(val) => onChange({ ...params, reverseNewPrice: val })}
        />
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Increase % Applied</span>
            <span className="tabular-math font-bold text-emerald-700">+{params.reverseIncreasePct}%</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 25, 50].map((pct) => (
              <button
                key={pct}
                onClick={() => onChange({ ...params, reverseIncreasePct: pct })}
                className={`py-1.5 rounded-lg text-xs font-bold border-2 cursor-pointer ${
                  params.reverseIncreasePct === pct
                    ? 'bg-blue-600 text-white border-slate-900'
                    : 'bg-[#FAF8F3] text-slate-800 border-slate-300 hover:bg-slate-100'
                }`}
              >
                +{pct}%
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {cleanPresets.map((p) => (
            <button
              key={p.label}
              onClick={() => onChange({ ...params, reverseNewPrice: p.newP, reverseIncreasePct: p.pct })}
              className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] border border-slate-300 text-xs font-semibold text-slate-800 hover:bg-blue-50 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (chapterId === 'dollars-vs-percent') {
    return (
      <div className="space-y-4">
        <SliderRow
          label="Shared Dollar Change ($)"
          valueText={`$${params.sharedDollarDiff}`}
          value={params.sharedDollarDiff}
          min={2}
          max={25}
          step={1}
          onChange={(val) => onChange({ ...params, sharedDollarDiff: val })}
        />
        <SliderRow
          label="Small Item Cost (Mug)"
          valueText={`$${params.itemAPrice}`}
          value={params.itemAPrice}
          min={10}
          max={50}
          step={5}
          onChange={(val) => onChange({ ...params, itemAPrice: val })}
        />
        <SliderRow
          label="Big Item Cost (Bike)"
          valueText={`$${params.itemBPrice}`}
          value={params.itemBPrice}
          min={50}
          max={200}
          step={10}
          onChange={(val) => onChange({ ...params, itemBPrice: val })}
        />
      </div>
    );
  }

  // Chapter 5: shop-price-tags
  return (
    <div className="space-y-4">
      <SliderRow
        label="Cost Price (CP)"
        valueText={`$${params.costPrice}`}
        value={params.costPrice}
        min={20}
        max={160}
        step={5}
        onChange={(val) => onChange({ ...params, costPrice: val })}
      />
      <SliderRow
        label="Marked Price (MP)"
        valueText={`$${params.markedPrice}`}
        value={params.markedPrice}
        min={20}
        max={200}
        step={5}
        onChange={(val) => onChange({ ...params, markedPrice: val })}
      />
      <SliderRow
        label="Selling Price (SP)"
        valueText={`$${params.sellingPrice}`}
        value={params.sellingPrice}
        min={20}
        max={200}
        step={2}
        onChange={(val) => onChange({ ...params, sellingPrice: val })}
      />
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: 'CP $80 · MP $120 · SP $96', cp: 80, mp: 120, sp: 96 },
          { label: 'CP $40 · MP $60 · SP $48', cp: 40, mp: 60, sp: 48 },
          { label: 'Clearance Loss: CP $100 · MP $120 · SP $80', cp: 100, mp: 120, sp: 80 },
        ].map((p) => (
          <button
            key={p.label}
            onClick={() => onChange({ ...params, costPrice: p.cp, markedPrice: p.mp, sellingPrice: p.sp })}
            className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] border border-slate-300 text-xs font-semibold text-slate-800 hover:bg-blue-50 cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SliderRow({
  label,
  valueText,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  valueText: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
        <span>{label}</span>
        <span className="tabular-math font-bold text-slate-900 text-sm">{valueText}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full shop-slider"
      />
    </div>
  );
}
