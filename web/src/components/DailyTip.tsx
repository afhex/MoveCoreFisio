import React from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

const TIPS = [
  {
    titulo: 'Postura frente a la pantalla',
    descripcion: 'Mantén la parte superior de tu monitor a la altura de tus ojos y los codos en un ángulo de 90° para evitar tensiones lumbares y cervicales.'
  },
  {
    titulo: 'Flexibilidad de Cadera',
    descripcion: 'Pasar muchas horas sentado acorta los flexores de cadera. Realiza el estiramiento del caballero por 30 segundos en cada lado para liberar presión lumbar.'
  },
  {
    titulo: 'Cuidado de Rodillas',
    descripcion: 'Al hacer sentadillas, asegúrate de que tus rodillas sigan la línea de tus pies y no se metan hacia adentro (valgo de rodilla) para proteger los meniscos.'
  },
  {
    titulo: 'Recuperación Muscular',
    descripcion: 'El descanso y la hidratación son tan importantes como el ejercicio. Beber suficiente agua previene calambres y promueve la regeneración del tejido.'
  },
  {
    titulo: 'Estiramiento Cervical',
    descripcion: 'Inclina suavemente tu cabeza hacia el hombro derecho apoyándote con la mano, sostén por 20 segundos y cambia de lado para aliviar la tensión del cuello.'
  },
  {
    titulo: 'Activación del Core',
    descripcion: 'Activar tu abdomen profundo (transverso abdominal) estabiliza la columna. Haz contracciones sutiles del ombligo hacia adentro al levantar peso.'
  },
  {
    titulo: 'Cuidado del Tobillo',
    descripcion: 'Realizar ejercicios de equilibrio sobre un solo pie (propiocepción) ayuda a fortalecer los ligamentos del tobillo y previene esguinces recurrentes.'
  },
  {
    titulo: 'Salud de Hombros',
    descripcion: 'Evita movimientos repetitivos por encima de la cabeza sin un calentamiento previo de los rotadores externos para prevenir el síndrome de pinzamiento.'
  }
];

const DailyTip: React.FC = () => {
  // Obtener un tip basado en el día del mes actual
  const diaDelMes = new Date().getDate();
  const tipDelDia = TIPS[diaDelMes % TIPS.length];

  return (
    <div className="w-full glass-panel p-6 rounded-3xl border-l-4 border-l-emerald-500 bg-white/90 relative overflow-hidden group hover:shadow-md transition-all">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles className="h-24 w-24 text-emerald-600" />
      </div>
      <div className="flex items-start gap-4 relative z-10">
        <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl shrink-0">
          <Lightbulb className="h-6 w-6 animate-pulse" />
        </div>
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">DATO KINESIOLÓGICO DEL DÍA</span>
          <h4 className="font-extrabold text-slate-800 text-base">{tipDelDia.titulo}</h4>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{tipDelDia.descripcion}</p>
        </div>
      </div>
    </div>
  );
};

export default DailyTip;
