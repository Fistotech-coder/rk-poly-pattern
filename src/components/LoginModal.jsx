import { useState } from "react";




// Security: Generate a simple token based on user data + timestamp
const generateAuthToken = (userData) => {
  const tokenData = `${userData.name}-${userData.email}-${userData.phone}-${userData.loginTimestamp}`;
  // Simple hash function (in production, use a proper JWT or backend validation)
  let hash = 0;
  for (let i = 0; i < tokenData.length; i++) {
    const char = tokenData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    phone: "",
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter valid 10-digit phone number";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleRequestOtp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const otp = generateOtp();
    setGeneratedOtp(otp);
    
    console.log("Generated OTP:", otp);
    alert(`OTP sent to ${formData.phone} and ${formData.email}\nOTP: ${otp}`);
    
    setLoading(false);
    setStep("otp");
  };

  const handleVerifyOtp = () => {
    if (otp !== generatedOtp) {
      setErrors({ otp: "Invalid OTP. Please try again." });
      return;
    }
    
    // Create user data with security token
    const loginTimestamp = new Date().toISOString();
    const userData = {
      ...formData,
      loginTimestamp,
      isLoggedIn: true,
    };
    
    // Generate authentication token
    const authToken = generateAuthToken(userData);
    
    // Store both userData and authToken separately
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("authToken", authToken);
    
    // Reset form
    setFormData({ name: "", companyName: "", phone: "", email: "" });
    setOtp("");
    setGeneratedOtp("");
    setStep("form");
    setErrors({});
    
    onLoginSuccess(userData);
    onClose();
  };

  const handleResendOtp = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    
    console.log("Resent OTP:", newOtp);
    alert(`New OTP sent: ${newOtp}`);
    
    setLoading(false);
    setOtp("");
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-[#000000b0] bg-opacity-50 flex items-center justify-center z-50000 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-[0.5vw] right-[1vw] text-gray-400 hover:text-gray-600 text-[2vw] cursor-pointer"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {step === "form" ? "Login Required" : "Verify OTP"}
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          {step === "form"
            ? "Please provide your details to continue"
            : `Enter the OTP sent to ${formData.phone}`}
        </p>

        {step === "form" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.companyName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
              )}
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength="10"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="10-digit mobile number"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full bg-[#2F5755] cursor-pointer text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  if (errors.otp) setErrors({});
                }}
                maxLength="6"
                className={`w-full px-4 py-2 border rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.otp ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="000000"
              />
              {errors.otp && (
                <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
              )}
            </div>

            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="text-blue-600 text-sm hover:underline disabled:text-gray-400"
            >
              {loading ? "Resending..." : "Resend OTP"}
            </button>

            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6}
              className="w-full bg-green-600 cursor-pointer text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              Verify & Login
            </button>

            <button
              onClick={() => {
                setStep("form");
                setOtp("");
                setErrors({});
              }}
              className="w-full text-gray-600 py-2 text-sm hover:text-gray-800"
            >
              ← Back to form
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the token generator for use in Home.jsx
export { generateAuthToken };
