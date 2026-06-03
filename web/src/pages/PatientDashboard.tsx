import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { ProgresoPaciente, Ejercicio } from '../firebase/types';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Activity, 
  Dumbbell, 
  FolderHeart, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Video 
} from 'lucide-react';

interface EjercicioAsignadoLocal extends ProgresoPaciente {
  tituloEjercicio: string;
  zonaEjercicio: string;
  descripcionEjercicio: string;
  multimediaUrl?: string;
}

const PatientDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [rutina, setRutina] = useState<EjercicioAsignadoLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFichaOpen, setIsFichaOpen] = useState(true);

  // Estadísticas del día
  const [completadosHoy, setCompletadosHoy] = useState(0);
  const [totalHoy, setTotalHoy] = useState(0);

  const fetchPatientRoutine = async () => {
    if (!userProfile) return;
    setLoading(true);

    try {
      const patientRef = doc(db, 'usuarios', userProfile.id);
      const q = query(
        collection(db, 'progreso_pacientes'),
        where('usuario_id', '==', patientRef)
      );

      const snapshot = await getDocs(q);
      const list: EjercicioAsignadoLocal[] = [];

      for (const d of snapshot.docs) {
        const data = d.data() as ProgresoPaciente;
        
        // Resolver la referencia del ejercicio para obtener el título y la zona
        let titulo = 'Ejercicio General';
        let zona = 'General';
        let desc = '';
        let url = '';
        
        if (data.ejercicio_id) {
          const exDoc = await getDoc(data.ejercicio_id);
          if (exDoc.exists()) {
            const exData = exDoc.data() as Ejercicio;
            titulo = exData.titulo;
            zona = exData.zona_anatomica;
            desc = exData.descripcion;
            url = exData.multimedia_url;
          }
        }

        list.push({
          ...data,
          id: d.id,
          tituloEjercicio: titulo,
          zonaEjercicio: zona,
          descripcionEjercicio: desc,
          multimediaUrl: url
        });
      }

      // Ordenar por fecha
      list.sort((a, b) => a.fecha.seconds - b.fecha.seconds);

      setRutina(list);

      // Calcular ejercicios de hoy
      const hoyStr = new Date().toDateString();
      const deHoy = list.filter(item => {
        const itemFecha = item.fecha.toDate();
        return itemFecha.toDateString() === hoyStr;
      });

      setTotalHoy(deHoy.length);
      setCompletadosHoy(deHoy.filter(item => item.completado).length);

    } catch (error) {
      console.error("Error cargando rutina del paciente:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientRoutine();
  }, [userProfile]);

  // Completar Ejercicio
  const handleCompleteExercise = async (itemId: string) => {
    try {
      const docRef = doc(db, 'progreso_pacientes', itemId);
      await updateDoc(docRef, {
        completado: true,
        fecha: Timestamp.now()
      });

      // Recargar datos
      fetchPatientRoutine();
    } catch (error) {
      console.error("Error al completar ejercicio:", error);
    }
  };

  // Calcular IMC
  const calcularIMC = () => {
    if (!userProfile?.peso || !userProfile?.estatura) return '0.0';
    const alturaMetros = userProfile.estatura / 100;
    return (userProfile.peso / (alturaMetros * alturaMetros)).toFixed(1);
  };

  const getIMCColor = (imc: number) => {
    if (imc === 0) return 'text-slate-500';
    if (imc < 18.5) return 'text-amber-500';
    if (imc >= 18.5 && imc < 25) return 'text-emerald-600';
    if (imc >= 25 && imc < 30) return 'text-amber-500';
    return 'text-red-500';
  };

  const percentProgress = totalHoy > 0 ? Math.round((completadosHoy / totalHoy) * 100) : 0;
  const dashOffset = 175.9 - (175.9 * percentProgress) / 100;

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="text-slate-500 text-xs font-semibold tracking-wider mt-4">CARGANDO PANEL DE PACIENTE...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 bg-slate-50 min-h-[85vh] text-left">
      
      {/* Saludo y Progreso Diario */}
      <div className="grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-extrabold tracking-wide text-slate-800">¡Hola, {userProfile?.nombre}!</h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">Completa tu rutina asignada para hoy para acelerar tu recuperación muscular.</p>
        </div>
        
        {/* Anillo de progreso */}
        <div className="glass-panel p-4 rounded-3xl border border-slate-200 bg-white flex items-center justify-around shadow-sm">
          <div className="relative h-16 w-16 flex items-center justify-center">
            <svg className="absolute transform -rotate-90 w-full h-full">
              <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-slate-100" strokeWidth="4" fill="transparent" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-emerald-500" strokeWidth="4" fill="transparent" 
                strokeDasharray="175.9" strokeDashoffset={dashOffset} />
            </svg>
            <span className="text-xs font-extrabold text-emerald-600">{completadosHoy} / {totalHoy}</span>
          </div>
          <div className="text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Progreso Diario</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase">{percentProgress}% completado</p>
          </div>
        </div>
      </div>

      {/* Ficha de Salud / Expediente Médico Plegable */}
      <div className="glass-panel rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => setIsFichaOpen(!isFichaOpen)}
          className="w-full p-5 flex items-center justify-between font-bold text-slate-800 text-sm md:text-base border-b border-slate-100/50 hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FolderHeart className="h-5 w-5 text-emerald-600" /> Mi Ficha de Salud Kinesiológica
          </span>
          {isFichaOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
        </button>

        {isFichaOpen && (
          <div className="p-6 grid sm:grid-cols-3 gap-6">
            {/* Info Básica */}
            <div className="space-y-4 border-b sm:border-b-0 sm:border-r border-slate-150 pb-4 sm:pb-0 sm:pr-4">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <User className="h-4 w-4" /> Datos de Identificación
              </h4>
              <div className="space-y-1.5 text-xs text-slate-700 font-semibold">
                <p>Cédula: <span className="text-slate-500 font-medium">{userProfile?.cedula || 'No registrada'}</span></p>
                <p>Edad: <span className="text-slate-500 font-medium">{userProfile?.edad ? `${userProfile.edad} años` : 'No registrada'}</span></p>
                <p>Sexo: <span className="text-slate-500 font-medium capitalize">{userProfile?.sexo || 'No registrado'}</span></p>
              </div>
            </div>

            {/* Antropometría e IMC */}
            <div className="space-y-4 border-b sm:border-b-0 sm:border-r border-slate-150 pb-4 sm:pb-0 sm:pr-4">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Activity className="h-4 w-4" /> Indicadores Físicos
              </h4>
              <div className="space-y-1.5 text-xs text-slate-700 font-semibold">
                <p>Peso: <span className="text-slate-500 font-medium">{userProfile?.peso ? `${userProfile.peso} kg` : 'No registrado'}</span></p>
                <p>Estatura: <span className="text-slate-500 font-medium">{userProfile?.estatura ? `${userProfile.estatura} cm` : 'No registrada'}</span></p>
                <p>IMC: <span className={`font-extrabold ${getIMCColor(Number(calcularIMC()))}`}>{calcularIMC()} kg/m²</span></p>
              </div>
            </div>

            {/* Diagnóstico Clínico */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Trophy className="h-4 w-4 text-emerald-600" /> Diagnóstico Oficial
              </h4>
              <div className="space-y-2 text-xs">
                <p className="font-extrabold text-slate-800 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                  {userProfile?.diagnostico || 'Evaluación médica pendiente.'}
                </p>
                {userProfile?.discapacidad && (
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Discapacidad: <span className="text-slate-650 font-extrabold">{userProfile.discapacidad}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tarjetas de Resumen de Racha */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white text-center shadow-sm">
          <Calendar className="h-5 w-5 mx-auto text-emerald-650 mb-2" />
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tratamiento Activo</h4>
          <p className="text-lg font-extrabold text-slate-800 mt-0.5">{rutina.length} Asignados</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white text-center shadow-sm">
          <Clock className="h-5 w-5 mx-auto text-blue-600 mb-2" />
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Completados</h4>
          <p className="text-lg font-extrabold text-emerald-600 mt-0.5">{rutina.filter(r => r.completado).length}</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white text-center shadow-sm col-span-2 sm:col-span-1">
          <Trophy className="h-5 w-5 mx-auto text-yellow-500 mb-2" />
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Adherencia</h4>
          <p className="text-lg font-extrabold text-slate-800 mt-0.5">
            {rutina.length > 0 ? `${Math.round((rutina.filter(r => r.completado).length / rutina.length) * 100)}%` : '0%'}
          </p>
        </div>
      </div>

      {/* Lista de Ejercicios del Día */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-emerald-600" /> Mi Plan de Recuperación
        </h3>

        {rutina.length === 0 ? (
          <div className="p-8 rounded-3xl border border-slate-200 bg-white text-center text-slate-400 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider">AÚN NO TIENES EJERCICIOS ASIGNADOS</p>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Tu fisioterapeuta registrará tus rutinas de rehabilitación en esta pantalla.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rutina.map((item) => {
              const itemFecha = item.fecha.toDate();
              const fechaFormateada = itemFecha.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
              
              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                    item.completado 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                      : 'glass-panel border-slate-200 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl shrink-0 ${item.completado ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Activity className="h-5 w-5" />
                    </div>
                    <div className="text-left space-y-1">
                      <h4 className={`text-sm font-extrabold ${item.completado ? 'text-emerald-800/60 line-through' : 'text-slate-800'}`}>
                        {item.tituloEjercicio}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">{item.descripcionEjercicio}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{item.zonaEjercicio}</span>
                        <span>•</span>
                        <span>Programado: {fechaFormateada}</span>
                      </div>
                    </div>
                  </div>
 
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {item.completado ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                        Completado
                      </span>
                    ) : (
                      <>
                        {item.multimediaUrl && (
                          <a 
                            href={item.multimediaUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 hover:text-slate-800 text-slate-500 transition-all"
                            title="Ver Video Instructivo"
                          >
                            <Video className="h-4.5 w-4.5" />
                          </a>
                        )}
                        <button 
                          onClick={() => handleCompleteExercise(item.id)}
                          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md"
                        >
                          Iniciar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
