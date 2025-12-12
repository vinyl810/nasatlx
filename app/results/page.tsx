"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import questionsData from "@/data/config/questions.json";

interface Question {
  id: string;
  title: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
}

interface SurveyResult {
  filename: string;
  timestamp: string;
  ip: string;
  participantId?: string;
  participantName?: string;
  responses: {
    [key: string]: number;
  };
}

const questions: Question[] = questionsData as Question[];
const questionLabels: { [key: string]: string } = questions.reduce((acc, q) => {
  acc[q.id] = q.title;
  return acc;
}, {} as { [key: string]: string });

export default function ResultsPage() {
  const [results, setResults] = useState<SurveyResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/results");
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError("결과를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (results.length === 0) return;

    const headers = [
      "참가자 번호",
      "이름",
      "제출 시간",
      "IP 주소",
      ...questions.map(q => q.title),
    ];

    const rows = results.map((result) => [
      result.participantId || "",
      result.participantName || "",
      new Date(result.timestamp).toLocaleString("ko-KR"),
      result.ip,
      ...questions.map(q => result.responses?.[q.id] !== undefined ? result.responses[q.id] : ""),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `nasa-tlx-results-${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateAverage = (key: string) => {
    const values = results
      .map((r) => r.responses?.[key])
      .filter((v) => v !== undefined && v !== null) as number[];
    if (values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-shrink-0 w-full p-6 glass-panel border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">메인으로</span>
          </Link>
          <button
            onClick={downloadCSV}
            disabled={results.length === 0}
            className="glass-button py-2 px-4 text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            CSV 다운로드
          </button>
        </div>
        <h1 className="text-2xl font-bold text-white text-center drop-shadow-lg">
          설문 결과 ({results.length}건)
        </h1>
      </div>

      <div className="flex-grow overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-300 p-8 glass-panel rounded-lg">
            {error}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center text-white/70 p-8 glass-panel rounded-lg">
            아직 제출된 설문이 없습니다.
          </div>
        ) : (
          <div className="space-y-6">
            {/* 평균 요약 */}
            <div className="glass-panel p-6 rounded-lg">
              <h2 className="text-lg font-bold text-white mb-4 drop-shadow-md">
                평균 점수
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(questionLabels).map((key) => (
                  <div
                    key={key}
                    className="glass-panel p-4 rounded-lg text-center"
                  >
                    <div className="text-sm text-white/80 mb-1">
                      {questionLabels[key]}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {calculateAverage(key)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 엑셀 스타일 테이블 */}
            <div className="glass-panel rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="border border-white/20 px-4 py-3 text-left text-sm font-bold text-white">
                        #
                      </th>
                      <th className="border border-white/20 px-4 py-3 text-left text-sm font-bold text-white">
                        참가자 번호
                      </th>
                      <th className="border border-white/20 px-4 py-3 text-left text-sm font-bold text-white">
                        이름
                      </th>
                      <th className="border border-white/20 px-4 py-3 text-left text-sm font-bold text-white">
                        제출 시간
                      </th>
                      <th className="border border-white/20 px-4 py-3 text-left text-sm font-bold text-white">
                        IP 주소
                      </th>
                      {Object.values(questionLabels).map((label) => (
                        <th
                          key={label}
                          className="border border-white/20 px-4 py-3 text-center text-sm font-bold text-white"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr
                        key={result.filename}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="border border-white/20 px-4 py-3 text-sm text-white/80">
                          {results.length - index}
                        </td>
                        <td className="border border-white/20 px-4 py-3 text-sm text-white/80">
                          {result.participantId || "-"}
                        </td>
                        <td className="border border-white/20 px-4 py-3 text-sm text-white/80">
                          {result.participantName || "-"}
                        </td>
                        <td className="border border-white/20 px-4 py-3 text-sm text-white/80 whitespace-nowrap">
                          {new Date(result.timestamp).toLocaleString("ko-KR")}
                        </td>
                        <td className="border border-white/20 px-4 py-3 text-sm text-white/80">
                          {result.ip}
                        </td>
                        {Object.keys(questionLabels).map((key) => (
                          <td
                            key={key}
                            className="border border-white/20 px-4 py-3 text-center text-base font-semibold text-white"
                          >
                            {result.responses?.[key] !== undefined ? result.responses[key] : "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
