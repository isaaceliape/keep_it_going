"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

/**
 * Home component - Main page of the habit tracking application
 * Manages the state of habits, UI interactions, and API calls
 */
export default function Home() {
  // State for habits and related operations
  const [habits, setHabits] = useState<Habit[]>(() => []);
  const [input, setInput] = useState(() => ""); // New habit input
  
  // UI state management
  const [loading, setLoading] = useState(() => true); // Initial loading state
  const [error, setError] = useState<string | null>(() => null); // Error messages
  const [actionInProgress, setActionInProgress] = useState<string | null>(() => null); // Tracks ongoing API calls
  
  // Edit mode state
  const [editingIdx, setEditingIdx] = useState<number | null>(() => null); // Currently editing habit index
  const [editValue, setEditValue] = useState(() => ""); // Edit input value
  
  // Delete confirmation state
  const [deletingIdx, setDeletingIdx] = useState<number | null>(() => null);
  
  // Menu state
  const [menuOpen, setMenuOpen] = useState(() => false);
  const menuRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;

  /**
   * Fetch all habits from the API on component mount
   * Sets loading and error states appropriately during the process
   */
  useEffect(() => {
    async function fetchHabits() {
      try {
        setLoading(true); // Start loading
        setError(null);   // Clear any previous errors
        
        const res = await fetch("/api/habits");
        if (!res.ok) {
          throw new Error(`Failed to fetch habits: ${res.status}`);
        }
        
        const data = await res.json();
        setHabits(data);  // Update habits with fetched data
      } catch (error) {
        console.error("Error fetching habits:", error);
        setError(error instanceof Error ? error.message : "Failed to load habits");
      } finally {
        setLoading(false); // End loading state regardless of outcome
      }
    }
    fetchHabits();
  }, []); // Empty dependency array ensures this runs once on mount

  /**
   * Adds a new habit via API call
   * Handles form submission, validation, API request, and state updates
   * 
   * @param e - Form submission event 
   */
  const addHabit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return; // Prevent adding empty habits
    
    try {
      setActionInProgress("adding"); // Show loading indicator
      setError(null); // Clear any previous errors
      
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: input.trim() }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to add habit: ${res.status}`);
      }
      
      const newHabit = await res.json();
      setHabits((prev) => [...prev, newHabit]); // Add new habit to state
      setInput(""); // Reset input field
    } catch (error) {
      console.error("Error adding habit:", error);
      setError(error instanceof Error ? error.message : "Failed to add habit");
    } finally {
      setActionInProgress(null); // Remove loading indicator
    }
  }, [input]); // Re-create function when input changes

  /**
   * Toggles the completion status of a specific day for a habit
   * Performs optimistic UI update and sends API request to persist the change
   * 
   * @param habitIdx - Index of the habit in the habits array
   * @param dayIdx - Index of the day to toggle (0-6 for Sunday-Saturday)
   */
  const toggleDay = useCallback(async (habitIdx: number, dayIdx: number) => {
    const habit = habits[habitIdx];
    // Create updated days array with the toggled day
    const updatedDays = habit.daysChecked.map((checked, j) =>
      j === dayIdx ? !checked : checked,
    );
    
    // Store original days for potential rollback
    const originalDays = [...habit.daysChecked];
    
    // Apply optimistic update
    setHabits((prev) => 
      prev.map((h, i) => i === habitIdx 
        ? { ...h, daysChecked: updatedDays } 
        : h
      )
    );
    
    try {
      const res = await fetch("/api/habits/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: habit.id, daysChecked: updatedDays }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to update habit: ${res.status}`);
      }
      
      const updatedHabit = await res.json();
      // Update with server response (includes updated streak)
      setHabits((prev) =>
        prev.map((h, i) => (i === habitIdx ? updatedHabit : h)),
      );
    } catch (error) {
      console.error("Error toggling day:", error);
      // Rollback optimistic update on error
      setHabits((prev) =>
        prev.map((h, i) => i === habitIdx 
          ? { ...h, daysChecked: originalDays } 
          : h
        )
      );
      setError("Failed to update habit. Please try again.");
    }
  }, [habits]);

  const startEdit = useCallback((idx: number) => {
    setEditingIdx(idx);
    setEditValue(habits[idx].name);
  }, [habits]);

  const saveEdit = useCallback(async (idx: number) => {
    const habit = habits[idx];
    try {
      const res = await fetch("/api/habits/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: habit.id,
          name: editValue,
          daysChecked: habit.daysChecked,
        }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to update habit: ${res.status}`);
      }
      
      const updatedHabit = await res.json();
      setHabits((prev) => prev.map((h, i) => (i === idx ? updatedHabit : h)));
      setEditingIdx(null);
      setEditValue("");
    } catch (error) {
      console.error("Error saving edit:", error);
      // Could display an error message to the user
    }
  }, [habits, editValue]);

  const deleteHabit = useCallback(async (idx: number) => {
    const habit = habits[idx];
    try {
      const res = await fetch("/api/habits/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: habit.id }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to delete habit: ${res.status}`);
      }
      
      setHabits((prev) => prev.filter((_, i) => i !== idx));
      setDeletingIdx(null);
    } catch (error) {
      console.error("Error deleting habit:", error);
      // Could show an error notification to the user
    }
  }, [habits]);

  const cancelEdit = useCallback(() => {
    setEditingIdx(null);
    setEditValue("");
  }, []);

  // Extracted import handler
  const handleImportSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = document.getElementById("import-sqlite") as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    try {
      const formData = new FormData();
      formData.append("file", input.files[0]);
      const res = await fetch("/api/habits/import", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Failed to import habits: ${res.status}`);
      }
      
      setMenuOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error importing habits:", error);
      // Could display an import error message
      // Could also add a more graceful recovery than forcing reload
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);
  
  // Memoize weekRange calculation
const weekRange = useMemo(() => getCurrentWeekRange(), []);
  
// Memoize week label to avoid recalculation on re-renders
const weekLabel = useMemo(() => getCurrentWeekLabel(weekRange.currentDate), [weekRange.currentDate]);

  // Show full-screen loading state only when initially loading
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-blue-700 font-semibold">Loading habits...</div>
        </div>
      </main>
    );
  }
  
  // Show error state if we have an error and no habits
  if (error && habits.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="flex flex-col items-center">
          <div className="text-red-600 font-semibold mb-2">Error</div>
          <div className="text-red-500">{error}</div>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
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
          {weekLabel}
        </span>
      </div>
      <form onSubmit={addHabit} className="flex gap-2 mb-6 w-full max-w-xl">
        <input
          className="rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white w-full flex-grow"
          type="text"
          placeholder="Add a new habit..."
          value={input}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          disabled={actionInProgress === "adding"}
          className={`bg-light-primary text-light-text px-4 py-2 rounded hover:bg-blue-600 dark:bg-dark-primary dark:text-dark-text border-0 focus:ring-2 focus:ring-blue-400 ${
            actionInProgress === "adding" ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {actionInProgress === "adding" ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Adding...
            </>
          ) : "Add"}
        </button>
      </form>
      
      {/* Display error message if any */}
      {error && (
        <div className="w-full max-w-xl mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Dismiss</span>
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}
      
      <div className="w-full max-w-xl space-y-6">
        {habits.length === 0 ? (
          <div className="text-light-text text-center dark:text-dark-text">
            No habits yet. Add one above!
          </div>
        ) : (
          habits.map((habit, i) => {
            // Calculate these values directly instead of using useMemo in a loop
            const completedDays = habit.daysChecked.filter(Boolean).length;
            const percent = Math.round((completedDays / 7) * 100);
            return (
              <HabitCard
                key={habit.id || i}
                habit={habit}
                i={i}
                editingIdx={editingIdx}
                editValue={editValue}
                deletingIdx={deletingIdx}
                daysOfWeek={daysOfWeek}
                completed={completedDays}
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