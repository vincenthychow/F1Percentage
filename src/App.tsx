import { useEffect, useState } from 'react';
import { ChapterWorkspace } from './components/ChapterWorkspace';
import { ShopSandbox } from './components/ShopSandbox';
import { StoryEntrance } from './components/StoryEntrance';
import { CHAPTERS, getChapterById } from './data/chapters';
import { ChapterId, StudentProgress } from './types/percent';

type ViewMode = 'entrance' | 'chapter' | 'sandbox';

const STORAGE_KEY = 'pippas-percent-shop-progress-v1';

const EMPTY_PROGRESS: StudentProgress = {
  completedChapters: [],
  solvedQuestionIds: [],
};

function loadProgress(): StudentProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;
    return {
      completedChapters: Array.isArray(parsed.completedChapters) ? parsed.completedChapters : [],
      solvedQuestionIds: Array.isArray(parsed.solvedQuestionIds) ? parsed.solvedQuestionIds : [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export default function App() {
  const [view, setView] = useState<ViewMode>('entrance');
  const [activeChapterId, setActiveChapterId] = useState<ChapterId>('base-anchor');
  const [progress, setProgress] = useState<StudentProgress>(() => loadProgress());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const openChapter = (id: ChapterId) => {
    setActiveChapterId(id);
    setView('chapter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSolveQuestion = (questionId: string) => {
    setProgress((prev) => {
      if (prev.solvedQuestionIds.includes(questionId)) return prev;
      return { ...prev, solvedQuestionIds: [...prev.solvedQuestionIds, questionId] };
    });
  };

  const handleCompleteChapter = (chapterId: ChapterId) => {
    setProgress((prev) => {
      if (prev.completedChapters.includes(chapterId)) return prev;
      return { ...prev, completedChapters: [...prev.completedChapters, chapterId] };
    });
  };

  const handleResetProgress = () => {
    setProgress(EMPTY_PROGRESS);
  };

  const activeChapter = getChapterById(activeChapterId);
  const nextChapter = CHAPTERS.find((c) => !progress.completedChapters.includes(c.id)) || CHAPTERS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#1E293B]">
      {/* Top Bar Contract: Exactly 3 Zones separated by gap-8 */}
      <header className="bg-white border-b-2 border-slate-800 relative z-30">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setView('entrance')}
            className="font-display font-bold text-xl tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer hover:text-blue-700 transition-colors"
          >
            Pippa’s Percent Shop
          </button>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => setView('entrance')}
              className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:text-slate-900 ${
                view === 'entrance' ? 'text-blue-700 underline underline-offset-4' : ''
              }`}
            >
              Story Map
            </button>
            <button
              onClick={() => openChapter(activeChapterId)}
              className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:text-slate-900 ${
                view === 'chapter' ? 'text-blue-700 underline underline-offset-4' : ''
              }`}
            >
              Chapters
            </button>
            <button
              onClick={() => setView('sandbox')}
              className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:text-slate-900 ${
                view === 'sandbox' ? 'text-blue-700 underline underline-offset-4' : ''
              }`}
            >
              Shop Sandbox
            </button>
            <button
              onClick={handleResetProgress}
              className="whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:text-slate-900"
            >
              Reset Progress ({progress.completedChapters.length}/5)
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA button */}
          <div className="shrink-0">
            {view === 'sandbox' ? (
              <button
                onClick={() => openChapter(nextChapter.id)}
                className="ink-button bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
              >
                Continue Story
              </button>
            ) : (
              <button
                onClick={() => setView('sandbox')}
                className="ink-button bg-amber-300 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open Sandbox
              </button>
            )}
          </div>
        </div>

        {/* Compact mobile navigation row only on small viewports */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">
          <button onClick={() => setView('entrance')} className="whitespace-nowrap cursor-pointer">
            Story Map
          </button>
          <button onClick={() => openChapter(activeChapterId)} className="whitespace-nowrap cursor-pointer">
            Chapters
          </button>
          <button onClick={() => setView('sandbox')} className="whitespace-nowrap cursor-pointer">
            Sandbox
          </button>
        </div>
      </header>

      {/* Main Content Container (1440px-comfortable max-w-7xl) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {view === 'entrance' && (
          <StoryEntrance
            completedChapters={progress.completedChapters}
            onStartChapter={openChapter}
            onOpenSandbox={() => setView('sandbox')}
          />
        )}

        {view === 'chapter' && (
          <ChapterWorkspace
            chapter={activeChapter}
            completedChapters={progress.completedChapters}
            solvedQuestionIds={progress.solvedQuestionIds}
            onSolveQuestion={handleSolveQuestion}
            onCompleteChapter={handleCompleteChapter}
            onSelectChapter={openChapter}
            onOpenSandbox={() => setView('sandbox')}
          />
        )}

        {view === 'sandbox' && <ShopSandbox />}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>Pippa’s Percent Shop · Grade 7 Percentages Learning Studio</span>
          <span>
            Concepts: Increase · Decrease · Reverse % · Signed Change · Profit, Loss & Discount
          </span>
        </div>
      </footer>
    </div>
  );
}
