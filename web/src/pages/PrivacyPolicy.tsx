import React from 'react';
import { ShieldAlert, CheckCircle, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-left bg-slate-50 min-h-screen">
      <Link
        to="/"
        className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors uppercase mb-8"
      >
        <ArrowLeft className="h-4.5 w-4.5" /> Volver al Inicio
      </Link>

      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Consentimiento Informado</h1>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Política de Privacidad y Uso de Datos Clínicos</p>
          </div>
        </div>

        {/* Sección LOPDP */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold uppercase tracking-wide">AVISO DE CUMPLIMIENTO ÉTICO Y LEGAL</h4>
            <p className="font-medium">
              De acuerdo con la Ley Orgánica de Protección de Datos Personales (LOPDP) de Ecuador, esta aplicación trata datos de salud de carácter sensible. Los datos son recopilados con fines estrictamente académicos e investigativos en el marco del proyecto de grado / tesis.
            </p>
          </div>
        </div>

        {/* Artículos de la Política */}
        <section className="space-y-6 text-slate-700 text-sm leading-relaxed font-medium">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">1. ¿Qué datos recopilamos?</h3>
            <p>
              MoveCare Fisio recopila información de identificación y de salud personal de los usuarios con rol de paciente, que incluye: Nombre completo, correo electrónico, número de Cédula de Identidad, edad, sexo biológico, peso (kg), estatura (cm), tipo de discapacidad, diagnóstico clínico kinesiológico e historial de ejercicios completados (progreso).
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">2. Finalidad del Tratamiento de Datos</h3>
            <p>
              La recolección de esta información tiene como única finalidad simular un entorno clínico de rehabilitación física y deportiva. Específicamente se utiliza para:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Calcular el Índice de Masa Corporal (IMC) y dosificar ejercicios de recuperación física.</li>
              <li>Permitir al fisioterapeuta asignar rutinas de ejercicios personalizadas semanalmente.</li>
              <li>Generar gráficos y estadísticas de cumplimiento diarios, semanales y mensuales del tratamiento.</li>
              <li>Validar la interactividad del sistema como tesis de grado universitaria.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">3. Confidencialidad y Seguridad</h3>
            <p>
              Toda la información es almacenada en servidores seguros de Google Firebase (Auth, Firestore y Cloud Storage). Ninguno de los datos de salud guardados en este prototipo será vendido, compartido ni distribuido a empresas externas ni terceras personas ajenas al proceso de validación docente del proyecto.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">4. Derechos del Titular (Derechos ARCO)</h3>
            <p>
              Como titular de la información, tienes derecho a solicitar el acceso, rectificación o eliminación total de tus datos clínicos y personales de la base de datos de MoveCare Fisio. Puedes solicitarlo escribiendo directamente al administrador de la tesis o a través de tu fisioterapeuta a cargo.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">5. Aceptación del Consentimiento</h3>
            <p className="flex items-start gap-2 bg-slate-100 p-4 rounded-2xl border border-slate-200">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Al marcar la casilla de verificación en el formulario de registro, confirmas que has leído este documento, entiendes el uso de tus datos y otorgas tu consentimiento explícito y voluntario para que MoveCare Fisio almacene y trate tu información de salud bajo estos términos.
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
