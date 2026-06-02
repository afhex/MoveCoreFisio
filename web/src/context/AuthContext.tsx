import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Usuario } from '../firebase/types';
import { Timestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userProfile: Usuario | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Obtener los detalles del perfil desde Firestore
          const userDocRef = doc(db, 'usuarios', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as Usuario);
          } else {
            // Si el documento no existe en Firestore, creamos uno básico por defecto como paciente
            const nuevoPerfil: Usuario = {
              id: currentUser.uid,
              nombre: currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario',
              correo: currentUser.email || '',
              rol: 'paciente',
              fecha_registro: Timestamp.now()
            };
            await setDoc(userDocRef, nuevoPerfil);
            setUserProfile(nuevoPerfil);
          }
        } catch (error) {
          console.error("Error cargando el perfil del usuario:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
