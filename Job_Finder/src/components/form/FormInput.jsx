import React from "react";

const FormInput = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  className = "",
  error,
}) => {
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
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full h-10 px-3 border rounded-lg text-sm text-gray-800
          bg-gray-50 placeholder-gray-400 outline-none transition-all duration-150
          ${error 
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30" 
            : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white"
          } ${className}`}
      />
      {error && <p className="text-[11px] text-red-500 mt-1.5">{error}</p>}
    </div>
  );
};

export default FormInput;