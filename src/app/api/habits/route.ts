import db from "../../db";
import { NextResponse } from "next/server";

export async function GET() {
  const habits = db.prepare("SELECT * FROM habits").all();
  // Parse daysChecked JSON string to array
  const parsed = habits.map((h) => ({
    ...h,
    daysChecked: JSON.parse(h.daysChecked),
  }));
  return NextResponse.json(parsed);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const daysChecked = JSON.stringify(Array(7).fill(false));
  const stmt = db.prepare(
    "INSERT INTO habits (name, daysChecked) VALUES (?, ?)"
  );
  const info = stmt.run(name, daysChecked);
  const habit = db
    .prepare("SELECT * FROM habits WHERE id = ?")
    .get(info.lastInsertRowid);
  return NextResponse.json({
    ...habit,
    daysChecked: JSON.parse(habit.daysChecked),
  });
}
