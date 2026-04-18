import React, { createContext, useState } from "react";

// Create a context to share registration data across the application
export const registerationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  // State to store and update the registration data
  const [data, setData] = useState({});

  return (
    // Provide the shared data and its update to all child components
    <registerationContext.Provider value={[data, setData]}>
      {children} {/* Render all components wrapped by this provider */}
    </registerationContext.Provider>
  );
};
