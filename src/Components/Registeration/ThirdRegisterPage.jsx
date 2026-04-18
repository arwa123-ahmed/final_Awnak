import React, { useContext, useState } from "react";
import registeStyle from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { registerationContext } from "../../Provider/RegistrationProvider";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const ThirdRegisterPage = () => {
  const [isPasswordWeak, setIsPasswordWeak] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useContext(registerationContext);
  const [registeration, setRegistration] = useState({
    email: data.email || "",
    password: data.password || "",
    confirmPassword: data.confirmPassword || "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistration((prev) => ({ ...prev, [name]: value }));
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    registeration.email?.trim() !== "" &&
    registeration.password?.trim() !== "" &&
    registeration.confirmPassword?.trim() !== "" &&
    registeration.password === registeration.confirmPassword &&
    strongPasswordRegex.test(registeration.password);

  const handleRegisteration = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = registeration;

    if (!email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!strongPasswordRegex.test(password)) {
      setError("Look at the rules for password");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.exists) {
        setError("Email already exists. Please use a different email.");
        return;
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again later.");
      return;
    }

    setError("");
    console.log("User Credentials:", registeration);
    navigate("/countinueregister3");
  };

  return (
    <div className={registeStyle.container}>
      <div className={registeStyle.regsterBox}>
        <div className={registeStyle.numberOfSteps}>
          <IoIosCheckmarkCircle size={40} color="#00bc7d" />
          <span className={registeStyle.arrowline}></span>
          <IoIosCheckmarkCircle size={40} color="#00bc7d" />
          <span className={registeStyle.arrowline}></span>
          <span className={registeStyle.active}>3</span>
          <span className={registeStyle.arrow}></span>
          <span className={registeStyle.number}>4</span>
        </div>

        <form onSubmit={handleRegisteration}>
          <h3>Create Account</h3>
          <Link to={"/countinueregister1"} className={registeStyle.backLink}>
            <IoMdArrowBack /> Back
          </Link>

          {error && <p className={registeStyle.error}>{error}</p>}

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={registeration.email}
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Enter password"
            name="password"
            value={registeration.password}
            onChange={(e) => {
              handleChange(e);
              setIsPasswordWeak(!strongPasswordRegex.test(e.target.value));
            }}
          />
          {isPasswordWeak && (
            <ul className={registeStyle.passwordRulesError}>
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character (@ # !)</li>
            </ul>
          )}

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            value={registeration.confirmPassword}
            onChange={handleChange}
          />

          <input
            type="submit"
            value="Next"
            className={!isFormValid ? registeStyle.disabledButton : ""}
          />
        </form>
      </div>
    </div>
  );
};

export default ThirdRegisterPage;
