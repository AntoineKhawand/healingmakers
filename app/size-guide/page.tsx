"use client";

import { Ruler } from "lucide-react";
import { useSizeQuizStore } from "@/lib/store/sizeQuizStore";

const tables = [
  {
    title: "Adults (T-Shirts, Hoodies, Sweaters)",
    headers: ["Size", "Chest (cm)", "Length (cm)", "Sleeve (cm)"],
    rows: [
      ["S", "90", "67", "59"],
      ["M", "96", "69", "61"],
      ["L", "102", "71", "63"],
      ["XL", "108", "73", "65"],
      ["XXL", "114", "75", "67"],
      ["XXXL", "120", "77", "69"],
    ],
  },
  {
    title: "Kids",
    headers: ["Size", "Age", "Height (cm)", "Chest (cm)"],
    rows: [
      ["4Y", "4 years", "98–104", "56"],
      ["6Y", "6 years", "110–116", "60"],
      ["8Y", "8 years", "122–128", "64"],
      ["10Y", "10 years", "134–140", "68"],
      ["12Y", "12 years", "146–152", "72"],
      ["14Y", "14 years", "158–164", "76"],
      ["16Y", "16 years", "164–170", "80"],
    ],
  },
];

export default function SizeGuidePage() {
  const { open } = useSizeQuizStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-soft-black mb-2">Size Guide</h1>
          <p className="text-charcoal/60">All measurements are in centimeters. If you&apos;re between sizes, size up.</p>
        </div>
        <button
          onClick={open}
          className="inline-flex items-center gap-2 bg-dusty-rose text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-deep-rose transition-colors shrink-0"
        >
          <Ruler size={15} /> Take Size Quiz
        </button>
      </div>

      <div className="space-y-10">
        {tables.map((t) => (
          <div key={t.title}>
            <h2 className="font-playfair text-xl font-bold text-soft-black mb-4">{t.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-soft-black text-white">
                    {t.headers.map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-sm font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-cream" : "bg-white"}>
                      {row.map((cell, j) => (
                        <td key={j} className={`px-4 py-3 text-sm border-b border-sand ${j === 0 ? "font-semibold text-soft-black" : "text-charcoal/70"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-dusty-rose/10 rounded-2xl p-5 text-sm text-charcoal/70">
        <p className="font-semibold text-soft-black mb-2">How to Measure</p>
        <ul className="space-y-1">
          <li><strong>Chest:</strong> Measure around the fullest part of your chest, under your armpits.</li>
          <li><strong>Length:</strong> Measure from the highest point of the shoulder to the bottom hem.</li>
          <li><strong>Sleeve:</strong> Measure from the center back neck to the wrist.</li>
        </ul>
      </div>

      <div className="mt-8 bg-soft-black rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold text-sm">Not sure which size fits you?</p>
          <p className="text-white/50 text-xs mt-0.5">Answer 3 quick questions and we'll recommend your size.</p>
        </div>
        <button
          onClick={open}
          className="inline-flex items-center gap-2 bg-dusty-rose text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-deep-rose transition-colors shrink-0"
        >
          <Ruler size={15} /> Take the Quiz
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-charcoal/60">
          Still not sure?{" "}
          <a href="https://wa.me/96103786119" target="_blank" rel="noopener noreferrer" className="text-dusty-rose hover:underline">
            Ask us on WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
