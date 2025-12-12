import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { participantId, participantName, condition, responses } = body;

    // IP 주소 가져오기
    const ip = req.headers.get("x-forwarded-for") ||
               req.headers.get("x-real-ip") ||
               "unknown";

    // 타임스탬프 생성
    const timestamp = new Date().toISOString();

    // 저장할 데이터 구조
    const data = {
      timestamp,
      ip,
      participantId,
      participantName,
      condition,
      responses,
    };

    // survey-results 디렉토리 경로 (프로젝트 루트 기준)
    const dataDir = path.join(process.cwd(), "data", "survey-results");

    // survey-results 디렉토리가 없으면 생성
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // 파일명: 참가자 ID와 타임스탬프 기반
    const sanitizedId = participantId.replace(/[^a-zA-Z0-9]/g, "_");
    const sanitizedTimestamp = timestamp.replace(/[:.]/g, "-");
    const filename = `survey_${sanitizedId}_${sanitizedTimestamp}.json`;
    const filePath = path.join(dataDir, filename);

    // 데이터를 JSON 파일로 저장
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "설문이 성공적으로 제출되었습니다."
    });
  } catch (error) {
    console.error("Survey submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "설문 제출 중 오류가 발생했습니다."
      },
      { status: 500 }
    );
  }
}
