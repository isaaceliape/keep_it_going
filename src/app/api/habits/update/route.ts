import db from "../../../../db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { id, daysChecked, name } = await req.json();
  // Validate id
  if (typeof id !== "number" || !Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Invalid habit id." }, { status: 400 });
  }
  // Validate daysChecked
  if (
    !Array.isArray(daysChecked) ||
    daysChecked.length !== 7 ||
    !daysChecked.every((d) => typeof d === "boolean")
  ) {
    return NextResponse.json(
      { error: "Invalid daysChecked array." },
      { status: 400 }
    );
  }
  // Validate name if present
  let safeName = undefined;
  if (typeof name === "string") {
    if (!name.trim() || name.length > 100) {
      return NextResponse.json(
        { error: "Invalid habit name." },
        { status: 400 }
      );
    }
    safeName = name.trim();
    await db.query("UPDATE habits SET name = ?, daysChecked = ? WHERE id = ?", [
      safeName,
      JSON.stringify(daysChecked),
      id,
    ]);
  } else {
    await db.query("UPDATE habits SET daysChecked = ? WHERE id = ?", [
      JSON.stringify(daysChecked),
      id,
    ]);
  }
  // Check the days and manage streak
  if (Array.isArray(daysChecked) && daysChecked.length === 7) {
    // Reset streak if any day is unchecked (meaning they missed a day)
    if (daysChecked.includes(false)) {
      // Reset streak to 0 if any day is missed
      await db.query("UPDATE habits SET streak = 0 WHERE id = ?", [id]);
    } else {
      // Increment streak only if all days are checked
      await db.query("UPDATE habits SET streak = streak + 1 WHERE id = ?", [
        id,
      ]);
    }
  }
  const [habitRows] = await db.query("SELECT * FROM habits WHERE id = ?", [id]);
  const habit = (
    habitRows as {
      id: number;
      name: string;
      daysChecked: string;
      streak: number;
    }[]
  )[0];
  return NextResponse.json({
    id: habit.id,
    name: habit.name,
    daysChecked: JSON.parse(habit.daysChecked),
    streak: habit.streak ?? 0,
  });
}
