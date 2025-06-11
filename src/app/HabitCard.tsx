import React from "react";
import ProgressBar from "./ProgressBar";

interface HabitCardProps {
  habit: {
    id: number;
    name: string;
    daysChecked: boolean[];
    streak: number;
  };
  i: number;
  editingIdx: number | null;
  editValue: string;
  deletingIdx: number | null;
  daysOfWeek: string[];
  completed: number;
  percent: number;
  startEdit: (idx: number) => void;
  setEditValue: (val: string) => void;
  saveEdit: (idx: number) => void;
  setDeletingIdx: (idx: number | null) => void;
  deleteHabit: (idx: number) => void;
  toggleDay: (habitIdx: number, dayIdx: number) => void;
  cancelEdit: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  i,
  editingIdx,
  editValue,
  deletingIdx,
  daysOfWeek,
  completed,
  percent,
  startEdit,
  setEditValue,
  saveEdit,
  setDeletingIdx,
  deleteHabit,
  toggleDay,
  cancelEdit,
}) => {
  return (
    <div
      key={habit.id || i}
      className="bg-light-background text-light-text rounded shadow p-4 dark:bg-dark-background dark:text-dark-text"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {editingIdx === i ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEdit(i);
              }}
              className="flex items-center gap-2 w-full"
            >
              <input
                className="border rounded px-2 py-1 flex-1 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                placeholder="Edit habit name"
                title="Edit habit name"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 hover:text-green-900 transition-colors text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 mr-1 cursor-pointer"
                title="Save changes"
              >
                Save
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:text-gray-900 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
                title="Cancel edit"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </form>
          ) : (
            <span className="font-semibold text-lg truncate">{habit.name}</span>
          )}
        </div>
        <span className="text-sm text-light-text ml-4 whitespace-nowrap dark:text-dark-text">
          {completed}/7 days
          <span className="ml-2 text-xs bg-yellow-50 text-purple-600 px-2 py-0.5 rounded border border-yellow-100">
            Streak: {habit.streak} week
            {habit.streak === 1 ? "" : "s"}
          </span>
        </span>
        {editingIdx !== i && (
          <>
            <button
              onClick={() => startEdit(i)}
              className="ml-4 px-2 py-1 rounded bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 hover:text-blue-900 transition-colors text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              title="Edit habit"
              type="button"
            >
              Edit
            </button>
            <button
              onClick={() => setDeletingIdx(i)}
              className="ml-2 px-2 py-1 rounded bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 hover:text-red-900 transition-colors text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
              title="Delete habit"
              type="button"
            >
              Delete
            </button>
          </>
        )}
      </div>
      {deletingIdx === i && (
        <div className="mt-2 mb-4 flex items-center bg-red-50 border border-red-200 rounded p-2">
          <span className="text-red-700 text-sm">
            Are you sure you want to delete this habit?
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => deleteHabit(i)}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
              type="button"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setDeletingIdx(null)}
              className="px-3 py-1 rounded bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:text-gray-900 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-2 mb-2">
        {daysOfWeek.map((day, j) => {
          const isToday = j === new Date().getDay();
          return (
            <label
              key={day}
              className={`flex flex-col items-center text-xs ${
                isToday ? "font-bold text-blue-700" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={habit.daysChecked[j]}
                onChange={() => toggleDay(i, j)}
                className={`w-5 h-5 mb-1 rounded border-2 border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 bg-white dark:bg-dark-background dark:border-blue-700 checked:bg-blue-500 checked:border-blue-500 checked:dark:bg-blue-600 checked:dark:border-blue-600 hover:border-blue-600 hover:ring-blue-400 cursor-pointer ${
                  isToday ? "ring-2 ring-blue-400 ring-offset-2" : ""
                }`}
              />
              {day}
            </label>
          );
        })}
      </div>
      <ProgressBar percent={percent} />
    </div>
  );
};

export default HabitCard;
