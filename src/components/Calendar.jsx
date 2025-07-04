import React from "react";
import {
  formatDateRange,
  formatDayHeader,
  formatTimeLabel,
  findAppointmentAtSlot,
  isStartOfAppointment,
} from "../utils/calendarUtils"; // adjust the path as needed
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Calendar = ({
  days,
  timeSlots,
  appointments,
  onSlotClick,
  weekOffset,
  setWeekOffset,
  darkMode,
}) => {
  return (
    <div
      className={`p-4 rounded-xl shadow overflow-auto ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-700"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setWeekOffset((prev) => prev - 1)}
          className={`px-4 py-2 rounded ${
            darkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-semibold">
          {formatDateRange(days[0], days[6])}
        </h2>
        <button
          onClick={() => setWeekOffset((prev) => prev + 1)}
          className={`px-4 py-2 rounded ${
            darkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <FaArrowRight />
        </button>
      </div>

      <div
        className={`grid grid-cols-8 border-b text-sm font-medium sticky top-0 z-10 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white"
        }`}
      >
        <div
          className={`p-3 text-center font-semibold sticky top-0 z-20 ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          Time
        </div>
        {days.map((day) => (
          <div
            key={day.toISODate()}
            className={`p-3 text-center sticky top-0 z-20 ${formatDayHeader(
              day,
              darkMode
            )}`}
          >
            {day.toFormat("cccc dd")}
          </div>
        ))}
      </div>

      {timeSlots.map((slot) => (
        <div
          key={slot}
          className="grid grid-cols-8 border-b border-gray-100 text-sm"
        >
          <div
            className={`px-2 py-2 text-xs font-medium border-r ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-right"
            }`}
          >
            {formatTimeLabel(slot)}
          </div>

          {days.map((day) => {
            const appointment = findAppointmentAtSlot(appointments, day, slot);
            const isStartSlot =
              appointment && isStartOfAppointment(appointment, slot);

            return (
              <div
                key={day.toISODate() + slot}
                className={`h-16 px-2 py-1 border-r cursor-pointer transition ${
                  appointment
                    ? darkMode
                      ? "bg-indigo-900 text-indigo-100"
                      : "bg-indigo-100 text-indigo-800"
                    : darkMode
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => appointment && onSlotClick(appointment)}
              >
                {appointment && isStartSlot && (
                  <div className="h-full text-xs leading-snug">
                    <div className="font-bold">{appointment.patient}</div>
                    <div>{appointment.treatment}</div>
                    <div className="text-sm">{appointment.doctor}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Calendar;
