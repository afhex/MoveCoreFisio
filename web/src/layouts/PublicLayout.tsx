import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, BookOpen, LogIn, LayoutDashboard, LogOut } from 'lucide-react';

const PublicLayout: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar Superior */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-emerald-500 to-blue-600 p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform">
            <Activity className="h-6 w-6 font-bold" />
          </div>
          <span className="font-extrabold text-xl tracking-wider text-gradient-neon">
            MOVECARE<span className="text-slate-700">FISIO</span>
          </span>
        </Link>

        {/* Links Principales */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm tracking-wide">
          <Link to="/" className="text-slate-600 hover:text-emerald-600 transition-colors">
            Inicio
          </Link>
          <Link to="/revista" className="text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1.5">
            <BookOpen className="h-4.5 w-4.5" /> Revista Digital
          </Link>
          <Link to="/ejercicios" className="text-slate-600 hover:text-emerald-600 transition-colors">
            Catálogo
          </Link>
        </nav>

        {/* Acciones de Login / Dashboard */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden sm:block">
                Hola, <span className="font-bold text-emerald-600">{userProfile?.nombre}</span>
              </span>
              <Link 
                to={userProfile?.rol === 'paciente' ? '/paciente/dashboard' : '/fisioterapeuta/dashboard'}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold tracking-wider rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
              >
                <LayoutDashboard className="h-4 w-4" /> PANEL
              </Link>
              <button 
                onClick={() => logout().then(() => navigate('/'))}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all text-slate-500"
                title="Cerrar Sesión"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold tracking-wider rounded-xl border border-emerald-600/30 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white neon-button-glow transition-all"
            >
              <LogIn className="h-4 w-4" /> INICIAR SESIÓN
            </Link>
          )}
        </div>
      </header>

      {/* Área Dinámica */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-widest text-emerald-600">MOVECARE FISIO</span>
            <span className="text-slate-300">|</span>
            <span>Desarrollo de Software - Rehabilitación Física</span>
          </div>
          <p>© {new Date().getFullYear()} AFHEX. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
