import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  LayoutDashboard, 
  Dumbbell, 
  BookOpen, 
  Home, 
  LogOut, 
  UserCheck 
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    {
      path: '/fisioterapeuta/dashboard',
      name: 'Panel General',
      icon: LayoutDashboard
    },
    {
      path: '/fisioterapeuta/ejercicios',
      name: 'Gestor de Ejercicios',
      icon: Dumbbell
    },
    {
      path: '/fisioterapeuta/revista',
      name: 'Editor de Revista',
      icon: BookOpen
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar Fijo Izquierdo */}
      <aside className="w-64 glass-panel border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 bg-white">
        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 px-2 group">
            <div className="bg-gradient-to-br from-emerald-500 to-blue-600 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
              <Activity className="h-5 w-5 font-bold" />
            </div>
            <span className="font-extrabold text-lg tracking-wider text-gradient-neon">
              MOVECARE<span className="text-slate-700">FISIO</span>
            </span>
          </Link>

          {/* Información del Profesional */}
          <div className="mb-8 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-slate-800 truncate">{userProfile?.nombre}</h4>
              <p className="text-xs text-emerald-600 font-extrabold uppercase tracking-wider">{userProfile?.rol}</p>
            </div>
          </div>

          {/* Enlaces de Navegación */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wide rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-l-4 border-emerald-500 text-emerald-600' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Cierre de Sesión y Home */}
        <div className="space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
          >
            <Home className="h-4.5 w-4.5" />
            Volver a la Web
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-left"
          >
            <LogOut className="h-4.5 w-4.5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área de Trabajo Dinámica */}
      <main className="flex-grow p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminSidebar;
