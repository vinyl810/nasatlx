import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data", "survey-results");

    // survey-results 디렉토리가 없으면 빈 배열 반환
    try {
      await fs.access(dataDir);
    } catch {
      return NextResponse.json({ results: [] });
    }

    // survey-results 디렉토리의 모든 JSON 파일 읽기
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    // 각 파일을 읽어서 파싱
    const results = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(dataDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(content);
        return {
          filename: file,
          ...data,
        };
      })
    );

    // 타임스탬프 기준으로 정렬 (최신순)
    results.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
