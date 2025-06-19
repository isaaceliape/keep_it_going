"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import HabitCard from "./HabitCard";
import HamburgerMenu from "./HamburgerMenu";
import { getCurrentWeekRange, getCurrentWeekLabel } from "./utils";
import { daysOfWeek } from "./constants";

// Define Habit type
interface Habit {
  id: number;
  name: string;
  daysChecked: boolean[];
  streak: number;
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;

  // Fetch habits from API
  useEffect(() => {
    async function fetchHabits() {
      setLoading(true);
      const res = await fetch("/api/habits");
      const data = await res.json();
      setHabits(data);
      setLoading(false);
    }
    fetchHabits();
  }, []);

  const addHabit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input.trim() }),
    });
    const newHabit = await res.json();
    setHabits((prev) => [...prev, newHabit]);
    setInput("");
  };

  const toggleDay = async (habitIdx: number, dayIdx: number) => {
    const habit = habits[habitIdx];
    const updatedDays = habit.daysChecked.map((checked, j) =>
      j === dayIdx ? !checked : checked
    );
    const res = await fetch("/api/habits/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: habit.id, daysChecked: updatedDays }),
    });
    const updatedHabit = await res.json();
    setHabits((prev) =>
      prev.map((h, i) => (i === habitIdx ? updatedHabit : h))
    );
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditValue(habits[idx].name);
  };

  const saveEdit = async (idx: number) => {
    const habit = habits[idx];
    const res = await fetch("/api/habits/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: habit.id,
        name: editValue,
        daysChecked: habit.daysChecked,
      }),
    });
    const updatedHabit = await res.json();
    setHabits((prev) => prev.map((h, i) => (i === idx ? updatedHabit : h)));
    setEditingIdx(null);
    setEditValue("");
  };

  const deleteHabit = async (idx: number) => {
    const habit = habits[idx];
    await fetch("/api/habits/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: habit.id }),
    });
    setHabits((prev) => prev.filter((_, i) => i !== idx));
    setDeletingIdx(null);
  };

  const cancelEdit = () => {
    setEditingIdx(null);
    setEditValue("");
  };

  // Close menu on outside click (disable this to allow toggle only by button)
  // useEffect(() => {
  //   function handleClick(event: MouseEvent) {
  //     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
  //       setMenuOpen(false);
  //     }
  //   }
  //   if (menuOpen) {
  //     document.addEventListener("mousedown", handleClick);
  //   } else {
  //     document.removeEventListener("mousedown", handleClick);
  //   }
  //   return () => document.removeEventListener("mousedown", handleClick);
  // }, [menuOpen]);

  // Extracted import handler
  async function handleImportSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = document.getElementById("import-sqlite") as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const formData = new FormData();
    formData.append("file", input.files[0]);
    await fetch("/api/habits/import", {
      method: "POST",
      body: formData,
    });
    setMenuOpen(false);
    window.location.reload();
  }

  const weekRange = getCurrentWeekRange();

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-blue-700 font-semibold">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-light dark:bg-gradient-dark p-4">
      <HamburgerMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        menuRef={menuRef}
        handleImportSubmit={handleImportSubmit}
      />
      <div className="mb-6 drop-shadow-lg logo-container">
        <Image
          src="/keep_it_going_logo.png"
          alt="Keep it going logo"
          width={200}
          height={150}
          className="object-contain rounded-[30px]"
          priority
        />
      </div>
      <div className="mb-6 flex items-center justify-center">
        <span className="bg-blue-100 text-blue-800 font-bold text-lg px-4 py-2 rounded-full shadow border border-blue-300">
          {getCurrentWeekLabel(weekRange.currentDate)}
        </span>
      </div>
      <form onSubmit={addHabit} className="flex gap-2 mb-6 w-full max-w-xl">
        <input
          className="rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white w-full flex-grow"
          type="text"
          placeholder="Add a new habit..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-light-primary text-light-text px-4 py-2 rounded hover:bg-blue-600 dark:bg-dark-primary dark:text-dark-text border-0 focus:ring-2 focus:ring-blue-400 cursor-pointer"
        >
          Add
        </button>
      </form>
      <div className="w-full max-w-xl space-y-6">
        {loading ? (
          <div className="text-light-text text-center dark:text-dark-text">
            Loading habits...
          </div>
        ) : habits.length === 0 ? (
          <div className="text-light-text text-center dark:text-dark-text">
            No habits yet. Add one above!
          </div>
        ) : (
          habits.map((habit, i) => {
            const completed = habit.daysChecked.filter(Boolean).length;
            const percent = Math.round((completed / 7) * 100);
            return (
              <HabitCard
                key={habit.id || i}
                habit={habit}
                i={i}
                editingIdx={editingIdx}
                editValue={editValue}
                deletingIdx={deletingIdx}
                daysOfWeek={daysOfWeek}
                completed={completed}
                percent={percent}
                startEdit={startEdit}
                setEditValue={setEditValue}
                saveEdit={saveEdit}
                setDeletingIdx={setDeletingIdx}
                deleteHabit={deleteHabit}
                toggleDay={toggleDay}
                cancelEdit={cancelEdit}
              />
            );
          })
        )}
      </div>
    </main>
  );
}
