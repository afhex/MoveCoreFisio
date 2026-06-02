import React from 'react';
import { Trophy, Calendar, Clock, Activity, Dumbbell } from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const ejerciciosAsignados = [
    { titulo: 'Flexión de Rodilla con Banda', zona: 'Rodilla', repeticiones: '3 series x 12 reps', tiempo: '10 min', completado: true },
    { titulo: 'Estiramiento de Isquiotibiales', zona: 'Rodilla', repeticiones: 'Mantener 30s x 5 reps', tiempo: '5 min', completado: false },
    { titulo: 'Extensiones de Cuádriceps', zona: 'Rodilla', repeticiones: '3 series x 10 reps', tiempo: '12 min', completado: false }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 bg-slate-50 min-h-[85vh] text-left">
      {/* Saludo y Progreso Diario */}
      <div className="grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-extrabold tracking-wide text-slate-800">¡Hola, Paciente!</h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">Completa tu rutina asignada para hoy para acelerar tu recuperación muscular.</p>
        </div>
        
        {/* Anillo de progreso */}
        <div className="glass-panel p-4 rounded-3xl border border-slate-200 bg-white flex items-center justify-around shadow-sm">
          <div className="relative h-16 w-16 flex items-center justify-center">
            <svg className="absolute transform -rotate-90 w-full h-full">
              <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-slate-100" strokeWidth="4" fill="transparent" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-emerald-500" strokeWidth="4" fill="transparent" 
                strokeDasharray="175.9" strokeDashoffset="117.2" />
            </svg>
            <span className="text-xs font-extrabold text-emerald-600">1 / 3</span>
          </div>
          <div className="text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Progreso Diario</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase">33% completado</p>
          </div>
        </div>
      </div>

      {/* Tarjeta de Resumen Rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white text-center shadow-sm">
          <Calendar className="h-5 w-5 mx-auto text-emerald-650 mb-2" />
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Racha Activa</h4>
          <p className="text-lg font-extrabold text-slate-800 mt-0.5">5 Días</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white text-center shadow-sm">
          <Clock className="h-5 w-5 mx-auto text-blue-600 mb-2" />
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tiempo de Hoy</h4>
          <p className="text-lg font-extrabold text-slate-800 mt-0.5">15 Min</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white text-center shadow-sm col-span-2 sm:col-span-1">
          <Trophy className="h-5 w-5 mx-auto text-yellow-500 mb-2" />
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Logros Obtenidos</h4>
          <p className="text-lg font-extrabold text-slate-800 mt-0.5">3 Premios</p>
        </div>
      </div>

      {/* Lista de Ejercicios del Día */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-emerald-600" /> Mi Rutina de Hoy
        </h3>

        <div className="space-y-3">
          {ejerciciosAsignados.map((ej, index) => (
            <div 
              key={index}
              className={`p-4 rounded-3xl border transition-all flex items-center justify-between gap-4 ${
                ej.completado 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'glass-panel border-slate-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${ej.completado ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-extrabold ${ej.completado ? 'text-emerald-800/60 line-through' : 'text-slate-800'}`}>
                    {ej.titulo}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">
                    <span>{ej.repeticiones}</span>
                    <span>•</span>
                    <span>{ej.tiempo}</span>
                  </div>
                </div>
              </div>

              {ej.completado ? (
                <span className="px-3 py-1 rounded-lg bg-emerald-100 border border-emerald-250 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                  Completado
                </span>
              ) : (
                <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md">
                  Iniciar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
