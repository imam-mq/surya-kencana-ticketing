import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordField = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Lock size={13} className="text-gray-400" />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-sm outline-none transition-all focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
          style={{ padding: "8px 40px 8px 34px" }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;