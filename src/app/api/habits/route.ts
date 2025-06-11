import db from "../../db";
import { NextResponse } from "next/server";

interface HabitRow {
  id: number;
  name: string;
  daysChecked: string;
  streak: number;
}

export async function GET() {
  const habits = db.prepare("SELECT * FROM habits").all() as HabitRow[];
  // Parse daysChecked JSON string to array
  const parsed = habits.map((h) => ({
    ...h,
    daysChecked: JSON.parse(h.daysChecked),
    streak: h.streak ?? 0,
  }));
  return NextResponse.json(parsed);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const daysChecked = JSON.stringify(Array(7).fill(false));
  const stmt = db.prepare(
    "INSERT INTO habits (name, daysChecked, streak) VALUES (?, ?, 0)"
  );
  const info = stmt.run(name, daysChecked);
  const habit = db
    .prepare("SELECT * FROM habits WHERE id = ?")
    .get(info.lastInsertRowid) as HabitRow;
  return NextResponse.json({
    id: habit.id,
    name: habit.name,
    daysChecked: JSON.parse(habit.daysChecked),
    streak: habit.streak ?? 0,
  });
}
