import "./Login.css";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const handleSubmit = async () => {
    if (!captchaChecked) return alert("Please verify you are human.");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // store token + username
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        alert("Login successful!");
        window.location.href = "/";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to Estethssphere</h2>

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

        <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            checked={captchaChecked}
            onChange={() => setCaptchaChecked(!captchaChecked)}
          />
          I am not a robot 🤖
        </label>

        <button onClick={handleSubmit}>Login</button>

        <p className="register-text">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
