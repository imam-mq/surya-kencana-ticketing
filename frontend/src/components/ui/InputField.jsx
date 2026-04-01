import React from "react";

const InputField = ({ label, icon: Icon, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon size={13} className="text-gray-400" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-sm outline-none transition-all focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
        style={{ padding: Icon ? "8px 12px 8px 34px" : "8px 12px" }}
      />
    </div>
  </div>
);

export default InputField;