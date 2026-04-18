import React from "react";
import "./FeatureCard.css"; // ملف CSS للأنيميشن

const FeatureCard = ({ icon, title, description, index, colors }) => {
   const {
    cardColor = "#ffffff",
    textColor = "#2a3048",
    primaryColor = "#3fc361",
    accentColor = "#7dd55d",
  } = colors;

  return (
    <div
      className="card-hover fade-in"
      style={{
        backgroundColor: cardColor,
        animationDelay: `${index * 0.1}s`,
        borderRadius: "1.5rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        className="icon-bounce mb-6 flex justify-center"
        style={{
          color: primaryColor,
          animationDelay: `${index * 0.2}s`,
        }}
      >
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
        {title}
      </h3>

      <p className="text-lg opacity-80 leading-relaxed" style={{ color: textColor }}>
        {description}
      </p>

      <div
        className="mt-6 h-1 w-16 mx-auto rounded-full"
        style={{ backgroundColor: accentColor }}
      ></div>
    </div>
  );
};

export default FeatureCard;
