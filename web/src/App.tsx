import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminSidebar from './layouts/AdminSidebar';

// Páginas Públicas
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Revista from './pages/Revista';

// Páginas Privadas - Fisioterapeuta / Admin
import AdminDashboard from './pages/AdminDashboard';
import AdminExercises from './pages/AdminExercises';
import AdminRevista from './pages/AdminRevista';

// Páginas Privadas - Paciente
import PatientDashboard from './pages/PatientDashboard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* GRUPO DE RUTAS PÚBLICAS (Con Navbar Superior) */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="revista" element={<Revista />} />
            
            {/* Ruta del Catálogo simplificado (para la Landing) */}
            <Route path="ejercicios" element={
              <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
                <h1 className="text-3xl font-extrabold text-gradient-neon">Catálogo de Lesiones y Ejercicios</h1>
                <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                  Para visualizar todos los videos HD, instrucciones de estiramiento y contactar con un fisioterapeuta del Rumi Fisio Center, inicia sesión en tu cuenta.
                </p>
                <div className="pt-4">
                  <Navigate to="/login" replace />
                </div>
              </div>
            } />
          </Route>

          {/* RUTAS PROTEGIDAS - PACIENTES */}
          <Route path="/paciente" element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PublicLayout /> {/* Reutiliza el Navbar público para el paciente */}
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<PatientDashboard />} />
          </Route>

          {/* RUTAS PROTEGIDAS - FISIOTERAPEUTAS / ADMINS (Con Sidebar Lateral Fijo) */}
          <Route path="/fisioterapeuta" element={
            <ProtectedRoute allowedRoles={['fisioterapeuta', 'admin']}>
              <AdminSidebar />
            </ProtectedRoute>
          }>
            {/* Redirección automática de /fisioterapeuta a /fisioterapeuta/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="ejercicios" element={<AdminExercises />} />
            <Route path="revista" element={<AdminRevista />} />
          </Route>

          {/* Redirección por defecto para cualquier ruta no válida */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
