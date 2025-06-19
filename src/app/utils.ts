// Utility/helper functions for the app

// Helper to get the start and end of the current week
export function getCurrentWeekRange() {
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

// Helper to get the week number and label for the current date
export function getCurrentWeekLabel(date: Date) {
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
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const pastDaysOfMonth = Math.floor(
    (date.getTime() - firstDayOfMonth.getTime()) / 86400000
  );
  const weekNumber = Math.ceil(
    (pastDaysOfMonth + firstDayOfMonth.getDay() + 1) / 7
  );
  return `Week ${weekNumber} of ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;
}
