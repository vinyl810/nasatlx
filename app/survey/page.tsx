"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";
import questionsData from "@/data/config/questions.json";

interface Question {
  id: string;
  title: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
}

const questions: Question[] = questionsData as Question[];

export default function SurveyPage() {
  const router = useRouter();
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSliderChange = (questionId: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const isAllComplete = questions.every((q) => responses[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!isAllComplete) {
      alert("모든 항목에 응답해 주세요.");
      return;
    }

    const confirmSubmit = window.confirm(
      "설문을 제출하시겠습니까?\n제출 후에는 수정할 수 없습니다."
    );
    if (!confirmSubmit) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responses),
      });

      if (res.ok) {
        router.push("/thank-you");
      } else {
        alert("오류: 설문 제출에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("네트워크 오류: 설문 제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-shrink-0 w-full p-6 glass-panel border-b border-white/20">
        <h1 className="text-2xl font-bold text-white text-center mb-2 drop-shadow-lg">
          NASA-TLX 설문
        </h1>
        <p className="text-sm text-white/90 text-center drop-shadow-sm">
          각 항목에 대해 슬라이더를 움직여 1~100 사이의 값을 선택해 주세요.
        </p>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="space-y-4 p-6 glass-panel shadow-lg">
            <div>
              <h2 className="text-lg font-bold text-white mb-2 drop-shadow-md">{q.title}</h2>
              <p className="text-sm text-white/90 leading-relaxed drop-shadow-sm">{q.description}</p>
            </div>

            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center gap-4 text-sm font-semibold text-white/90 mb-3">
                <span className="drop-shadow-sm">{q.leftLabel}</span>
                <span className="drop-shadow-sm">{q.rightLabel}</span>
              </div>

              <div className="px-1 relative z-10">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={responses[q.id] !== undefined ? responses[q.id] : 50}
                  onChange={(e) => handleSliderChange(q.id, Number(e.target.value))}
                  className="glass-slider"
                />
              </div>

              {/* Tick marks */}
              <div className="mt-1 relative z-0" style={{ paddingLeft: '9px', paddingRight: '5px' }}>
                <div className="relative h-4" style={{ width: 'calc(100% - 6px)' }}>
                  {Array.from({ length: 21 }, (_, i) => i * 5).map((tick) => (
                    <div
                      key={tick}
                      className="absolute w-0.5 bg-white/60"
                      style={{ left: `${tick}%`, height: '27px', transform: 'translateY(-20px)' }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 p-6 border-t border-white/20 glass-panel">
        <button
          onClick={handleSubmit}
          disabled={!isAllComplete || isSubmitting}
          className="glass-button w-full py-4 px-6 text-lg flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              제출 중...
            </>
          ) : (
            <>
              설문 제출하기
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
        {!isAllComplete && (
          <p className="text-sm text-white/90 text-center mt-2 drop-shadow-sm">
            모든 항목에 응답해 주세요.
          </p>
        )}
      </div>
    </div>
  );
}
