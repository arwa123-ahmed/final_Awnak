import React, { useContext, useState } from "react";
import registeStyle from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  registerationContext,
  RegistrationProvider,
} from "../../Provider/RegistrationProvider";

const MainRegisterationComponent = () => {
  // Access shared registration data and its updater from context
  const [data, setData] = useContext(registerationContext);

  // Used to navigate to the next registration step
  const navigate = useNavigate();

  // Local state for storing error messages
  const [error, setError] = useState("");

  // Validation: fullname must not be empty AND ID image must be uploaded
  const isFormValid = data.fullname?.trim() !== "" && data.gender;

  // Handle form
  const handleRegisteration = (e) => {
    e.preventDefault();

    // If required fields are missing, show error
    if (!data.fullname?.trim() && !data.gender) {
      setError("All fields are required");
      return;
    }
    //added for specifying error messages
    if (!data.fullname?.trim() && data.gender) {
      setError("Full name is required");
      return;
    }
    if (data.fullname?.trim() && !data.gender) {
      setError("select your gender is required");
      return;
    }

    // Clear error and go to the next step
    setError("");
    navigate("/countinueregister1");
  };

  // Handle input changes for both text and file inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // If file input → store the file, else store text value
    setData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div className={registeStyle.container}>
      <div className={`${registeStyle.regsterBox} ${registeStyle.inAnimation}`}>
        {/* Steps indicator (1 to 4) */}
        <div className={registeStyle.numberOfSteps}>
          <span className={registeStyle.active}>1</span>
          <span className={registeStyle.arrow}></span>
          <span className={registeStyle.number}>2</span>
          <span className={registeStyle.arrow}></span>
          <span className={registeStyle.number}>3</span>
          <span className={registeStyle.arrow}></span>
          <span className={registeStyle.number}>4</span>
        </div>

        {/* Registration form */}
        <form method="post" onSubmit={handleRegisteration}>
          <h3>Create Account</h3>

          {/* Show error message if it exists */}
          {error && <p className={registeStyle.error}>{error}</p>}

          {/* Full name input */}
          <label>Full name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            name="fullname"
            value={data.fullname || ""}
            onChange={handleChange}
          />
          {/* select gender */}
          <label>Gender</label>
          <select
            name="gender"
            value={data.gender || ""}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Upload ID image */}
          {/* <label>Upload ID card / Passport image</label>
          <input
            type="file"
            name="idImage"
            accept="image/*"
            onChange={handleChange}
          /> */}

          {/* Next button (disabled until form is valid) */}
          <input
            type="submit"
            value="Next"
            className={!isFormValid ? registeStyle.disabledButton : ""}
          />

          {/* Link to login page */}
          <p>
            Already have an account? <Link to={"/login"}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default MainRegisterationComponent;
