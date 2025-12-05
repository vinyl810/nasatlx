import Link from "next/link";
import { ClipboardCheck, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-8 text-center">
      <div className="p-6 glass-panel rounded-full mb-8 shadow-lg">
        <ClipboardCheck className="w-20 h-20 text-white drop-shadow-lg" strokeWidth={1.5} />
      </div>

      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
        NASA-TLX 설문
      </h1>

      <p className="text-white text-lg mb-12 leading-relaxed max-w-md drop-shadow-md">
        안녕하세요.
        <br />
        본 설문은 작업 부하 평가를 위한 NASA-TLX 연구를 위해 제작되었습니다.
        <br />
        잠시 시간을 내어 참여해 주시면 감사하겠습니다.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/consent"
          className="glass-button py-4 px-6 text-lg flex items-center justify-center"
        >
          설문 시작하기
        </Link>

        <Link
          href="/results"
          className="glass-button py-3 px-6 text-base flex items-center justify-center gap-2"
        >
          <BarChart3 className="w-5 h-5" />
          결과 보기
        </Link>
      </div>
    </div>
  );
}
