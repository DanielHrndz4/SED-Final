import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem('role');
    return storedRole ? JSON.parse(storedRole) : null;
  });

  useEffect(() => {
    if (role !== null) {
      localStorage.setItem('role', JSON.stringify(role));
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  return useContext(RoleContext);
};
