import { useState, useRef, useEffect } from "react";

export default function ProfileDropdown({ 
  isLoggedIn, 
  userData, 
  onLoginClick, 
  onLogoutClick 
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="absolute top-[0%] right-[2%] scale-[0.9]" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => {
          if (isLoggedIn) {
            setShowDropdown(!showDropdown);
          } else {
            onLoginClick();
          }
        }}
        className="flex items-center justify-center w-[2.75vw] h-[2.75vw] rounded-full bg-[#2F5755] text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-[0.15vw] border-white"
        title={isLoggedIn ? userData?.name : "Login"}
      >
        {isLoggedIn ? (
          <span className="text-[0.85vw]">{getInitials(userData?.name)}</span>
        ) : (
          <svg
            className="w-[1.5vw] h-[1.5vw]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        )}
      </button>

      {/* Dropdown Menu (only shown when logged in) */}
      {isLoggedIn && showDropdown && (
        <div className="absolute right-0 mt-[0.5vw] w-[18vw] bg-white rounded-[0.6vw] shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* User Info Section */}
          <div className="bg-[#2F5755] px-[1vw] py-[0.75vw]">
            <div className="flex items-center gap-[0.75vw]">
              <div className="w-[3vw] h-[3vw] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-[1vw] border-[0.15vw] border-white/30">
                {getInitials(userData?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-[0.85vw] truncate">
                  {userData?.name}
                </p>
                <p className="text-blue-100 text-[0.7vw] truncate">
                  {userData?.email}
                </p>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="px-[1vw] py-[0.75vw] space-y-[0.5vw] border-b border-gray-100">
            <div className="flex items-center gap-[0.5vw] text-[0.85vw]">
              <svg
                className="w-[1vw] h-[1vw] text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="text-gray-600 truncate">
                {userData?.companyName}
              </span>
            </div>
            <div className="flex items-center gap-[0.5vw] text-[0.85vw]">
              <svg
                className="w-[1vw] h-[1vw] text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-gray-600">{userData?.phone}</span>
            </div>
          </div>

          {/* Logout Button */}
          <div className="px-[1vw] py-[0.75vw] ">
            <button
              onClick={() => {
                onLogoutClick();
                setShowDropdown(false);
              }}
              className="w-full flex items-center justify-center gap-[0.5vw] px-[1vw] py-[0.5vw] bg-red-50 hover:bg-red-100 text-red-600 rounded-[0.5vw] font-medium transition-colors text-[0.85vw] cursor-pointer"
            >
              <svg
                className="w-[1.25vw] h-[1.25vw]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
