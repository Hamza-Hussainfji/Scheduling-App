import React, { useEffect, useState } from "react";
import "./App.css";
import { DateTime } from "luxon";
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import Modal from "./components/Modal";
import AddPatientForm from "./components/AddPatientForm";
import { MdDelete } from "react-icons/md";

const treatments = [
  "Eye Checkup",
  "Ear Checkup",
  "Regular Checkup",
  "Skin Treatment",
  "Other",
];

const doctors = ["Dr. Ali", "Dr. Asma", "Dr. Madiha"];

export default function App() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedTreatment, setSelectedTreatment] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) {
      try {
        return JSON.parse(stored).map((a) => ({
          ...a,
          date: DateTime.fromISO(a.date),
        }));
      } catch (e) {
        console.error("Failed to parse localStorage:", e);
      }
    }
    return [];
  });

  useEffect(() => {
    const serializable = appointments.map((a) => ({
      ...a,
      date: a.date.toISO(),
    }));
    localStorage.setItem("appointments", JSON.stringify(serializable));
  }, [appointments]);

  const handleAdd = () => {
    setSelectedAppointment(null);
    setShowModal(true);
  };

  const handleEdit = (appt) => {
    setSelectedAppointment(appt);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setShowModal(false);
  };

  const handleSave = (form) => {
    const updated = {
      ...form,
      date: DateTime.fromISO(form.date),
      id: form.id || Date.now(),
    };

    setAppointments((prev) => {
      const exists = prev.find((a) => a.id === updated.id);
      if (exists) {
        return prev.map((a) => (a.id === updated.id ? updated : a));
      }
      return [...prev, updated];
    });
    setShowModal(false);
  };

  const startOfWeek = DateTime.now()
    .plus({ weeks: weekOffset })
    .startOf("week")
    .plus({ days: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.plus({ days: i })
  );

  const timeSlots = Array.from({ length: 20 }, (_, i) =>
    DateTime.fromObject({ hour: 8 })
      .plus({ minutes: i * 30 })
      .toFormat("HH:mm")
  );

  const filteredAppointments = appointments.filter((a) => {
    return (
      (selectedTreatment === "All" || a.treatment === selectedTreatment) &&
      (selectedDoctor === "All" || a.doctor === selectedDoctor)
    );
  });

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <Header
        onAdd={handleAdd}
        treatments={treatments}
        doctors={doctors}
        selectedTreatment={selectedTreatment}
        setSelectedTreatment={setSelectedTreatment}
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="max-w-7xl mx-auto p-4">
        <Calendar
          days={weekDays}
          timeSlots={timeSlots}
          appointments={filteredAppointments}
          onSlotClick={handleEdit}
          weekOffset={weekOffset}
          setWeekOffset={setWeekOffset}
          darkMode={darkMode}
        />
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <AddPatientForm
            initialData={selectedAppointment || {}}
            onSubmit={handleSave}
            onCancel={() => setShowModal(false)}
            doctors={doctors}
            treatments={treatments}
            appointments={appointments}
            darkMode={darkMode}
          />
          {selectedAppointment && (
            <button
              onClick={() => handleDelete(selectedAppointment.id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded flex justify-center items-center  hover:bg-red-600"
            >
              <MdDelete />
              Delete Appointment
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}
