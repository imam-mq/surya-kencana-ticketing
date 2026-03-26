const style = document.createElement("style");
style.textContent = `
  @keyframes slide-in {
    from { transform: translateX(400px); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
  @keyframes progress {
    from { width: 100%; }
    to   { width: 0%;   }
  }
  .animate-slide-in   { animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .animate-progress   { animation: progress 2s linear forwards; }
`;
if (!document.getElementById("toast-animation-style")) {
  style.id = "toast-animation-style";
  document.head.appendChild(style);
}

export default function ToastNotifikasi({ showToast, toastMessage, setShowToast }) {
  if (!showToast) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 min-w-[400px]">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 w-full">
          <div className="h-full bg-gradient-to-r from-green-400 to-green-500 animate-progress" />
        </div>

        {/* Content */}
        <div className="px-6 py-4 flex items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-lg font-bold text-gray-900 mb-1">Download Berhasil</p>
            <p className="text-sm text-gray-500">{toastMessage}</p>
          </div>

          {/* Close */}
          <button
            onClick={() => setShowToast(false)}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}