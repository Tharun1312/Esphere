import "./Register.css";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const validateName = (value) => /^[A-Za-z ]+$/.test(value);

  const getPasswordStrength = () => {
    if (password.length < 6) return "Weak ❌";
    if (!/\d/.test(password)) return "Weak (add a number) ❌";
    if (!/[A-Z]/.test(password)) return "Medium (add uppercase) ⚠️";
    if (!/[!@#$%^&*]/.test(password)) return "Medium (add symbol) ⚠️";
    return "Strong ✔";
  };

  const handleSubmit = async () => {
    if (!validateName(name)) return alert("Name can only contain letters!");
    if (!captchaChecked) return alert("Please verify you are human.");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        window.location.href = "/login";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Your Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Password Strength */}
        <p className="strength">Password Strength: {getPasswordStrength()}</p>

        {/* Captcha-like Checkbox */}
        <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            checked={captchaChecked}
            onChange={() => setCaptchaChecked(!captchaChecked)}
          />
          I am not a robot 🤖
        </label>

        {/* Submit */}
        <button onClick={handleSubmit}>Register</button>

        {/* Navigation */}
        <p className="login-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
