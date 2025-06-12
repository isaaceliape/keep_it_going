import db from "../../../db";
import { NextResponse } from "next/server";
import type { HabitRow } from "./habits.types";

// Utils
function parseHabit(habit: HabitRow) {
  return {
    ...habit,
    daysChecked: JSON.parse(habit.daysChecked),
    streak: habit.streak ?? 0,
  };
}

// GET /api/habits
export async function GET() {
  const [rows] = await db.query("SELECT * FROM habits");
  const habits = rows as HabitRow[];
  const parsed = habits.map(parseHabit);
  return NextResponse.json(parsed);
}

// POST /api/habits
export async function POST(req: Request) {
  const { name } = await req.json();
  // Sanitize and validate name
  if (typeof name !== "string" || !name.trim() || name.length > 100) {
    return NextResponse.json({ error: "Invalid habit name." }, { status: 400 });
  }
  const safeName = name.trim();
  const daysChecked = JSON.stringify(Array(7).fill(false));
  const [result] = await db.query(
    "INSERT INTO habits (name, daysChecked, streak) VALUES (?, ?, 0)",
    [safeName, daysChecked]
  );
  const insertId = (result as { insertId: number }).insertId;
  const [habitRows] = await db.query("SELECT * FROM habits WHERE id = ?", [
    insertId,
  ]);
  const habit = (habitRows as HabitRow[])[0];
  return NextResponse.json(parseHabit(habit));
}
