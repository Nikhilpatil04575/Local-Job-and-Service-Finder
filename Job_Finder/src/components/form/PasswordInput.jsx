import React, { useState } from "react";

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const PasswordInput = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  required,
  className = "",
  error,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-3">
      {label && (
        <label
          htmlFor={id}
          className="block text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-1.5"
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full h-10 px-3 pr-10 border rounded-lg text-sm text-gray-800
            bg-gray-50 placeholder-gray-400 outline-none transition-all duration-150
            ${error 
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30" 
              : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white"
            } ${className}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          <EyeIcon open={show} />
        </button>
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1.5">{error}</p>}
    </div>
  );
};

export default PasswordInput;