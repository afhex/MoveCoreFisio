import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { FileText, Send, CheckCircle2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const AdminRevista: React.FC = () => {
  const { userProfile } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('prevencion');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const nuevoArticulo = {
        titulo: title,
        autor: userProfile?.nombre || 'Fisioterapeuta',
        contenido: content,
        categoria: category,
        fecha_publicacion: Timestamp.now()
      };

      await addDoc(collection(db, 'articulos_revista'), nuevoArticulo);

      setTitle('');
      setContent('');
      setSuccess(true);
    } catch (error) {
      console.error("Error al publicar artículo:", error);
      alert("Hubo un error al intentar publicar el artículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-left bg-slate-50 min-h-[85vh]">
      {/* Cabecera */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-wide text-slate-800">Editor de Artículos</h1>
        <p className="text-slate-500 text-xs mt-1">Redacta y publica información científica o de divulgación de rehabilitación para la Revista Digital.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5" />
          <span>¡Artículo publicado con éxito en la Revista Digital Pública!</span>
        </div>
      )}

      {/* Formulario */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Título */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Título del Artículo</label>
              <input
                type="text"
                required
                placeholder="Ej. Prevención de Lesiones de Ligamento Cruzado en Futbolistas"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-semibold"
              />
            </div>

            {/* Categoría */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Temática / Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-semibold"
              >
                <option value="prevencion">Prevención de Lesiones</option>
                <option value="nutricion">Nutrición Deportiva</option>
                <option value="estiramientos">Estiramientos y Movilidad</option>
                <option value="casos_clinicos">Casos Clínicos / Tesis</option>
              </select>
            </div>
          </div>

          {/* Contenido (Textarea) */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="h-4.5 w-4.5 text-slate-400" /> Cuerpo del Artículo (Formato Markdown)
            </label>
            <textarea
              required
              placeholder="Escribe el contenido de tu publicación en formato Markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-medium resize-none font-mono"
            />
          </div>

          {/* Botón de Enviar */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-emerald-600 text-white font-extrabold tracking-widest text-xs uppercase rounded-xl neon-button-glow hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Send className="h-4 w-4" /> PUBLICAR ARTÍCULO
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRevista;
