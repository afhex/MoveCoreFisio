import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { Ejercicio } from '../firebase/types';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Upload, 
  Film, 
  ListPlus, 
  Trash,
  CheckCircle 
} from 'lucide-react';

const AdminExercises: React.FC = () => {
  const [exercises, setExercises] = useState<Ejercicio[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Ejercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZone, setFilterZone] = useState('todos');

  // Estados del Formulario (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [zone, setZone] = useState('rodilla');
  const [injuryType, setInjuryType] = useState('');
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'ejercicios'));
      const list: Ejercicio[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Ejercicio);
      });
      setExercises(list);
      setFilteredExercises(list);
    } catch (err) {
      console.error("Error cargando ejercicios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // Búsqueda y filtrado
  useEffect(() => {
    let result = exercises;

    if (searchTerm.trim() !== '') {
      result = result.filter(ex => 
        ex.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        ex.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.tipo_lesion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterZone !== 'todos') {
      result = result.filter(ex => ex.zona_anatomica.toLowerCase() === filterZone.toLowerCase());
    }

    setFilteredExercises(result);
  }, [searchTerm, filterZone, exercises]);

  // Manejo de Modal
  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setZone('rodilla');
    setInjuryType('');
    setInstructions(['']);
    setVideoFile(null);
    setExistingVideoUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (ex: Ejercicio) => {
    setEditingId(ex.id);
    setTitle(ex.titulo);
    setDescription(ex.descripcion);
    setZone(ex.zona_anatomica);
    setInjuryType(ex.tipo_lesion);
    setInstructions(ex.instrucciones.length > 0 ? ex.instrucciones : ['']);
    setVideoFile(null);
    setExistingVideoUrl(ex.multimedia_url);
    setIsModalOpen(true);
  };

  // Manejo de Instrucciones Dinámicas
  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addInstructionField = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstructionField = (index: number) => {
    const updated = [...instructions];
    updated.splice(index, 1);
    setInstructions(updated.length > 0 ? updated : ['']);
  };

  // Guardar Ejercicio
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProgressMsg('Procesando información...');

    try {
      let finalVideoUrl = existingVideoUrl;

      if (videoFile) {
        setProgressMsg('Subiendo video instructivo a Cloud Storage...');
        const fileName = `${Date.now()}_${videoFile.name}`;
        const storageRef = ref(storage, `ejercicios/${fileName}`);
        const snapshot = await uploadBytes(storageRef, videoFile);
        finalVideoUrl = await getDownloadURL(snapshot.ref);
      }

      const cleanInstructions = instructions.filter(inst => inst.trim() !== '');

      const ejercicioData = {
        titulo: title,
        descripcion: description,
        zona_anatomica: zone,
        tipo_lesion: injuryType,
        instrucciones: cleanInstructions,
        multimedia_url: finalVideoUrl
      };

      if (editingId) {
        setProgressMsg('Actualizando datos en Firestore...');
        await updateDoc(doc(db, 'ejercicios', editingId), ejercicioData);
      } else {
        setProgressMsg('Registrando ejercicio en Firestore...');
        await addDoc(collection(db, 'ejercicios'), ejercicioData);
      }

      setIsModalOpen(false);
      fetchExercises();
    } catch (err) {
      console.error("Error al guardar ejercicio:", err);
      alert("Hubo un error al intentar guardar el ejercicio.");
    } finally {
      setSaving(false);
      setProgressMsg('');
    }
  };

  // Eliminar Ejercicio
  const handleDelete = async (ex: Ejercicio) => {
    if (!window.confirm(`¿Estás seguro de eliminar el ejercicio "${ex.titulo}"?`)) return;

    try {
      if (ex.multimedia_url && ex.multimedia_url.startsWith('https://firebasestorage')) {
        try {
          const videoRef = ref(storage, ex.multimedia_url);
          await deleteObject(videoRef);
        } catch (e) {
          console.warn("No se pudo eliminar el archivo en Storage:", e);
        }
      }
      
      await deleteDoc(doc(db, 'ejercicios', ex.id));
      fetchExercises();
    } catch (err) {
      console.error("Error al eliminar ejercicio:", err);
      alert("Error al eliminar el ejercicio de Firestore.");
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide text-slate-800">Catálogo de Ejercicios</h1>
          <p className="text-slate-500 text-xs mt-1">Crea, edita y administra las rutinas y videos para tus pacientes.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-1.5 px-5 py-3.5 text-xs font-bold tracking-widest bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all uppercase shadow-md"
        >
          <Plus className="h-4.5 w-4.5 font-extrabold" /> NUEVO EJERCICIO
        </button>
      </div>

      {/* Buscador y Filtros */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Buscador */}
        <div className="relative sm:col-span-2">
          <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por ejercicio, descripción o lesión..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-semibold"
          />
        </div>

        {/* Filtro por Zona */}
        <div className="relative">
          <Filter className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-semibold appearance-none"
          >
            <option value="todos">Todas las Zonas</option>
            <option value="rodilla">Rodilla</option>
            <option value="lumbar">Lumbar</option>
            <option value="cuello">Cuello</option>
            <option value="hombro">Hombro</option>
            <option value="tobillo">Tobillo</option>
          </select>
        </div>
      </div>

      {/* Grid o Tabla de Resultados */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-slate-500 text-xs font-semibold tracking-wider mt-4">CARGANDO EJERCICIOS...</p>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-extrabold tracking-wider">NO SE ENCONTRARON EJERCICIOS</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  <th className="py-4.5 px-6">Ejercicio</th>
                  <th className="py-4.5 px-6">Zona Anatómica</th>
                  <th className="py-4.5 px-6">Tipo de Lesión</th>
                  <th className="py-4.5 px-6">Multimedia</th>
                  <th className="py-4.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredExercises.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-50 transition-all font-semibold text-xs">
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-slate-800 text-sm font-extrabold">{ex.titulo}</div>
                        <div className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">{ex.descripcion}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {ex.zona_anatomica}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{ex.tipo_lesion}</td>
                    <td className="py-4 px-6">
                      {ex.multimedia_url ? (
                        <span className="flex items-center gap-1 text-[11px] text-blue-600 font-extrabold">
                          <Film className="h-3.5 w-3.5" /> Video Listo
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Sin video</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(ex)}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 hover:text-emerald-600 transition-all text-slate-500"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ex)}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-slate-500"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal CRUD Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Cabecera Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-150 mb-6">
              <h2 className="text-xl font-extrabold tracking-wide text-slate-800">
                {editingId ? 'EDITAR EJERCICIO' : 'CREAR NUEVO EJERCICIO'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {saving && (
              <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span>{progressMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Título del Ejercicio</label>
                  <input
                    type="text"
                    required
                    placeholder="Estiramiento Isquiotibial"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Tipo de Lesión / Patología</label>
                  <input
                    type="text"
                    required
                    placeholder="Esguince o Post-quirúrgico"
                    value={injuryType}
                    onChange={(e) => setInjuryType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Zona Anatómica</label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-semibold"
                  >
                    <option value="rodilla">Rodilla</option>
                    <option value="lumbar">Lumbar</option>
                    <option value="cuello">Cuello</option>
                    <option value="hombro">Hombro</option>
                    <option value="tobillo">Tobillo</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Video del Ejercicio (MP4)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/mp4"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="video-upload-btn"
                    />
                    <label
                      htmlFor="video-upload-btn"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border border-dashed border-slate-350 rounded-xl cursor-pointer hover:border-emerald-500/50 hover:bg-slate-100 transition-all text-xs font-bold text-slate-500"
                    >
                      <Upload className="h-4.5 w-4.5" /> 
                      {videoFile ? videoFile.name : editingId ? 'Cambiar Video MP4' : 'Subir Video MP4'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Descripción del Ejercicio</label>
                <textarea
                  required
                  placeholder="Detalla los objetivos clínicos y los beneficios musculares de esta actividad..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-medium resize-none"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <ListPlus className="h-4.5 w-4.5" /> Pasos e Instrucciones
                  </label>
                  <button
                    type="button"
                    onClick={addInstructionField}
                    className="flex items-center gap-1 text-[10px] font-extrabold tracking-wider text-emerald-600 hover:text-emerald-700 uppercase transition-colors"
                  >
                    + Añadir Paso
                  </button>
                </div>

                <div className="space-y-2">
                  {instructions.map((inst, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="flex items-center justify-center h-10 w-10 shrink-0 bg-slate-50 border border-slate-200 text-xs font-extrabold rounded-xl text-slate-500">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Mantener estirada la pierna durante 30 segundos."
                        value={inst}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-medium"
                      />
                      {instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInstructionField(index)}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
                        >
                          <Trash className="h-4.5 w-4.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 text-xs font-extrabold uppercase tracking-widest bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 text-xs font-extrabold uppercase tracking-widest bg-emerald-600 text-white neon-button-glow hover:bg-emerald-700 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <CheckCircle className="h-4.5 w-4.5" /> 
                  {editingId ? 'GUARDAR CAMBIOS' : 'CREAR EJERCICIO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExercises;
