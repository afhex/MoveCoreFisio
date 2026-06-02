import React from 'react';
import { Users, AlertTriangle, Activity, CheckSquare } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { name: 'Pacientes Activos', value: '18', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
    { name: 'Alertas de Dolor', value: '3', icon: AlertTriangle, color: 'text-red-650', bg: 'bg-red-50 border border-red-100' },
    { name: 'Sesiones de Hoy', value: '12', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50 border border-blue-100' },
    { name: 'Ejercicios Completados', value: '87%', valueSub: 'Semana actual', icon: CheckSquare, color: 'text-indigo-650', bg: 'bg-indigo-50 border border-indigo-100' },
  ];

  return (
    <div className="space-y-8 text-left bg-slate-50 min-h-[85vh]">
      {/* Cabecera */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-wide text-slate-800">Panel de Control Clínico</h1>
        <p className="text-slate-500 text-xs mt-1">Monitorea el estado físico general de tus pacientes y las alertas activas.</p>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
              <div>
                <p className="text-slate-500 text-xs font-extrabold uppercase tracking-wider mb-2">{stat.name}</p>
                <h3 className="text-3xl font-extrabold tracking-tight text-slate-800">{stat.value}</h3>
                {stat.valueSub && <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">{stat.valueSub}</p>}
              </div>
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Alertas y Pacientes Inactivos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tarjeta Alertas */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" /> Alertas de Dolor / Dificultad
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-100 rounded-2xl text-xs flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-slate-800">Elena Mendoza</h4>
                <p className="text-slate-500 mt-0.5 font-medium">Dolor agudo en extensión lateral</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-650 font-extrabold text-[9px] uppercase tracking-wider">Rodilla</span>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-2xl text-xs flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-slate-800">Carlos Pérez</h4>
                <p className="text-slate-500 mt-0.5 font-medium">Fatiga extrema al terminar serie</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-yellow-100 text-yellow-700 font-extrabold text-[9px] uppercase tracking-wider">Lumbar</span>
            </div>
          </div>
        </div>

        {/* Tarjeta Actividad */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" /> Sesiones Recientes
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-slate-800">Sofía Castro</h4>
                <p className="text-slate-500 mt-0.5 font-medium">Completó: Flexión de Rodilla en Camilla</p>
              </div>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Hace 10m</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-slate-800">Roberto Gómez</h4>
                <p className="text-slate-500 mt-0.5 font-medium">Completó: Estiramiento Lumbar Activo</p>
              </div>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Hace 1h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
