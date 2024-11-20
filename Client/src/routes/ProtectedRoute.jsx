import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthContext'; // Asegúrate de que `useAuth` se use para obtener el estado de autenticación
import { useRole } from '../provider/RoleProvider';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth(); // Obtener la información del usuario desde el contexto de autenticación
  const { role } = useRole(); // Obtener el rol del usuario desde el contexto de roles

  // Si el usuario está en proceso de verificación
  if (user === undefined) {
    return <div>Verificando autenticación...</div>;
  }

  // Si no hay usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no está permitido, redirige a la página principal
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderiza los hijos (componente protegido)
  return children;
};

export default ProtectedRoute;
