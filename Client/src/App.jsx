import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ViewQualifications from "./pages/view-qualifications/ViewQualifications";
import ViewRequests from "./pages/view-requests/ViewRequest";
import NewRequests from "./pages/new-requests/NewRequest";
import ViewStudents from "./pages/view-students/ViewStudents";
import ViewTeacher from "./components/ViewTeacher";
import ViewStudentsAdmin from "./components/ViewStudentsAdmin";
import AddTeachers from "./components/AddTeachers";
import AddStudents from "./components/AddStudents";
import { RoleProvider } from "./provider/RoleProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./provider/AuthContext";
import Login from "./pages/login/Login";
import UploadNotes from "./pages/upload-notes/UploadNotes";
import { URI } from "./assets/URI";

function App() {
  return (
    <RoleProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path={`${URI}/login`} element={<Login />} />
            <Route
              path={`${URI}/`}
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${URI}/ver-notas`}
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ViewQualifications />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${URI}/ver-solicitud`}
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ViewRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${URI}/nueva-solicitud`}
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <NewRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${URI}/ver-alumnos-inscritos`}
              element={
                <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                  <ViewStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${URI}/subir-notas`}
              element={
                <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                  <UploadNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${URI}/ver-maestros`}
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ViewTeacher />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${URI}/ver-alumnos`}
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ViewStudentsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${URI}/agregar-maestro`}
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddTeachers />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${URI}/agregar-alumno`}
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddStudents />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<h1>Page not found</h1>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </RoleProvider>
  );
}

export default App;
