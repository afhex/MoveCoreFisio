import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Activity, Trophy, ChevronRight } from 'lucide-react';
import DailyTip from '../components/DailyTip';
import BodyPartNavigator from '../components/BodyPartNavigator';

const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-slate-50 text-slate-800">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 text-emerald-600 text-xs font-extrabold tracking-widest uppercase">
          <Activity className="h-4 w-4 animate-pulse" /> Ecosistema de Tesis Rumi Fisio
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Lleva tu rehabilitación al <br />
          <span className="text-gradient-neon">Siguiente Nivel</span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-600 text-sm md:text-base font-semibold tracking-wide leading-relaxed">
          MoveCare Fisio es la plataforma que conecta a fisioterapeutas y pacientes en tiempo real. Monitorea tu progreso, realiza tus ejercicios asignados y edúcate con soporte científico.
        </p>

        {/* Tip del Día (Banner interactivo) */}
        <div className="max-w-2xl mx-auto">
          <DailyTip />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-xs font-extrabold tracking-widest rounded-2xl bg-emerald-600 text-white neon-button-glow hover:bg-emerald-700 transition-all uppercase"
          >
            INICIAR MI RECUPERACIÓN <ChevronRight className="h-4.5 w-4.5" />
          </Link>
          <Link
            to="/revista"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-xs font-extrabold tracking-widest rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-slate-600 uppercase"
          >
            LEER LA REVISTA CIENTÍFICA
          </Link>
        </div>
      </section>

      {/* Navegador Anatómico Interactivo ("Busca tu lesión") */}
      <section className="max-w-6xl mx-auto px-6 py-12 relative z-10 border-t border-slate-200/60">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/20 bg-teal-50 text-teal-600 text-[10px] font-extrabold tracking-widest uppercase mb-2">
            🩺 Mapa Anatómico Interactivo
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800">
            Busca tu lesión por zona del cuerpo
          </h2>
          <p className="text-slate-500 text-xs md:text-sm max-w-lg mx-auto">
            Haz clic en los puntos interactivos sobre la imagen del cuerpo humano para explorar las lesiones y ejercicios de rehabilitación de cada zona anatómica.
          </p>
        </div>

        <BodyPartNavigator />
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 py-12 relative z-10 border-t border-slate-200/60">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">¿Por qué MoveCare Fisio?</h2>
          <p className="text-slate-500 text-xs mt-1">Tecnología de punta adaptada al tratamiento kinesiológico moderno.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 hover:scale-102 transition-all neon-border-hover group bg-white">
            <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl w-fit mb-4 group-hover:scale-105 transition-transform">
              <Dumbbell className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Rutinas Personalizadas</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Videos HD instructivos cargados directamente por tu fisioterapeuta con guías ordenadas paso a paso para evitar errores.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 hover:scale-102 transition-all neon-border-hover group bg-white">
            <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl w-fit mb-4 group-hover:scale-105 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Monitoreo Sincronizado</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Tu progreso clínico en la aplicación móvil se sincroniza instantáneamente con la base de datos para que tu médico lo analice en la web.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 hover:scale-102 transition-all neon-border-hover group bg-white">
            <div className="bg-indigo-50 text-indigo-600 p-3.5 rounded-2xl w-fit mb-4 group-hover:scale-105 transition-transform">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Gamificación y Educación</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Registra niveles de dolor, observa tus anillos de progreso completados y mantente actualizado con la biblioteca científica.
            </p>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border-y border-slate-200 py-10 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h4 className="text-base font-extrabold text-emerald-600">¿Eres fisioterapeuta o docente?</h4>
            <p className="text-slate-500 text-xs">Regístrate para gestionar pacientes, subir videos de rehabilitación y redactar artículos.</p>
          </div>
          <Link
            to="/login?role=fisioterapeuta"
            className="w-full md:w-auto px-6 py-3.5 text-xs font-extrabold tracking-widest uppercase bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md"
          >
            REGISTRARME COMO PROFESIONAL
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
