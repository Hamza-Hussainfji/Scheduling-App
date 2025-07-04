import { DateTime } from "luxon";

export const formatDateRange = (start, end) => {
  return `${start.toFormat("dd LLL")} - ${end.toFormat("dd LLL yyyy")}`;
};

export const formatDayHeader = (day, darkMode) => {
  const isToday = day.hasSame(DateTime.now(), "day");
  if (isToday) {
    return darkMode ? "bg-indigo-700 text-white font-semibold" : "bg-indigo-200 text-black font-semibold";
  }
  return darkMode ? "bg-gray-900" : "bg-white";
};

export const formatTimeLabel = (timeString) => {
  return DateTime.fromFormat(timeString, "HH:mm").toFormat("hh:mm a");
};

export const findAppointmentAtSlot = (appointments, day, slot) => {
  const slotTime = DateTime.fromFormat(slot, "HH:mm");

  return appointments.find((a) =>
    a.date.hasSame(day, "day") &&
    slotTime >= DateTime.fromFormat(a.start, "HH:mm") &&
    slotTime < DateTime.fromFormat(a.end, "HH:mm")
  );
};

export const isStartOfAppointment = (appointment, slot) => {
  return slot === DateTime.fromFormat(appointment.start, "HH:mm").toFormat("HH:mm");
};
