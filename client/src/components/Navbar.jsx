import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userName");
    if (stored) setUserName(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  const goToCategory = (category) => {
    navigate("/?category=" + category);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2 className="logo" onClick={() => navigate("/")}>
🌍 𝔼𝕤𝕥𝕒𝕥𝕖𝕊𝕡𝕙𝕖𝕣𝕖
        </h2>

        <ul className="nav-links">
          <li onClick={() => (window.location.href = "/explorer")}>Blockchain</li>
          <li onClick={() => goToCategory("Buy")}>Buy</li>
          <li onClick={() => goToCategory("Rent")}>Rent</li>
          <li onClick={() => goToCategory("Commercial")}>Commercial</li>
          <li onClick={() => goToCategory("Projects")}>Projects</li>
        </ul>

        <div className="nav-right">
          <button
            className="post-btn"
            onClick={() => navigate("/post-property")}
          >
            Post Property
          </button>

          {userName ? (
            <>
              <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                Hi, {userName}
              </span>
              <button className="login-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
