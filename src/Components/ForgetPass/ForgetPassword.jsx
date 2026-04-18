import React, { useState } from "react";
import styles from "../login/loginstyle.module.css";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/forget-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Email not found");
        setLoading(false);
        return;
      }

      setSuccess("A reset password link has been sent to your email.");
    } catch (err) {
      setError("Network error, please try again.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.loginBox} ${styles.inAnimation}`}>
        <form onSubmit={handleSubmit}>
          <h3>Forget Password</h3>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Sending..." : "Confirm Email"}
          </button>

          <p className={styles.bottomText}>
            Back to <Link to="/login">login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
