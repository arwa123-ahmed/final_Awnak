import React, { useState, useContext } from "react";
import registeStyle from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { IoIosCheckmarkCircle, IoIosSend } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { registerationContext } from "../../Provider/RegistrationProvider";

const LastRegisterPage = () => {
  const navigate = useNavigate();
  const [data] = useContext(registerationContext); // data.email, data.fullname, etc.

  const [step, setStep] = useState(1); // 1 = phone input, 2 = OTP input
  const [localState, setLocalState] = useState({ phone: "", otp: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (step === 1) {
        // Validate phone
        if (!localState.phone.trim())
          throw new Error("Please enter your phone number.");
        if (localState.phone.length !== 11)
          throw new Error("Phone must be 11 digits.");

        // Send OTP
        const response = await fetch("http://127.0.0.1:8000/api/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // مهم جدا
          },
          body: JSON.stringify({ email: data.email }),
        });

        const resData = await response.json();

        if (!response.ok)
          throw new Error(resData.message || "Failed to send OTP");

        setStep(2);
      } else if (step === 2) {
        // Validate OTP
        if (!localState.otp.trim())
          throw new Error("Please enter the verification code.");
        if (localState.otp.length !== 4)
          throw new Error("OTP must be 4 digits.");

        // Verify OTP
        const verifyRes = await fetch("http://127.0.0.1:8000/api/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: data.email, otp: localState.otp }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok)
          throw new Error(verifyData.message || "OTP verification failed");

        // Send registration data
       const formData = new FormData();
       console.log("data from context:", data);
console.log("Sending:", {
  name: data.fullname,
  nationality: data.country,
  city: data.region,
  street: data.street,
  email: data.email,
  gender: data.gender,
  password: data.password,
  phone: localState.phone,
});
formData.append("name", data.fullname);
formData.append("gender", data.gender);
formData.append("nationality", data.country);
// formData.append("country", data.country); 
formData.append("city", data.region);
formData.append("street", data.street);
formData.append("email", data.email);

formData.append("password", data.password);
formData.append("phone", localState.phone);



        const registerRes = await fetch("http://127.0.0.1:8000/api/register", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        const registerData = await registerRes.json();
        if (!registerRes.ok)
          throw new Error(registerData.message || "Registration failed");

        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    (step === 1 && localState.phone.trim().length === 11) ||
    (step === 2 && localState.otp.trim().length === 4);

  return (
    <div className={registeStyle.container}>
      <div className={registeStyle.regsterBox}>
        <div className={registeStyle.numberOfSteps}>
          <IoIosCheckmarkCircle size={40} color="#00bc7d" />
          <span className={registeStyle.arrowline}></span>
          <IoIosCheckmarkCircle size={40} color="#00bc7d" />
          <span className={registeStyle.arrowline}></span>
          <IoIosCheckmarkCircle size={40} color="#00bc7d" />
          <span className={registeStyle.arrowline}></span>
          <span className={registeStyle.active}>4</span>
        </div>

        <form onSubmit={handleSubmit}>
          <h3>
            {step === 1 ? "Enter Your Phone Number" : "Verify Your Number"}
          </h3>

          <Link to={"/countinueregister2"} className={registeStyle.backLink}>
            <IoMdArrowBack /> Back
          </Link>

          {error && <p className={registeStyle.error}>{error}</p>}

          {step === 1 ? (
            <>
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                name="phone"
                value={localState.phone}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <p>
                We sent a verification code to <strong>{data.email}</strong>
              </p>
              <label>Enter OTP</label>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={localState.otp}
                onChange={handleChange}
                maxLength={4}
              />
            </>
          )}

          <button
            type="submit"
            className={`${
              !isFormValid || loading
                ? registeStyle.disabledButton
                : registeStyle.mainButton
            }`}
            disabled={!isFormValid || loading}
          >
            <IoIosSend /> {step === 1 ? "Next" : "Verify & Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LastRegisterPage;
