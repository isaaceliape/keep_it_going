import db from "../../../db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { id } = await req.json();
  // Validate id
  if (typeof id !== "number" || !Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Invalid habit id." }, { status: 400 });
  }
  await db.query("DELETE FROM habits WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
