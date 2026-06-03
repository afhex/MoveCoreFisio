import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Ejercicio } from '../firebase/types';
import { useAuth } from '../context/AuthContext';
import { Video, AlertCircle, ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';

// ─────────────────────────────────────────────────
// DATA: Zonas anatómicas con sus lesiones completas
// ─────────────────────────────────────────────────

interface ZonaAnatomica {
  id: string;
  nombre: string;
  icono: string;
  lesiones: string[];
}

const ZONAS_ANATOMICAS: ZonaAnatomica[] = [
  {
    id: 'cabeza',
    nombre: 'Cabeza',
    icono: '👤',
    lesiones: [
      'Cefalea tensional', 'Migraña y Cefaleas', 'Disfunción de la ATM / Mandíbula',
      'Dolor de cabeza', 'Vértigo y Mareo de origen cervical', 'Neuralgia de Arnold'
    ]
  },
  {
    id: 'cuello',
    nombre: 'Cuello / Cervical',
    icono: '💆',
    lesiones: [
      'Cervicalgia', 'Dolor cervical', 'Hernia discal cervical',
      'Latigazo cervical', 'Protrusión discal cervical', 'Tortícolis'
    ]
  },
  {
    id: 'hombro',
    nombre: 'Hombro',
    icono: '💪',
    lesiones: [
      'Artrosis de hombro', 'Bursitis subacromial', 'Dolor de hombro',
      'Hombro congelado', 'Luxación de hombro', 'Rotura del manguito rotador',
      'Síndrome subacromial', 'Tendinitis del supraespinoso'
    ]
  },
  {
    id: 'codo',
    nombre: 'Codo',
    icono: '💪',
    lesiones: [
      'Bursitis de codo', 'Dolor de codo', 'Epicondilitis (codo de tenista)',
      'Epitrocleitis (codo de golfista)', 'Fractura de codo'
    ]
  },
  {
    id: 'muneca',
    nombre: 'Muñeca y Manos',
    icono: '✋',
    lesiones: [
      'Artrosis del pulgar o Rizartrosis', 'Dedo en gatillo - dedo en resorte',
      'Dolor de muñeca', 'Fractura de muñeca',
      'Ganglión de muñeca o Quiste sinovial', 'Otras lesiones de muñeca y mano',
      'Síndrome de Dupuytren', 'Síndrome de túnel carpiano',
      'Tendinitis de Quervain'
    ]
  },
  {
    id: 'dorsal',
    nombre: 'Espalda / Dorsal',
    icono: '🔙',
    lesiones: [
      'Contractura muscular dorsal', 'Dolor dorsal', 'Dorsalgia',
      'Escoliosis', 'Hernia discal dorsal'
    ]
  },
  {
    id: 'lumbar',
    nombre: 'Lumbar / Espalda baja',
    icono: '🧍',
    lesiones: [
      'Ciática', 'Discopatía degenerativa', 'Dolor lumbar', 'Espondilolistesis',
      'Hernia discal lumbar', 'Lumbalgia', 'Protrusión discal', 'Síndrome facetario'
    ]
  },
  {
    id: 'cadera',
    nombre: 'Cadera y Pierna',
    icono: '🦴',
    lesiones: [
      'Artrosis de cadera', 'Dismetría o pierna corta', 'Dolor de cadera',
      'Necrosis avascular de la cadera', 'Pubalgia',
      'Otras lesiones de cadera, pelvis y pierna', 'Pinzamiento femoroacetabular',
      'Prótesis de cadera', 'Rotura de fibras de aductor',
      'Rotura de fibras de isquiotibial', 'Rotura de fibras de recto anterior del cuádriceps',
      'Sacroileitis', 'Síndrome piramidal', 'Tendinitis del psoas',
      'Trocanteritis - Bursitis trocanterea'
    ]
  },
  {
    id: 'rodilla',
    nombre: 'Rodilla',
    icono: '🦵',
    lesiones: [
      'Artrosis de rodilla', 'Condromalacia rotuliana', 'Dolor de rodilla',
      'Esguince de ligamento lateral', 'Lesión de ligamento cruzado anterior',
      'Lesión de ligamento cruzado posterior', 'Lesión de menisco',
      'Rotura de ligamento lateral', 'Síndrome de banda iliotibial',
      'Tendinitis rotuliana'
    ]
  },
  {
    id: 'tobillo',
    nombre: 'Tobillo y Pantorrilla',
    icono: '🦵',
    lesiones: [
      'Dolor de tobillo', 'Esguince de tobillo', 'Fracturas de peroné', 'Fracturas de tibia',
      'Tendinitis de Aquiles', 'Rotura del tendón de Aquiles'
    ]
  },
  {
    id: 'pie',
    nombre: 'Pie',
    icono: '🦶',
    lesiones: [
      'Dedo en martillo', 'Dedos en garra', 'Dolor de pies', 'Espolón calcáneo',
      'Fascitis plantar', 'Fractura de calcáneo', 'Fracturas de pie', 'Fracturas por estrés',
      'Gota', 'Hallux Valgus - Juanete', 'Metatarsalgia', 'Neuroma de Morton',
      'Pie cavo', 'Pie plano', 'Síndrome de Sever', 'Síndrome de túnel del tarso'
    ]
  }
];

// ─────────────────────────────────────────────────
// DATA: Posiciones de hotspots sobre las imágenes
// ─────────────────────────────────────────────────

interface HotspotPosition {
  zonaId: string;
  top: string;
  left: string;
  view: 'front' | 'back';
}

// Hotspots posicionados sobre las partes exactas del cuerpo anatómico
const HOTSPOTS: HotspotPosition[] = [
  // === VISTA FRONTAL ===
  { zonaId: 'cabeza', top: '7%', left: '50%', view: 'front' },
  { zonaId: 'cuello', top: '15%', left: '50%', view: 'front' },
  { zonaId: 'hombro', top: '21%', left: '38%', view: 'front' },
  { zonaId: 'hombro', top: '21%', left: '62%', view: 'front' },
  { zonaId: 'codo', top: '35%', left: '37%', view: 'front' },
  { zonaId: 'codo', top: '35%', left: '62%', view: 'front' },
  { zonaId: 'muneca', top: '54%', left: '33%', view: 'front' },
  { zonaId: 'muneca', top: '54%', left: '67%', view: 'front' },
  { zonaId: 'cadera', top: '44%', left: '43%', view: 'front' },
  { zonaId: 'cadera', top: '44%', left: '57%', view: 'front' },
  { zonaId: 'rodilla', top: '72%', left: '45%', view: 'front' },
  { zonaId: 'rodilla', top: '72%', left: '55%', view: 'front' },
  { zonaId: 'tobillo', top: '89%', left: '45%', view: 'front' },
  { zonaId: 'tobillo', top: '89%', left: '55%', view: 'front' },
  { zonaId: 'pie', top: '95%', left: '44%', view: 'front' },
  { zonaId: 'pie', top: '95%', left: '56%', view: 'front' },

  // === VISTA POSTERIOR ===
  { zonaId: 'cabeza', top: '6%', left: '50%', view: 'back' },
  { zonaId: 'cuello', top: '14%', left: '50%', view: 'back' },
  { zonaId: 'dorsal', top: '24%', left: '50%', view: 'back' },
  { zonaId: 'lumbar', top: '37%', left: '50%', view: 'back' },
  { zonaId: 'cadera', top: '47%', left: '43%', view: 'back' },
  { zonaId: 'cadera', top: '47%', left: '57%', view: 'back' },
  { zonaId: 'rodilla', top: '70%', left: '45%', view: 'back' },
  { zonaId: 'rodilla', top: '70%', left: '55%', view: 'back' },
  { zonaId: 'tobillo', top: '94%', left: '44%', view: 'back' },
  { zonaId: 'tobillo', top: '94%', left: '56%', view: 'back' },
];

// ─────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────

const BodyPartNavigator: React.FC = () => {
  const [selectedZona, setSelectedZona] = useState<ZonaAnatomica | null>(null);
  const [selectedLesion, setSelectedLesion] = useState<string | null>(null);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [loadingEjercicios, setLoadingEjercicios] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch exercises when a specific lesion is selected
  useEffect(() => {
    if (!selectedLesion) {
      setEjercicios([]);
      return;
    }

    const fetchEjercicios = async () => {
      setLoadingEjercicios(true);
      try {
        const q = query(
          collection(db, 'ejercicios'),
          where('tipo_lesion', '==', selectedLesion)
        );
        const querySnapshot = await getDocs(q);
        const list: Ejercicio[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Ejercicio);
        });
        setEjercicios(list);
      } catch (error) {
        console.error("Error al obtener ejercicios por lesión:", error);
      } finally {
        setLoadingEjercicios(false);
      }
    };

    fetchEjercicios();
  }, [selectedLesion]);

  const handleZonaClick = (zonaId: string) => {
    const zona = ZONAS_ANATOMICAS.find(z => z.id === zonaId);
    if (zona) {
      setSelectedZona(zona);
      setSelectedLesion(null);
    }
  };

  const handleLesionClick = (lesion: string) => {
    setSelectedLesion(lesion);
  };

  const handleBackToLesiones = () => {
    setSelectedLesion(null);
  };

  const handleBackToZonas = () => {
    setSelectedZona(null);
    setSelectedLesion(null);
  };

  const handleAction = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/paciente/dashboard');
    }
  };

  // Find the zona name for a hotspot
  const getZonaNombre = (zonaId: string): string => {
    return ZONAS_ANATOMICAS.find(z => z.id === zonaId)?.nombre || zonaId;
  };

  return (
    <div className="space-y-6">
      {/* ── Top: Anatomy Image Map ── */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Vista Posterior (Espalda) */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
            Vista Posterior
          </span>
          <div className="relative bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
            <img
              src="/images/body-back.png"
              alt="Vista posterior del cuerpo humano - sistema muscular"
              className="w-full h-auto"
              draggable={false}
            />
            {/* Hotspots de la vista posterior */}
            {HOTSPOTS.filter(h => h.view === 'back').map((hotspot, i) => (
              <button
                key={`back-${i}`}
                type="button"
                className={`hotspot-dot ${selectedZona?.id === hotspot.zonaId ? 'active' : ''}`}
                style={{ top: hotspot.top, left: hotspot.left }}
                onClick={() => handleZonaClick(hotspot.zonaId)}
                aria-label={`Ver lesiones de ${getZonaNombre(hotspot.zonaId)}`}
              >
                <span className="hotspot-plus">+</span>
                <span className="hotspot-tooltip">{getZonaNombre(hotspot.zonaId)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Vista Frontal */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
            Vista Frontal
          </span>
          <div className="relative bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
            <img
              src="/images/body-front.png"
              alt="Vista frontal del cuerpo humano - sistema muscular"
              className="w-full h-auto"
              draggable={false}
            />
            {/* Hotspots de la vista frontal */}
            {HOTSPOTS.filter(h => h.view === 'front').map((hotspot, i) => (
              <button
                key={`front-${i}`}
                type="button"
                className={`hotspot-dot ${selectedZona?.id === hotspot.zonaId ? 'active' : ''}`}
                style={{ top: hotspot.top, left: hotspot.left }}
                onClick={() => handleZonaClick(hotspot.zonaId)}
                aria-label={`Ver lesiones de ${getZonaNombre(hotspot.zonaId)}`}
              >
                <span className="hotspot-plus">+</span>
                <span className="hotspot-tooltip">{getZonaNombre(hotspot.zonaId)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick zone selector buttons ── */}
      <div className="flex flex-wrap justify-center gap-2">
        {ZONAS_ANATOMICAS.map((zona) => (
          <button
            key={zona.id}
            onClick={() => handleZonaClick(zona.id)}
            className={`px-4 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              selectedZona?.id === zona.id
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <span>{zona.icono}</span>
            <span>{zona.nombre}</span>
          </button>
        ))}
      </div>

      {/* ── Bottom: Results Panel (Lesiones / Ejercicios) ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[200px]">
        {/* No zone selected */}
        {!selectedZona && (
          <div className="p-10 text-center">
            <div className="text-4xl mb-3">🩺</div>
            <h3 className="font-extrabold text-slate-700 text-sm uppercase tracking-wider mb-1">
              Selecciona una zona del cuerpo
            </h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Haz clic en los puntos interactivos sobre la imagen anatómica o en los botones de zona para ver las lesiones y dolencias comunes de esa área.
            </p>
          </div>
        )}

        {/* Zone selected: show lesions or exercises */}
        {selectedZona && !selectedLesion && (
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <button
                onClick={handleBackToZonas}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-500"
                title="Volver"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedZona.icono}</span>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base uppercase tracking-wide">
                    Lesiones de <span className="text-teal-600">{selectedZona.nombre}</span>
                  </h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    {selectedZona.lesiones.length} condiciones registradas — Selecciona una para ver ejercicios
                  </p>
                </div>
              </div>
            </div>

            {/* Lesion Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 anatomy-scroll max-h-[350px] overflow-y-auto pr-1">
              {selectedZona.lesiones.map((lesion, index) => (
                <button
                  key={index}
                  onClick={() => handleLesionClick(lesion)}
                  className="lesion-card text-left p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-200 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-teal-700 leading-snug">
                      {lesion}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-teal-500 shrink-0 mt-0.5 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lesion selected: show exercises */}
        {selectedZona && selectedLesion && (
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <button
                onClick={handleBackToLesiones}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-500"
                title="Volver a lesiones"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  <span>{selectedZona.icono}</span>
                  <span>{selectedZona.nombre}</span>
                  <span className="text-slate-300">›</span>
                  <span className="text-teal-600">{selectedLesion}</span>
                </div>
                <h3 className="font-extrabold text-slate-800 text-base tracking-wide">
                  Ejercicios para <span className="text-teal-600">{selectedLesion}</span>
                </h3>
              </div>
            </div>

            {/* Exercise List */}
            {loadingEjercicios ? (
              <div className="py-10 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto" />
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-3">
                  Buscando ejercicios...
                </p>
              </div>
            ) : ejercicios.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <div className="text-3xl">📋</div>
                <div>
                  <p className="text-xs font-extrabold tracking-wider uppercase text-slate-500">
                    No hay ejercicios registrados para esta lesión
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium max-w-sm mx-auto">
                    El equipo de fisioterapeutas aún no ha asignado rutinas para "{selectedLesion}".
                    {!user && ' Inicia sesión para solicitar una evaluación personalizada.'}
                  </p>
                </div>
                {!user && (
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[11px] font-bold tracking-wider bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all uppercase"
                  >
                    Iniciar sesión <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 anatomy-scroll max-h-[340px] overflow-y-auto pr-1">
                {ejercicios.map((ej) => (
                  <div
                    key={ej.id}
                    className="lesion-card p-4 rounded-xl border border-slate-200/80 bg-slate-50/30 flex flex-col gap-3 group hover:border-teal-200"
                  >
                    <div className="text-left">
                      <span className="inline-flex px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-2">
                        {ej.tipo_lesion}
                      </span>
                      <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-teal-600 transition-colors mb-1">
                        {ej.titulo}
                      </h4>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {ej.descripcion}
                      </p>
                    </div>

                    <button
                      onClick={handleAction}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-teal-600 hover:text-white transition-all text-xs font-extrabold text-slate-700 tracking-wider uppercase"
                    >
                      <span className="flex items-center gap-1.5">
                        <Video className="h-4 w-4" />
                        {user ? 'Ver Guía Completa' : 'Ver Video Kinesiológico'}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Info banner for guests */}
            {!user && ejercicios.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                <span>
                  Los videos y guías completas son privados. Si eres estudiante o paciente,{' '}
                  <strong>inicia sesión</strong> para reproducir el contenido.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyPartNavigator;
