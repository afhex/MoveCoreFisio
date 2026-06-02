import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ArticuloRevista } from '../firebase/types';
import { BookOpen, Calendar, User, Clock, ChevronLeft } from 'lucide-react';

const Revista: React.FC = () => {
  const [articulos, setArticulos] = useState<ArticuloRevista[]>([]);
  const [selectedArticulo, setSelectedArticulo] = useState<ArticuloRevista | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const q = query(collection(db, 'articulos_revista'), orderBy('fecha_publicacion', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedList: ArticuloRevista[] = [];
        
        querySnapshot.forEach((doc) => {
          fetchedList.push({
            id: doc.id,
            ...doc.data()
          } as ArticuloRevista);
        });
        
        setArticulos(fetchedList);
      } catch (error) {
        console.error("Error al obtener artículos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticulos();
  }, []);

  const formatearFecha = (timestamp: any) => {
    if (!timestamp) return '';
    const fecha = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-extrabold">Cargando Revista Científica...</p>
        </div>
      </div>
    );
  }

  // Vista Expandida de un Artículo
  if (selectedArticulo) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-left bg-slate-50 min-h-[85vh]">
        <button
          onClick={() => setSelectedArticulo(null)}
          className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors uppercase mb-8"
        >
          <ChevronLeft className="h-4.5 w-4.5" /> VOLVER A LA REVISTA
        </button>

        <article className="space-y-6">
          <div className="inline-flex px-3 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-extrabold uppercase tracking-wider">
            {selectedArticulo.categoria}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-800">
            {selectedArticulo.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-y border-slate-200 py-4">
            <div className="flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-slate-400" />
              <span>Por: <span className="font-extrabold text-slate-700">{selectedArticulo.autor}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-slate-400" />
              <span>{formatearFecha(selectedArticulo.fecha_publicacion)}</span>
            </div>
          </div>

          {/* Cuerpo del Artículo */}
          <div className="prose max-w-none text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap pt-4 font-medium">
            {selectedArticulo.contenido}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-slate-50 min-h-[85vh]">
      <div className="text-center mb-16 space-y-2">
        <div className="inline-flex bg-gradient-to-br from-emerald-500 to-blue-600 p-2.5 rounded-2xl text-white mb-4">
          <BookOpen className="h-6 w-6 font-bold" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">REVISTA DIGITAL CIENTÍFICA</h1>
        <p className="text-slate-500 text-xs max-w-lg mx-auto font-medium">
          Casos clínicos, proyectos de investigación kinesiológica y guías de salud escritas por estudiantes y profesionales de la universidad.
        </p>
      </div>

      {articulos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-extrabold tracking-wider">NO HAY ARTÍCULOS PUBLICADOS EN ESTE MOMENTO</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articulos.map((articulo) => (
            <div
              key={articulo.id}
              onClick={() => setSelectedArticulo(articulo)}
              className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white hover:scale-102 transition-all cursor-pointer group flex flex-col justify-between hover:border-emerald-500/30"
            >
              <div>
                {/* Categoría */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest">
                    {articulo.categoria}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-[11px] font-bold">
                    <Clock className="h-3.5 w-3.5" /> 5 min
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors mb-3 line-clamp-2 text-left">
                  {articulo.titulo}
                </h3>

                {/* Vista Previa Contenido */}
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-6 text-left font-medium">
                  {articulo.contenido}
                </p>
              </div>

              {/* Autor y Fecha */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-300" />
                  <span>{articulo.autor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-300" />
                  <span>{formatearFecha(articulo.fecha_publicacion)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Revista;
