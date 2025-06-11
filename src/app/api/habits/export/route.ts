import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const dbPath = path.resolve(process.cwd(), "habits.sqlite");
  const fileBuffer = fs.readFileSync(dbPath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=habits.sqlite",
    },
  });
}
