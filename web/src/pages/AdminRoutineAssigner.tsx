import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, query, where, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Usuario, Ejercicio, ProgresoPaciente } from '../firebase/types';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  Dumbbell, 
  PlusCircle,
  FolderHeart,
  Save,
  CheckCircle2
} from 'lucide-react';

const AdminRoutineAssigner: React.FC = () => {
  const [patients, setPatients] = useState<Usuario[]>([]);
  const [exercises, setExercises] = useState<Ejercicio[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Usuario | null>(null);
  
  // Estados de Ficha Clínica
  const [cedula, setCedula] = useState('');
  const [edad, setEdad] = useState(0);
  const [peso, setPeso] = useState(0);
  const [estatura, setEstatura] = useState(0);
  const [sexo, setSexo] = useState<'masculino' | 'femenino' | 'otro'>('masculino');
  const [discapacidad, setDiscapacidad] = useState('Ninguna');
  const [diagnostico, setDiagnostico] = useState('');
  const [historialClinico, setHistorialClinico] = useState('');

  // Estadísticas del Paciente Seleccionado
  const [totalAsignados, setTotalAsignados] = useState(0);
  const [totalCompletados, setTotalCompletados] = useState(0);
  const [progresoSemanal, setProgresoSemanal] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]); // Lunes a Domingo

  // Estados de Asignación
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  const [assignDate, setAssignDate] = useState(new Date().toISOString().split('T')[0]);

  const [loading, setLoading] = useState(true);
  const [savingClinic, setSavingClinic] = useState(false);
  const [assigningRoutine, setAssigningRoutine] = useState(false);
  const [msgClinica, setMsgClinica] = useState('');
  const [msgRutina, setMsgRutina] = useState('');

  // Cargar pacientes y ejercicios
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Obtener pacientes
      const qPatients = query(collection(db, 'usuarios'), where('rol', '==', 'paciente'));
      const snapshotPatients = await getDocs(qPatients);
      const listPatients: Usuario[] = [];
      snapshotPatients.forEach((doc) => {
        listPatients.push({ id: doc.id, ...doc.data() } as Usuario);
      });
      setPatients(listPatients);

      // 2. Obtener ejercicios
      const snapshotExercises = await getDocs(collection(db, 'ejercicios'));
      const listExercises: Ejercicio[] = [];
      snapshotExercises.forEach((doc) => {
        listExercises.push({ id: doc.id, ...doc.data() } as Ejercicio);
      });
      setExercises(listExercises);

    } catch (error) {
      console.error("Error cargando datos del asignador:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Al seleccionar un paciente, cargar su ficha clínica y consultar sus estadísticas
  useEffect(() => {
    if (!selectedPatient) return;

    // Rellenar campos de Ficha Clínica
    setCedula(selectedPatient.cedula || '');
    setEdad(selectedPatient.edad || 0);
    setPeso(selectedPatient.peso || 0);
    setEstatura(selectedPatient.estatura || 0);
    setSexo(selectedPatient.sexo || 'masculino');
    setDiscapacidad(selectedPatient.discapacidad || 'Ninguna');
    setDiagnostico(selectedPatient.diagnostico || '');
    setHistorialClinico(selectedPatient.historial_clinico || '');

    // Cargar historial de progreso para calcular estadísticas y rendimiento
    const loadPatientStats = async () => {
      try {
        const patientRef = doc(db, 'usuarios', selectedPatient.id);
        const qProgreso = query(
          collection(db, 'progreso_pacientes'),
          where('usuario_id', '==', patientRef)
        );
        const snapshot = await getDocs(qProgreso);
        const list: ProgresoPaciente[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as ProgresoPaciente);
        });

        // Calcular totales
        setTotalAsignados(list.length);
        const completados = list.filter(p => p.completado).length;
        setTotalCompletados(completados);

        // Calcular progreso semanal de los últimos 7 días (Lunes a Domingo)
        const semanalData = [0, 0, 0, 0, 0, 0, 0];
        const hoy = new Date();
        
        list.forEach(p => {
          if (p.completado && p.fecha) {
            const fechaCompletado = p.fecha.toDate();
            // Comprobar si está en la semana actual
            const diffTime = Math.abs(hoy.getTime() - fechaCompletado.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 7) {
              // Obtener día de la semana (0: Domingo, 1: Lunes, etc.) y mapear (Lunes=0...Domingo=6)
              let dayIndex = fechaCompletado.getDay() - 1;
              if (dayIndex === -1) dayIndex = 6; // Domingo
              semanalData[dayIndex] += 1;
            }
          }
        });
        setProgresoSemanal(semanalData);

      } catch (error) {
        console.error("Error al cargar estadísticas del paciente:", error);
      }
    };

    loadPatientStats();
    setSelectedExercises(new Set());
  }, [selectedPatient]);

  // Actualizar Ficha Clínica en Firestore
  const handleUpdateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setSavingClinic(true);
    setMsgClinica('');

    try {
      const patientRef = doc(db, 'usuarios', selectedPatient.id);
      const updatedFields = {
        cedula,
        edad: Number(edad),
        peso: Number(peso),
        estatura: Number(estatura),
        sexo,
        discapacidad,
        diagnostico,
        historial_clinico: historialClinico
      };

      await updateDoc(patientRef, updatedFields);
      
      // Actualizar en el estado local de pacientes
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, ...updatedFields } : p));
      setSelectedPatient(prev => prev ? { ...prev, ...updatedFields } : null);

      setMsgClinica('¡Ficha médica actualizada con éxito!');
      setTimeout(() => setMsgClinica(''), 3000);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar la ficha clínica.");
    } finally {
      setSavingClinic(false);
    }
  };

  // Toggle selección de ejercicio
  const handleToggleExercise = (exId: string) => {
    const updated = new Set(selectedExercises);
    if (updated.has(exId)) {
      updated.delete(exId);
    } else {
      updated.add(exId);
    }
    setSelectedExercises(updated);
  };

  // Asignar Rutina a Paciente
  const handleAssignRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || selectedExercises.size === 0) return;
    setAssigningRoutine(true);
    setMsgRutina('');

    try {
      const patientRef = doc(db, 'usuarios', selectedPatient.id);
      
      // Separar la fecha picker en componentes locales para evitar desfasaje de zona horaria
      const [year, month, day] = assignDate.split('-').map(Number);
      const targetDate = new Date(year, month - 1, day, 12, 0, 0); // Asignado a mediodía local

      for (const exId of selectedExercises) {
        const exerciseRef = doc(db, 'ejercicios', exId);
        await addDoc(collection(db, 'progreso_pacientes'), {
          usuario_id: patientRef,
          ejercicio_id: exerciseRef,
          fecha: Timestamp.fromDate(targetDate),
          completado: false,
          observaciones: ''
        });
      }

      setMsgRutina(`¡${selectedExercises.size} ejercicio(s) asignados correctamente!`);
      setSelectedExercises(new Set());
      
      // Recargar estadísticas del paciente
      const qProgreso = query(
        collection(db, 'progreso_pacientes'),
        where('usuario_id', '==', patientRef)
      );
      const snapshot = await getDocs(qProgreso);
      setTotalAsignados(snapshot.size);
      setTotalCompletados(snapshot.docs.filter(d => d.data().completado).length);

      setTimeout(() => setMsgRutina(''), 3000);
    } catch (error) {
      console.error(error);
      alert("Error al asignar la rutina.");
    } finally {
      setAssigningRoutine(false);
    }
  };

  // Calcular IMC
  const calcularIMC = () => {
    if (peso <= 0 || estatura <= 0) return '0.0';
    const alturaMetros = estatura / 100;
    return (peso / (alturaMetros * alturaMetros)).toFixed(1);
  };

  const getIMCColor = (imc: number) => {
    if (imc === 0) return 'text-slate-500';
    if (imc < 18.5) return 'text-amber-500';
    if (imc >= 18.5 && imc < 25) return 'text-emerald-600';
    if (imc >= 25 && imc < 30) return 'text-amber-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="text-slate-500 text-xs font-semibold tracking-wider mt-4">CARGANDO MÓDULO CLÍNICO...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Cabecera */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-wide text-slate-800">Expediente Clínico & Rutinas</h1>
        <p className="text-slate-500 text-xs mt-1">Gestiona las fichas de salud de tus pacientes, analiza su evolución y prescríbeles ejercicios.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 items-start">
        
        {/* Columna 1: Panel de Pacientes */}
        <div className="lg:col-span-1 glass-panel p-4 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Users className="h-4.5 w-4.5 text-emerald-600" /> Pacientes
          </h3>

          {patients.length === 0 ? (
            <p className="text-slate-400 text-xs font-semibold py-8 text-center">NO HAY PACIENTES REGISTRADOS</p>
          ) : (
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {patients.map((pat) => (
                <button
                  key={pat.id}
                  onClick={() => setSelectedPatient(pat)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    selectedPatient?.id === pat.id
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    selectedPatient?.id === pat.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {pat.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs truncate">{pat.nombre}</p>
                    <p className="text-[10px] text-slate-400 font-semibold truncate">{pat.correo}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columnas 2 y 3: Detalles si se selecciona un paciente */}
        {selectedPatient ? (
          <>
            {/* Columna 2: Ficha Clínica y Estadísticas */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Formulario Ficha Clínica */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <FolderHeart className="h-4.5 w-4.5 text-emerald-600" /> Ficha Clínica de Salud
                  </h3>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                    ID: {selectedPatient.id.substring(0,6)}
                  </span>
                </div>

                {msgClinica && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 animate-bounce" />
                    <span>{msgClinica}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateClinic} className="space-y-4">
                  {/* Grid Cédula, Edad, Peso, Talla */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Cédula de Identidad</label>
                      <input
                        type="text"
                        placeholder="1712345678"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Edad</label>
                      <input
                        type="number"
                        placeholder="22"
                        value={edad || ''}
                        onChange={(e) => setEdad(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Peso (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="70.5"
                        value={peso || ''}
                        onChange={(e) => setPeso(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Estatura (cm)</label>
                      <input
                        type="number"
                        placeholder="175"
                        value={estatura || ''}
                        onChange={(e) => setEstatura(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Sexo Biológico</label>
                      <select
                        value={sexo}
                        onChange={(e) => setSexo(e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-700"
                      >
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Discapacidad</label>
                      <input
                        type="text"
                        placeholder="Ninguna / Física leve"
                        value={discapacidad}
                        onChange={(e) => setDiscapacidad(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Diagnóstico */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Diagnóstico Clínico Kinesiológico</label>
                    <input
                      type="text"
                      placeholder="Esguince de rodilla grado II o Tendinitis rotuliana"
                      value={diagnostico}
                      onChange={(e) => setDiagnostico(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-700"
                    />
                  </div>

                  {/* Historial Clínico Notas */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Notas e Historial Clínico</label>
                    <textarea
                      placeholder="Antecedentes quirúrgicos, observaciones de dolor, patologías previas..."
                      value={historialClinico}
                      onChange={(e) => setHistorialClinico(e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-700 resize-none"
                    />
                  </div>

                  {/* IMC Automático e Info */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="text-left">
                      <span className="text-[9px] font-extrabold uppercase text-slate-400">IMC Estimado</span>
                      <p className={`text-base font-extrabold ${getIMCColor(Number(calcularIMC()))}`}>{calcularIMC()} kg/m²</p>
                    </div>
                    <button
                      type="submit"
                      disabled={savingClinic}
                      className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-all shadow"
                    >
                      <Save className="h-4 w-4" /> {savingClinic ? 'Guardando...' : 'Actualizar Ficha'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Módulo de Gráficos de Evolución */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-600" /> Estadísticas y Adherencia al Tratamiento
                </h3>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase">Ejercicios Asignados</span>
                    <p className="text-xl font-extrabold text-slate-800 mt-0.5">{totalAsignados}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase">Ejercicios Completados</span>
                    <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{totalCompletados}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase">Adherencia Total</span>
                    <p className="text-xl font-extrabold text-blue-600 mt-0.5">
                      {totalAsignados > 0 ? `${Math.round((totalCompletados / totalAsignados) * 100)}%` : '0%'}
                    </p>
                  </div>
                </div>

                {/* Gráfico de barras SVG (Progreso Semanal) */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide block">Desempeño Semanal (Ejercicios completados por día)</span>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-end justify-between h-40 pt-8">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, index) => {
                      const cantidad = progresoSemanal[index];
                      // Altura máxima 80px para valor = 4. Si es más, escala.
                      const maxVal = Math.max(...progresoSemanal, 2);
                      const barHeight = (cantidad / maxVal) * 80;
                      return (
                        <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                          {/* Indicador de valor al pasar cursor */}
                          <span className="text-[10px] font-extrabold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            {cantidad}
                          </span>
                          {/* Barra de gráfico */}
                          <div 
                            style={{ height: `${Math.max(barHeight, 4)}px` }}
                            className={`w-8 rounded-t-lg transition-all ${
                              cantidad > 0 ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' : 'bg-slate-200'
                            }`}
                          />
                          <span className="text-[10px] font-bold text-slate-400">{dia}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Columna 3: Asignador de Ejercicios */}
            <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Dumbbell className="h-4.5 w-4.5 text-emerald-600" /> Prescribir Ejercicios
              </h3>

              {msgRutina && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 animate-bounce" />
                  <span>{msgRutina}</span>
                </div>
              )}

              <form onSubmit={handleAssignRoutine} className="space-y-4">
                {/* Selector de fecha */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> Fecha Programada
                  </label>
                  <input
                    type="date"
                    required
                    value={assignDate}
                    onChange={(e) => setAssignDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-700"
                  />
                </div>

                {/* Catálogo Checkbox */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Ejercicios Disponibles</label>
                  
                  {exercises.length === 0 ? (
                    <p className="text-slate-400 text-xs font-semibold py-8 text-center">NO HAY EJERCICIOS REGISTRADOS</p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {exercises.map((ex) => (
                        <div 
                          key={ex.id}
                          onClick={() => handleToggleExercise(ex.id)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                            selectedExercises.has(ex.id)
                              ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedExercises.has(ex.id)}
                            onChange={() => {}} // Manejado por el onClick del contenedor
                            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                          />
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-extrabold truncate">{ex.titulo}</p>
                            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{ex.zona_anatomica}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botón de Enviar */}
                <button
                  type="submit"
                  disabled={assigningRoutine || selectedExercises.size === 0}
                  className="w-full py-3.5 bg-blue-600 text-white font-extrabold tracking-widest text-xs uppercase rounded-xl shadow-md hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none transition-all flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="h-4.5 w-4.5" /> 
                  {assigningRoutine ? 'Asignando...' : 'Asignar Rutina'}
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Mensaje de Bienvenida / Seleccionar Paciente */
          <div className="lg:col-span-3 py-36 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="inline-flex bg-emerald-50 text-emerald-600 p-4 rounded-3xl border border-emerald-100">
              <UserCheck className="h-8 w-8" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg">GESTIÓN CLÍNICA DE PACIENTES</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              Selecciona un paciente del menú izquierdo para visualizar su Ficha Clínica, editar su expediente y prescribir sus rutinas semanales.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminRoutineAssigner;
