import React, { useContext, useState } from "react";
import registeStyle from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import Select from "react-select";
import { registerationContext } from "../../Provider/RegistrationProvider";

const SecondRegisterPage = () => {
  const [data, setData] = useContext(registerationContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const arabCountries = [
    "Egypt",
    "Saudi Arabia",
    "United Arab Emirates",
    "Kuwait",
    "Qatar",
    "Bahrain",
    "Oman",
    "Jordan",
    "Lebanon",
    "Syria",
    "Iraq",
    "Libya",
    "Sudan",
    "Palestine",
    "Morocco",
    "Tunisia",
    "Algeria",
    "Mauritania",
    "Yemen",
    "Somalia",
    "Comoros",
  ];

  const countryOptions = arabCountries.map((country) => ({
    value: country,
    label: country,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisteration = (e) => {
    e.preventDefault();

    if (!data.country || !data.region?.trim() || !data.street?.trim()) {
      setError("All fields are required");
      return;
    }

    if (data.region.trim() === data.street.trim()) {
      setError("Region and street cannot be the same");
      return;
    }

    setError("");
    navigate("/countinueregister2");
  };

  const isFormValid =
    data.country?.trim() && data.region?.trim() && data.street?.trim();

  return (
    <div className={registeStyle.container}>
      <div className={registeStyle.regsterBox}>
        <div className={registeStyle.numberOfSteps}>
          <IoIosCheckmarkCircle size={40} color="#00bc7d" />
          <span className={registeStyle.arrowline}></span>
          <span className={registeStyle.active}>2</span>
          <span className={registeStyle.arrow}></span>
          <span className={registeStyle.number}>3</span>
          <span className={registeStyle.arrow}></span>
          <span className={registeStyle.number}>4</span>
        </div>

        <form onSubmit={handleRegisteration}>
          <h3>Create Account</h3>

          <Link to="/register" className={registeStyle.backLink}>
            <IoMdArrowBack /> Back
          </Link>

          {error && <p className={registeStyle.error}>{error}</p>}

          <label>Country</label>
          <Select
            options={countryOptions}
            placeholder="Select or type your country"
            value={
              data.country ? { value: data.country, label: data.country } : null
            }
            onChange={(option) =>
              setData((prev) => ({
                ...prev,
                country: option.value,
              }))
            }
            isSearchable
          />

          <label>Region / City</label>
          <input
            name="region"
            value={data.region || ""}
            placeholder="Enter your region or city"
            onChange={handleChange}
          />

          <label>Street</label>
          <input
            name="street"
            value={data.street || ""}
            placeholder="Enter your street"
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

export default SecondRegisterPage;
