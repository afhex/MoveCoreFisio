import { DocumentReference, Timestamp } from 'firebase/firestore';

/**
 * Roles permitidos dentro del ecosistema MoveCare Fisio.
 */
export type UserRole = 'paciente' | 'fisioterapeuta' | 'admin';

/**
 * Representa un usuario registrado en el sistema.
 * Colección: `/usuarios`
 */
export interface Usuario {
  /** ID del documento, coincide exactamente con el UID de Firebase Auth */
  id: string;
  nombre: string;
  correo: string;
  rol: UserRole;
  /** Fecha en la que el usuario creó su cuenta */
  fecha_registro: Timestamp;
}

/**
 * Catálogo de ejercicios de rehabilitación física.
 * Colección: `/ejercicios`
 */
export interface Ejercicio {
  /** ID único autogenerado o asignado manualmente (slug) */
  id: string;
  titulo: string;
  descripcion: string;
  /** Región del cuerpo afectada. Ej. 'rodilla', 'lumbar', 'cuello', 'hombro' */
  zona_anatomica: string;
  /** Patología objetivo del ejercicio. Ej. 'esguince', 'post-quirúrgico' */
  tipo_lesion: string;
  /** Pasos detallados en orden para la realización del ejercicio */
  instrucciones: string[];
  /** Enlace al video o recurso multimedia almacenado en Cloud Storage */
  multimedia_url: string;
}

/**
 * Registro diario/sesión de progreso clínico de los pacientes.
 * Colección: `/progreso_pacientes`
 */
export interface ProgresoPaciente {
  /** ID único de la sesión de progreso */
  id: string;
  /** Referencia tipada al documento del usuario (paciente) en `/usuarios` */
  usuario_id: DocumentReference<Usuario>;
  /** Referencia tipada al documento del ejercicio en `/ejercicios` */
  ejercicio_id: DocumentReference<Ejercicio>;
  /** Fecha y hora en la que se guardó el progreso de la actividad */
  fecha: Timestamp;
  /** Indica si el paciente finalizó la serie completa del ejercicio */
  completado: boolean;
  /** Observaciones, comentarios sobre dolor o sensaciones durante la ejecución */
  observaciones: string;
}

/**
 * Artículos informativos y científicos publicados para educación al paciente.
 * Colección: `/articulos_revista`
 */
export interface ArticuloRevista {
  /** ID único o slug del artículo */
  id: string;
  titulo: string;
  /** Nombre completo del fisioterapeuta o profesional redactor */
  autor: string;
  /** Contenido del artículo en formato Markdown o HTML */
  contenido: string;
  /** Temática del artículo. Ej. 'prevencion', 'nutricion', 'estiramientos' */
  categoria: string;
  fecha_publicacion: Timestamp;
}
