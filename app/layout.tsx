import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "NASA-TLX 설문",
  description: "NASA-TLX 작업 부하 평가 설문에 참여해 주세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={notoSansKr.className}>
        <div className="flex items-center justify-center min-h-screen w-full p-4 md:p-8">
          <main className="relative w-full max-w-2xl h-screen md:h-[90vh] md:max-h-[900px] glass-card overflow-hidden shadow-2xl">
            <div className="h-full w-full overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
