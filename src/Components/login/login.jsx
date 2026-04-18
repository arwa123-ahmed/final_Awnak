import React, { useState } from "react";
import styles from "./loginstyle.module.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email.trim() || !loginData.password.trim()) {
      setError("All fields are required");
      return;
    }

    if (loginData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://72.62.186.133/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok || data.message === "invalid credintial") {
        setError("Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("showRoleMessage", "true");

      window.location.href = "/";
    } catch (err) {
      setError("Network error, please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.loginBox} ${styles.inAnimation}`}>
        <form onSubmit={handleLogin}>
          <h3>Login</h3>

          {error && <p className={styles.error}>{error}</p>}

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
          />

          <p className={styles.bottomTextt}>
            <Link to="/forget">Forget password</Link>
          </p>

          <button type="submit" className={styles.loginBtn}>
            Login
          </button>

          <p className={styles.bottomText}>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
