import React from "react";

const SectionCard = ({ icon: Icon, title, subtitle, accentColor = "#1e3a8a", children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${accentColor}14` }}
      >
        <Icon size={15} style={{ color: accentColor }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

export default SectionCard;