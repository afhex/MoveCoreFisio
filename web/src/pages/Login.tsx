import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserRole } from '../firebase/types';
import { Activity, Mail, Lock, User, UserPlus, LogIn } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = (searchParams.get('role') as UserRole) || 'paciente';

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && !acceptTerms) {
      setError('Debes aceptar el consentimiento informado y políticas de privacidad para registrarte.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Iniciar Sesión
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        // Registrarse
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });

        const userDocRef = doc(db, 'usuarios', user.uid);
        await setDoc(userDocRef, {
          id: user.uid,
          nombre: name,
          correo: email,
          rol: role,
          fecha_registro: Timestamp.now(),
          acepto_politicas: true,
          fecha_aceptacion: Timestamp.now()
        });

        if (role === 'paciente') {
          navigate('/paciente/dashboard');
        } else {
          navigate('/fisioterapeuta/dashboard');
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('El correo electrónico ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Ocurrió un error. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative overflow-hidden bg-slate-50 text-slate-800">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta del Formulario */}
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-200 bg-white relative z-10 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-br from-emerald-500 to-blue-600 p-3 rounded-2xl text-white mb-4">
            <Activity className="h-6 w-6 font-bold" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-wider text-slate-800">
            {isLogin ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
          </h2>
          <p className="text-slate-500 text-xs mt-1 tracking-wide font-medium">
            {isLogin ? 'Accede a tu panel clínico y de entrenamiento' : 'Forma parte del ecosistema MoveCare Fisio'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nombre (Solo registro) */}
          {!isLogin && (
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Elena Mendoza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-semibold"
                />
              </div>
            </div>
          )}

          {/* Campo Correo */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="e.mendoza@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-semibold"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700"
              />
            </div>
          </div>

          {/* Campo Rol (Solo registro) */}
          {!isLogin && (
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Tipo de Usuario</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm text-slate-700 font-semibold"
              >
                <option value="paciente">Paciente (Entrenamiento y Progreso)</option>
                <option value="fisioterapeuta">Fisioterapeuta (Gestión y Asignación)</option>
              </select>
            </div>
          )}

          {/* Consentimiento Informado (Solo registro) */}
          {!isLogin && (
            <div className="flex items-start gap-2 text-left mt-3">
              <input
                type="checkbox"
                id="accept-policies"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-350 text-emerald-600 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="accept-policies" className="text-[11px] text-slate-500 font-medium leading-snug cursor-pointer">
                Acepto los términos del{' '}
                <Link to="/politica-privacidad" target="_blank" className="text-emerald-600 hover:text-emerald-700 underline font-semibold">
                  Consentimiento Informado y Política de Privacidad de Datos de Salud
                </Link>{' '}
                de MoveCare Fisio.
              </label>
            </div>
          )}

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3.5 bg-emerald-600 text-white font-extrabold tracking-widest text-xs uppercase rounded-xl neon-button-glow hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : isLogin ? (
              <>
                <LogIn className="h-4.5 w-4.5" /> ACCEDER AL SISTEMA
              </>
            ) : (
              <>
                <UserPlus className="h-4.5 w-4.5" /> REGISTRAR CUENTA
              </>
            )}
          </button>
        </form>

        {/* Cambiar entre Login y Registro */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-slate-500 hover:text-emerald-600 transition-colors font-bold"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes una cuenta? Inicia sesión aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
