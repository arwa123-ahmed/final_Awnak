import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "../login/loginstyle.module.css";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordWeak, setIsPasswordWeak] = useState(false);

  // if go to route without link
  if (!token || !email) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>Invalid reset link</p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      setError("All fields are required");
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      setError("Password does not meet requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://72.62.186.133/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Reset failed");
        setLoading(false);
        return;
      }

      setSuccess("Password reset successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <form onSubmit={handleSubmit}>
          <h3>Reset Password</h3>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          {/* New Password */}
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsPasswordWeak(!strongPasswordRegex.test(e.target.value));
            }}
          />

          {isPasswordWeak && (
            <ul className={styles.passwordRulesError}>
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character (@ # !)</li>
            </ul>
          )}

          {/* Confirm Password */}
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
