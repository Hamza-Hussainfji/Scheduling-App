import React from "react";

const Header = ({
  onAdd,
  treatments,
  doctors,
  selectedTreatment,
  setSelectedTreatment,
  selectedDoctor,
  setSelectedDoctor,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className={`${darkMode ? "bg-black text-white" : "bg-indigo-600 text-white"} py-4 shadow`}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Scheduling Dashboard</h2>

        <div className="flex gap-3 flex-wrap items-center">
          <select
            value={selectedTreatment}
            onChange={(e) => setSelectedTreatment(e.target.value)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            <option value="All">All Treatments</option>
            {treatments.map((treat) => (
              <option key={treat} value={treat}>{treat}</option>
            ))}
          </select>

          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            <option value="All">All Doctors</option>
            {doctors.map((doc) => (
              <option key={doc} value={doc}>{doc}</option>
            ))}
          </select>

          <button
            onClick={onAdd}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            + Add Appointment
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
