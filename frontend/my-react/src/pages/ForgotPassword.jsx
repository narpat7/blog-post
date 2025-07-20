import { useState } from "react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!emailOrPhone.trim()) {
      return setMessage("Please enter your email or phone number.");
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/owner/password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone }),
      });

      const data = await res.json();
      setMessage(data.message);
      if (res.ok) setStep(2);
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      return setMessage("All fields are required.");
    }

    if (newPassword !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/owner/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, otp, newPassword, confirmPassword }),
      });

      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setSuccess(true);
        setStep(1);
        setEmailOrPhone("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setMessage("Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>

      {step === 1 ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Email or Phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      )}

      {message && (
        <p className={`mt-4 text-sm ${success ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
