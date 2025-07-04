import React, { useState, useMemo } from "react";
import { DateTime } from "luxon";

const generateTimeSlots = () => {
  const slots = [];
  let time = DateTime.fromObject({ hour: 8, minute: 0 });
  const end = DateTime.fromObject({ hour: 18, minute: 0 });
  while (time < end) {
    slots.push(time.toFormat("HH:mm"));
    time = time.plus({ minutes: 30 });
  }
  return slots;
};

const AddPatientForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  doctors,
  treatments,
  appointments,
}) => {
  const [form, setForm] = useState({
    patient: initialData.patient || "",
    doctor: initialData.doctor || "",
    treatment: initialData.treatment || "",
    purpose: initialData.purpose || "",
    date: initialData.date?.toISODate?.() || "",
    start: initialData.start || "",
    end: initialData.end || "",
    id: initialData.id,
  });

  const [error, setError] = useState("");

  const allSlots = useMemo(() => generateTimeSlots(), []);

  const availableSlots = useMemo(() => {
    if (!form.date || !form.doctor) return allSlots;

    const selectedDate = DateTime.fromISO(form.date);
    const doctorAppointments = appointments.filter(
      (a) =>
        a.doctor === form.doctor &&
        a.date.hasSame(selectedDate, "day") &&
        a.id !== form.id
    );

    return allSlots.filter((slot) => {
      const slotTime = DateTime.fromFormat(slot, "HH:mm");
      return !doctorAppointments.some((appt) => {
        const start = DateTime.fromFormat(appt.start, "HH:mm");
        const end = DateTime.fromFormat(appt.end, "HH:mm");
        return slotTime >= start && slotTime < end;
      });
    });
  }, [form.date, form.doctor, appointments, allSlots, form.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { patient, doctor, treatment, purpose, date, start, end } = form;
    if (
      !patient ||
      !doctor ||
      !treatment ||
      !purpose ||
      !date ||
      !start ||
      !end
    ) {
      setError("All fields are required.");
      return;
    }

    const startTime = DateTime.fromFormat(start, "HH:mm");
    const endTime = DateTime.fromFormat(end, "HH:mm");
    if (endTime <= startTime) {
      setError("End time must be after start time.");
      return;
    }

    setError("");
    onSubmit(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        name="patient"
        placeholder="Patient Name"
        value={form.patient}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="doctor"
        value={form.doctor}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select Doctor</option>
        {doctors.map((doc) => (
          <option key={doc}>{doc}</option>
        ))}
      </select>

      <select
        name="treatment"
        value={form.treatment}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select Treatment</option>
        {treatments.map((treat) => (
          <option key={treat}>{treat}</option>
        ))}
      </select>

      <input
        name="purpose"
        placeholder="Purpose"
        value={form.purpose}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex gap-2">
        <select
          name="start"
          value={form.start}
          onChange={handleChange}
          className="w-1/2 border px-3 py-2 rounded"
        >
          <option value="">Start</option>
          {availableSlots.map((slot) => (
            <option key={slot} value={slot}>
              {DateTime.fromFormat(slot, "HH:mm").toFormat("hh:mm a")}
            </option>
          ))}
        </select>

        <select
          name="end"
          value={form.end}
          onChange={handleChange}
          className="w-1/2 border px-3 py-2 rounded"
        >
          <option value="">End</option>
          {availableSlots
            .filter((s) => s > form.start)
            .map((slot) => (
              <option key={slot} value={slot}>
                {DateTime.fromFormat(slot, "HH:mm").toFormat("hh:mm a")}
              </option>
            ))}
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {form.id ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
};

export default AddPatientForm;
