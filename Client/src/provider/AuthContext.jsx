import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { useRole } from './RoleProvider'; // Asegúrate de que esté importado correctamente

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Cargar el usuario del localStorage si existe
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const { setRole } = useRole(); // Usamos el contexto de roles para actualizar el role

  const login = (userData, jwt_token) => {
    // Eliminar la propiedad password del objeto userData antes de guardarlo
    const { password, ...userWithoutPassword } = userData[0]; // Esto eliminará 'password' del objeto
    console.log(userWithoutPassword);
    // Guardar los datos del usuario sin la contraseña en localStorage
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword)); // Guardamos sin la contraseña
    Cookies.set('token', jwt_token, { expires: 1 });

    // Aquí es donde asignas el role del usuario al contexto de RoleProvider
    const role = userWithoutPassword?.role; // Usamos el objeto sin la contraseña
    if (role) {
      setRole(role); // Establece el role en el RoleProvider
      localStorage.setItem('role', JSON.stringify(role)); // Persistir el role en localStorage
    }
  };


  const logout = () => {
    setUser(null);
    // Eliminar del localStorage
    localStorage.removeItem('user');
    setRole(null); // Limpiar el role en el contexto de roles
    localStorage.removeItem('role');
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
