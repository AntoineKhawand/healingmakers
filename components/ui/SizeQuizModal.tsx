"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Check, Ruler, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSizeQuizStore } from "@/lib/store/sizeQuizStore";

// ─── Real size data ────────────────────────────────────────────────────────────

const ADULT_CHART: Record<string, { chest: number; length: number; sleeve: number }> = {
  S:    { chest: 90,  length: 67, sleeve: 59 },
  M:    { chest: 96,  length: 69, sleeve: 61 },
  L:    { chest: 102, length: 71, sleeve: 63 },
  XL:   { chest: 108, length: 73, sleeve: 65 },
  XXL:  { chest: 114, length: 75, sleeve: 67 },
  XXXL: { chest: 120, length: 77, sleeve: 69 },
};

const KIDS_CHART: Record<string, { age: string; height: string; chest: number }> = {
  "4Y":  { age: "3–4 years",   height: "98–104",  chest: 56 },
  "6Y":  { age: "5–6 years",   height: "110–116", chest: 60 },
  "8Y":  { age: "7–8 years",   height: "122–128", chest: 64 },
  "10Y": { age: "9–10 years",  height: "134–140", chest: 68 },
  "12Y": { age: "11–12 years", height: "146–152", chest: 72 },
  "14Y": { age: "13–14 years", height: "158–164", chest: 76 },
  "16Y": { age: "15–16 years", height: "164–170", chest: 80 },
};

const ADULT_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"] as const;
const KIDS_SIZES  = ["4Y", "6Y", "8Y", "10Y", "12Y", "14Y", "16Y"] as const;

const KIDS_AGES = KIDS_SIZES.map((sizeKey) => ({
  label:  KIDS_CHART[sizeKey].age,
  sizeKey,
  chest:  KIDS_CHART[sizeKey].chest,
}));

// ─── Sizing algorithm ──────────────────────────────────────────────────────────

// 2-D lookup [heightRow][weightCol] → index into ADULT_SIZES
// Rows: <155 | 155–163 | 163–170 | 170–178 | 178–185 | >185  (cm)
// Cols: <50  | 50–65   | 65–78   | 78–90   | 90–105  | >105  (kg)
const MEN_MATRIX = [
  [0, 0, 1, 1, 2, 2],
  [0, 0, 1, 1, 2, 3],
  [0, 1, 1, 2, 3, 3],
  [0, 1, 2, 2, 3, 4],
  [1, 1, 2, 3, 4, 4],
  [1, 2, 2, 3, 4, 5],
];
const WOMEN_MATRIX = MEN_MATRIX.map((row) => row.map((v) => Math.max(0, v - 1)));

const HEIGHT_OPTIONS = [
  "Under 155 cm", "155–163 cm", "163–170 cm",
  "170–178 cm",   "178–185 cm", "Over 185 cm",
];
const WEIGHT_OPTIONS = [
  "Under 50 kg", "50–65 kg", "65–78 kg",
  "78–90 kg",    "90–105 kg","Over 105 kg",
];
const FIT_OPTIONS = [
  { label: "Slim",      desc: "Fitted, close to the body",        adj: -1 },
  { label: "Regular",   desc: "Comfortable, relaxed but neat",     adj:  0 },
  { label: "Oversized", desc: "Extra roomy, cozy & streetwear",    adj:  1 },
] as const;

type Gender = "men" | "women" | "kids";
type Step   = "gender" | "height" | "weight" | "fit" | "kidsAge" | "result";

function calcAdult(gender: Gender, hi: number, wi: number, fi: number): string {
  const matrix = gender === "women" ? WOMEN_MATRIX : MEN_MATRIX;
  const base   = matrix[hi][wi] + FIT_OPTIONS[fi].adj;
  const idx    = Math.max(0, Math.min(base, ADULT_SIZES.length - 1));
  return ADULT_SIZES[idx];
}

// ─── Small helpers ─────────────────────────────────────────────────────────────

function StepLabel({ idx, total }: { idx: number; total: number }) {
  return (
    <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">
      Step {idx + 1} of {total}
    </p>
  );
}

function OptionRow({ label, sub, onClick }: { label: string; sub?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between gap-3 w-full text-left px-4 py-3.5 border-2 border-sand rounded-xl text-sm text-charcoal hover:border-dusty-rose hover:text-dusty-rose hover:bg-dusty-rose/5 transition-all group"
    >
      <span>
        <span className="font-medium block leading-tight">{label}</span>
        {sub && (
          <span className="text-[11px] text-charcoal/45 group-hover:text-dusty-rose/70 mt-0.5 block">{sub}</span>
        )}
      </span>
      <ArrowRight size={13} className="text-charcoal/25 group-hover:text-dusty-rose shrink-0 transition-colors" />
    </button>
  );
}

