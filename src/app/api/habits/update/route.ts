import db from "../../../db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { id, daysChecked, name } = await req.json();
  if (typeof name === "string") {
    db.prepare("UPDATE habits SET name = ?, daysChecked = ? WHERE id = ?").run(
      name,
      JSON.stringify(daysChecked),
      id
    );
  } else {
    db.prepare("UPDATE habits SET daysChecked = ? WHERE id = ?").run(
      JSON.stringify(daysChecked),
      id
    );
  }
  const habit = db.prepare("SELECT * FROM habits WHERE id = ?").get(id);
  return NextResponse.json({
    ...habit,
    daysChecked: JSON.parse(habit.daysChecked),
  });
}
