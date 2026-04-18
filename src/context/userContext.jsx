import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();
const BASE_URL = 'http://localhost:8000'; // ✅ أضيفي الـ BASE_URL هنا

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.user || data;
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ دالة لتحديث كل بيانات المستخدم
  const updateUser = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  // ✅ دالة لتحديث الصورة فقط
  const updateProfileImage = (newImagePath) => {
    setUser(prev => ({
      ...prev,
      id_image: newImagePath
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        updateUser,
        updateProfileImage,
        fetchUserData,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}