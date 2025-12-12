"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Info } from "lucide-react";

export default function ConsentPage() {
  const [isAgreed, setIsAgreed] = useState(false);
  const [participantId, setParticipantId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const router = useRouter();

  const handleStartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isAgreed) {
      e.preventDefault();
      alert("안내 사항을 읽고 동의해 주세요.");
      return;
    }
    if (!participantId.trim() || !participantName.trim()) {
      e.preventDefault();
      alert("참가자 번호와 이름을 입력해 주세요.");
      return;
    }
    // Save participant info to localStorage
    localStorage.setItem("participantId", participantId.trim());
    localStorage.setItem("participantName", participantName.trim());
    router.push("/survey");
  };

  return (
    <div className="flex flex-col h-full w-full p-6">
      <div className="flex-shrink-0 pt-4 pb-6 border-b border-white/20">
        <h1 className="text-2xl font-bold text-white text-center drop-shadow-lg">
          <Info className="inline-block w-7 h-7 mr-2" />
          안내 및 동의 사항
        </h1>
      </div>

      <div className="flex-grow py-6 space-y-4 text-white overflow-y-auto">
        <p className="font-bold text-white drop-shadow-md">
          설문에 참여하시기 전, 다음 사항을 주의 깊게 읽어주세요.
        </p>
        <ul className="list-disc list-inside space-y-3 pl-2 text-white/90 drop-shadow-sm">
          <li>
            본 설문은 약 5분 정도 소요될 예정입니다.
          </li>
          <li>
            NASA-TLX(Task Load Index)는 작업 수행 시 느끼는 주관적인 작업 부하를 평가하는 도구입니다.
          </li>
          <li>
            6가지 척도(정신적 요구, 신체적 요구, 시간적 요구, 수행도, 노력, 좌절감)에 대해 응답하게 됩니다.
          </li>
          <li>
            각 척도는 슬라이더를 통해 1부터 100까지의 값으로 평가할 수 있습니다.
          </li>
          <li>
            수집된 모든 데이터는 익명으로 처리되며, 연구 목적 이외에는 절대 사용되지 않습니다.
          </li>
          <li>
            설문 도중 언제든지 중단하실 수 있으나, 가급적 모든 문항에 응답해 주시기를 부탁드립니다.
          </li>
        </ul>
        <p className="pt-4 text-white/90 drop-shadow-sm">
          여러분의 소중한 참여가 연구에 큰 도움이 됩니다. 감사합니다.
        </p>
      </div>

      <div className="flex-shrink-0 pt-6 border-t border-white/20 space-y-4">
        <div className="space-y-3">
          <div>
            <label htmlFor="participant-id" className="block text-white text-sm font-semibold mb-2 drop-shadow-sm">
              참가자 번호 (실험자가 입력)
            </label>
            <input
              id="participant-id"
              type="text"
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              placeholder="000_0"
              className="w-full px-4 py-3 rounded-lg glass-panel text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            />
          </div>
          <div>
            <label htmlFor="participant-name" className="block text-white text-sm font-semibold mb-2 drop-shadow-sm">
              이름
            </label>
            <input
              id="participant-name"
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="홍길동"
              className="w-full px-4 py-3 rounded-lg glass-panel text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            />
          </div>
        </div>

        <label
          htmlFor="consent-checkbox"
          className="flex items-center p-4 rounded-lg transition-all duration-200 cursor-pointer glass-panel hover:bg-white/20"
        >
          <input
            id="consent-checkbox"
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="hidden peer"
          />
          <div className="flex items-center justify-center w-6 h-6 mr-3 rounded glass-checkbox peer-checked:glass-checkbox transition-all duration-200">
            {isAgreed && <Check className="w-4 h-4 text-white" />}
          </div>
          <span className="text-white select-none drop-shadow-sm">
            안내 사항을 모두 읽고 이에 동의합니다.
          </span>
        </label>

        <button
          onClick={handleStartClick}
          disabled={!isAgreed}
          className="glass-button w-full py-4 px-6 text-lg"
        >
          설문 시작하기
        </button>
      </div>
    </div>
  );
}
