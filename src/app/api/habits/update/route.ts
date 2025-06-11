import db from "../../../db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { id, daysChecked, name } = await req.json();
  let streak = null;
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
  // Check if all days are checked for the week
  if (Array.isArray(daysChecked) && daysChecked.length === 7) {
    const allChecked = daysChecked.every(Boolean);
    if (allChecked) {
      // Increment streak
      db.prepare("UPDATE habits SET streak = streak + 1 WHERE id = ?").run(id);
    } else {
      // Reset streak to 0 if not all checked
      db.prepare("UPDATE habits SET streak = 0 WHERE id = ?").run(id);
    }
  }
  const habit = db.prepare("SELECT * FROM habits WHERE id = ?").get(id);
  return NextResponse.json({
    ...habit,
    daysChecked: JSON.parse(habit.daysChecked),
  });
}