function GridOptions({ options, onPick }: { options: string[]; onPick: (i: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onPick(i)}
          className="px-3 py-3 border-2 border-sand rounded-xl text-sm text-center font-medium text-charcoal hover:border-dusty-rose hover:text-dusty-rose hover:bg-dusty-rose/5 transition-all"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Result screens ────────────────────────────────────────────────────────────

function AdultResult({
  size, gender, fitI, onRetake, onClose,
}: {
  size: string; gender: Gender; fitI: number; onRetake: () => void; onClose: () => void;
}) {
  const m   = ADULT_CHART[size];
  const fit = FIT_OPTIONS[fitI];

  return (
    <div className="text-center py-2">
      <div className="w-20 h-20 bg-dusty-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check size={30} className="text-dusty-rose" />
      </div>
      <p className="text-charcoal/55 text-sm mb-1">Your recommended size</p>
      <p className="font-playfair text-7xl font-bold text-soft-black leading-none mb-1">{size}</p>
      <p className="text-xs text-charcoal/40 mb-6 capitalize">
        {fit.label} fit · {gender === "women" ? "Women" : "Men"}
      </p>

      <div className="bg-cream rounded-2xl p-4 mb-4 text-left">
        <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-3">Garment Measurements</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Chest",  val: `${m.chest} cm`  },
            { label: "Length", val: `${m.length} cm` },
            { label: "Sleeve", val: `${m.sleeve} cm` },
          ].map(({ label, val }) => (
            <div key={label} className="text-center bg-white rounded-xl py-2.5 px-1">
              <p className="text-xs font-bold text-soft-black">{val}</p>
              <p className="text-[10px] text-charcoal/50 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {fit.adj !== 0 && (
        <p className="text-xs text-charcoal/50 mb-4 bg-sand/40 rounded-xl px-3 py-2">
          {fit.adj === -1
            ? "Fitted cut — go up one size if you prefer a more relaxed feel."
            : "Oversized cut — go down one size for a regular fit."}
        </p>
      )}

      <p className="text-xs text-charcoal/40 mb-6">Between sizes? Size up for extra comfort.</p>

      <div className="flex gap-3">
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-1.5 border-2 border-sand text-charcoal py-3 rounded-xl text-sm font-semibold hover:border-dusty-rose hover:text-dusty-rose transition-colors"
        >
          <RotateCcw size={13} /> Retake
        </button>
        <Link
          href="/shop"
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-1.5 bg-soft-black text-white py-3 rounded-xl text-sm font-semibold hover:bg-charcoal transition-colors"
        >
          Shop Now <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

function KidsResult({ sizeKey, onRetake, onClose }: { sizeKey: string; onRetake: () => void; onClose: () => void }) {
  const m = KIDS_CHART[sizeKey];

  return (
    <div className="text-center py-2">
      <div className="w-20 h-20 bg-dusty-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check size={30} className="text-dusty-rose" />
      </div>
      <p className="text-charcoal/55 text-sm mb-1">Recommended kids size</p>
      <p className="font-playfair text-7xl font-bold text-soft-black leading-none mb-1">{sizeKey}</p>
      <p className="text-xs text-charcoal/40 mb-6">{m.age}</p>

      <div className="bg-cream rounded-2xl p-4 mb-4 text-left">
        <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-3">Size Reference</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Height", val: `${m.height} cm` },
            { label: "Chest",  val: `${m.chest} cm`  },
          ].map(({ label, val }) => (
            <div key={label} className="text-center bg-white rounded-xl py-2.5">
              <p className="text-xs font-bold text-soft-black">{val}</p>
              <p className="text-[10px] text-charcoal/50 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-charcoal/40 mb-6">If the child is growing fast, consider sizing up.</p>

      <div className="flex gap-3">
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-1.5 border-2 border-sand text-charcoal py-3 rounded-xl text-sm font-semibold hover:border-dusty-rose hover:text-dusty-rose transition-colors"
        >
          <RotateCcw size={13} /> Retake
        </button>
        <Link
          href="/shop"
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-1.5 bg-soft-black text-white py-3 rounded-xl text-sm font-semibold hover:bg-charcoal transition-colors"
        >
          Shop Now <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

// ─── Main modal ────────────────────────────────────────────────────────────────

interface QuizState {
  gender:   Gender | null;
  heightI:  number | null;
  weightI:  number | null;
  fitI:     number | null;
  kidsAgeI: number | null;
}

const INIT: QuizState = { gender: null, heightI: null, weightI: null, fitI: null, kidsAgeI: null };
const STEPS_ADULT: Step[] = ["gender", "height", "weight", "fit", "result"];
const STEPS_KIDS:  Step[] = ["gender", "kidsAge", "result"];

export default function SizeQuizModal() {
  const { isOpen, close } = useSizeQuizStore();
  const [quiz, setQuiz]   = useState<QuizState>(INIT);
  const [step, setStep]   = useState<Step>("gender");
  const [history, setHist]= useState<Step[]>([]);

  const go = (next: Step, patch: Partial<QuizState> = {}) => {
    setHist((h) => [...h, step]);
    setQuiz((q) => ({ ...q, ...patch }));
    setStep(next);
  };

  const back = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHist((h) => h.slice(0, -1));
    setStep(prev);
  };

  const reset = () => { setQuiz(INIT); setStep("gender"); setHist([]); };
  const handleClose = () => { close(); setTimeout(reset, 350); };

  const stepOrder     = quiz.gender === "kids" ? STEPS_KIDS : STEPS_ADULT;
  const questionSteps = stepOrder.filter((s) => s !== "result");
  const currentIdx    = questionSteps.indexOf(step as Exclude<Step, "result">);
  const progress      = step === "result" ? 1 : (currentIdx + 1) / (questionSteps.length + 1);

  const resultSize: string | null =
    step === "result" && quiz.gender
      ? quiz.gender === "kids"
        ? KIDS_SIZES[quiz.kidsAgeI ?? 0]
        : calcAdult(quiz.gender, quiz.heightI ?? 0, quiz.weightI ?? 0, quiz.fitI ?? 1)
      : null;

  const renderStep = () => {
    if (step === "result" && resultSize && quiz.gender) {
      return quiz.gender === "kids"
        ? <KidsResult sizeKey={resultSize} onRetake={reset} onClose={handleClose} />
        : <AdultResult size={resultSize} gender={quiz.gender} fitI={quiz.fitI ?? 1} onRetake={reset} onClose={handleClose} />;
    }

    if (step === "gender") return (
      <>
        <h3 className="font-playfair text-xl font-bold text-soft-black mb-5">Who is this for?</h3>
        <div className="flex flex-col gap-3">
          {(
            [
              { value: "men"   as Gender, emoji: "👨", label: "Men",   sub: "Sizes S – XXXL" },
              { value: "women" as Gender, emoji: "👩", label: "Women", sub: "Sizes S – XXXL" },
              { value: "kids"  as Gender, emoji: "🧒", label: "Kids",  sub: "Ages 3–16 years" },
            ]
          ).map(({ value, emoji, label, sub }) => (
            <button
              key={value}
              onClick={() => go(value === "kids" ? "kidsAge" : "height", { gender: value })}
              className="flex items-center gap-4 p-4 border-2 border-sand rounded-2xl hover:border-dusty-rose hover:bg-dusty-rose/5 transition-all text-left group"
            >
              <span className="text-3xl">{emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-soft-black group-hover:text-dusty-rose">{label}</p>
                <p className="text-xs text-charcoal/50">{sub}</p>
              </div>
              <ArrowRight size={15} className="text-charcoal/30 group-hover:text-dusty-rose transition-colors" />
            </button>
          ))}
        </div>
      </>
    );

    if (step === "height") return (
      <>
        <StepLabel idx={currentIdx} total={questionSteps.length} />
        <h3 className="font-playfair text-xl font-bold text-soft-black mb-5">What&apos;s your height?</h3>
        <GridOptions options={HEIGHT_OPTIONS} onPick={(i) => go("weight", { heightI: i })} />
      </>
    );

    if (step === "weight") return (
      <>
        <StepLabel idx={currentIdx} total={questionSteps.length} />
        <h3 className="font-playfair text-xl font-bold text-soft-black mb-5">What&apos;s your weight?</h3>
        <GridOptions options={WEIGHT_OPTIONS} onPick={(i) => go("fit", { weightI: i })} />
      </>
    );

    if (step === "fit") return (
      <>
        <StepLabel idx={currentIdx} total={questionSteps.length} />
        <h3 className="font-playfair text-xl font-bold text-soft-black mb-5">How do you like your fit?</h3>
        <div className="flex flex-col gap-2.5">
          {FIT_OPTIONS.map((opt, i) => (
            <OptionRow key={i} label={opt.label} sub={opt.desc} onClick={() => go("result", { fitI: i })} />
          ))}
        </div>
      </>
    );

    if (step === "kidsAge") return (
      <>
        <StepLabel idx={currentIdx} total={questionSteps.length} />
        <h3 className="font-playfair text-xl font-bold text-soft-black mb-5">How old are they?</h3>
        <div className="flex flex-col gap-2">
          {KIDS_AGES.map(({ label, sizeKey, chest }, i) => (
            <OptionRow
              key={i}
              label={label}
              sub={`Size ${sizeKey} · chest ${chest} cm`}
              onClick={() => go("result", { kidsAgeI: i })}
            />
          ))}
        </div>
      </>
    );

    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 16, opacity: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-sand">
              <div className="flex items-center gap-2.5">
                {history.length > 0 && step !== "result" && (
                  <button
                    onClick={back}
                    className="p-1 text-charcoal/40 hover:text-charcoal transition-colors mr-1"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                <Ruler size={17} className="text-dusty-rose" />
                <span className="font-playfair font-bold text-soft-black text-lg">Size Quiz</span>
              </div>
              <button onClick={handleClose} className="p-1.5 text-charcoal/40 hover:text-charcoal transition-colors">
                <X size={19} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="px-6 pt-4">
              <div className="h-1 bg-sand rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-dusty-rose rounded-full"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.2 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
