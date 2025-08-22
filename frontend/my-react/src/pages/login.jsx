import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // const [email, setEmail] = useState("");
  // const [emailOrPhone, setEmailOrPhone] = useState(""); // Rename for clarity
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {    
    setShowPassword(!showPassword);
  };

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:3000/api/owner/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ email, password }),
      // Update login payload
body: JSON.stringify({ emailOrPhone, password }),

    });

    const data = await res.json();
    console.log("res.ok:", res.ok);
    console.log("response data:", data);

    if (res.ok) {
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("token", data.token);  // ✅ add this
      alert("Login successful!");
      window.location.href = "/owner/health/fitness/with/choudhary/fitness/profile/user";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Server error");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter email or phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md"
            required
          />
      <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md pr-20" // Extra right padding for space
            required
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 cursor-pointer select-none"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
      </div>
      
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
