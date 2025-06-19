import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HabitCard from "./HabitCard";

describe("HabitCard", () => {
  const defaultProps = {
    habit: {
      id: 1,
      name: "Read",
      daysChecked: [true, false, false, false, false, false, false],
      streak: 2,
    },
    i: 0,
    editingIdx: null,
    editValue: "Read",
    deletingIdx: null,
    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    completed: 1,
    percent: 14,
    startEdit: jest.fn(),
    setEditValue: jest.fn(),
    saveEdit: jest.fn(),
    setDeletingIdx: jest.fn(),
    deleteHabit: jest.fn(),
    toggleDay: jest.fn(),
    cancelEdit: jest.fn(),
  };

  it("renders habit name and streak", () => {
    render(<HabitCard {...defaultProps} />);
    expect(screen.getByText("Read")).toBeInTheDocument();
    expect(screen.getByText(/Streak: 2 weeks/)).toBeInTheDocument();
  });

  it("calls startEdit when Edit button is clicked", () => {
    render(<HabitCard {...defaultProps} />);
    fireEvent.click(screen.getByTitle("Edit habit"));
    expect(defaultProps.startEdit).toHaveBeenCalledWith(0);
  });

  it("shows edit form when editingIdx matches", () => {
    render(<HabitCard {...defaultProps} editingIdx={0} />);
    expect(screen.getByPlaceholderText("Edit habit name")).toBeInTheDocument();
  });

  it("calls saveEdit on form submit", () => {
    render(<HabitCard {...defaultProps} editingIdx={0} />);
    const input = screen.getByPlaceholderText("Edit habit name");
    const form = input.closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);
    expect(defaultProps.saveEdit).toHaveBeenCalledWith(0);
  });

  it("calls setEditValue on input change", () => {
    render(<HabitCard {...defaultProps} editingIdx={0} />);
    fireEvent.change(screen.getByPlaceholderText("Edit habit name"), {
      target: { value: "Write" },
    });
    expect(defaultProps.setEditValue).toHaveBeenCalledWith("Write");
  });

  it("shows delete confirmation when deletingIdx matches", () => {
    render(<HabitCard {...defaultProps} deletingIdx={0} />);
    expect(
      screen.getByText(/Are you sure you want to delete/)
    ).toBeInTheDocument();
  });

  it("calls deleteHabit when Yes, delete is clicked", () => {
    render(<HabitCard {...defaultProps} deletingIdx={0} />);
    fireEvent.click(screen.getByText("Yes, delete"));
    expect(defaultProps.deleteHabit).toHaveBeenCalledWith(0);
  });

  it("calls setDeletingIdx(null) when Cancel delete is clicked", () => {
    render(<HabitCard {...defaultProps} deletingIdx={0} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.setDeletingIdx).toHaveBeenCalledWith(null);
  });

  it("calls toggleDay when a day checkbox is clicked", () => {
    render(<HabitCard {...defaultProps} />);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    expect(defaultProps.toggleDay).toHaveBeenCalledWith(0, 1);
  });
});
