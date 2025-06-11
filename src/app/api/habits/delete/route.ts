import db from "../../../db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { id } = await req.json();
  db.prepare("DELETE FROM habits WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
