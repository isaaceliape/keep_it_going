"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import HabitCard from "./HabitCard";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  // Helper to get the start and end of the current week
  function getCurrentWeekRange() {
    const today = new Date();
    const first = today.getDate() - today.getDay(); // First day (Sunday) of current week
    const start = new Date(today.getFullYear(), today.getMonth(), first);
    const end = new Date(today.getFullYear(), today.getMonth(), first + 6);
    return {
      start: start.toLocaleDateString(),
      end: end.toLocaleDateString(),
      currentDate: today,
    };
  }
  const weekRange = getCurrentWeekRange();

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded-full w-48 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded-full w-full"></div>
            <div className="h-4 bg-gray-300 rounded-full w-full"></div>
            <div className="h-4 bg-gray-300 rounded-full w-full"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-light dark:bg-gradient-dark p-4">
      {/* Replace the h1 with the logo image using Next.js Image for optimization */}
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
          {(() => {
            const today = weekRange.currentDate;
            const monthNames = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];

            // Get the current date's week number within the month
            const firstDayOfMonth = new Date(
              today.getFullYear(),
              today.getMonth(),
              1
            );
            const pastDaysOfMonth = Math.floor(
              (today.getTime() - firstDayOfMonth.getTime()) / 86400000
            );
            const weekNumber = Math.ceil(
              (pastDaysOfMonth + firstDayOfMonth.getDay() + 1) / 7
            );

            return `Week ${weekNumber} of ${
              monthNames[today.getMonth()]
            } ${today.getFullYear()}`;
          })()}
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
