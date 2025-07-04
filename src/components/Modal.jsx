import React from "react";
import { IoIosClose, IoMdClose } from "react-icons/io";

const Modal = ({ children, onClose, darkMode }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        darkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div
        className={`rounded-lg shadow-lg max-w-md w-full p-7  relative transition-colors duration-300 ${
          darkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <button
          className={`absolute top-0 right-2 mb-10 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={onClose}
        >
          <IoMdClose className="text-2xl" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
