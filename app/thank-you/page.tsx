import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-8 text-center">
      <div className="p-6 glass-panel rounded-full mb-8 shadow-lg">
        <CheckCircle2 className="w-20 h-20 text-white drop-shadow-lg" strokeWidth={1.5} />
      </div>

      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
        제출이 완료되었습니다.
      </h1>

      <p className="text-white text-lg mb-12 leading-relaxed max-w-md drop-shadow-md">
        설문에 참여해 주셔서 진심으로 감사합니다.
        <br />
        여러분의 소중한 의견은 연구에 큰 도움이 될 것입니다.
      </p>

      <Link
        href="/"
        className="glass-button w-full max-w-xs py-3 px-6 text-base"
      >
        메인 페이지로 돌아가기
      </Link>
    </div>
  );
}
