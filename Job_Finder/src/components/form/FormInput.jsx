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
        className={`w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-800
          bg-gray-50 placeholder-gray-400 outline-none
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white
          transition-all duration-150 ${className}`}
      />
    </div>
  );
};

export default FormInput;