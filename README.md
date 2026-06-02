# MoveCoreFisio 🩺💪

**MoveCoreFisio** es una plataforma digital de salud y fisioterapia diseñada para optimizar la rehabilitación física, facilitar la prescripción de ejercicios kinesiológicos y realizar el seguimiento continuo de pacientes. Este proyecto forma parte de un trabajo de tesis de nivel superior.

La plataforma cuenta con un buscador anatómico interactivo en 3D/2.5D que permite a los usuarios seleccionar zonas de dolor en el cuerpo humano, visualizar las lesiones más comunes y acceder a videos y guías de ejercicios recomendados para su recuperación.

---

## 📂 Estructura del Proyecto

El repositorio está organizado en un espacio de trabajo multimodular:

```text
MoveCoreFisio/
├── android/          # Aplicación móvil nativa para Android (Kotlin) para pacientes.
├── firebase/         # Reglas de seguridad de Firestore, Storage e índices de la base de datos.
├── web/              # Aplicación web principal (React + TypeScript + Tailwind CSS + Vite).
└── README.md         # Documentación general del proyecto.
```

---

## 🛠️ Stack Tecnológico

### **Frontend Web (`/web`)**
* **Framework:** React con TypeScript.
* **Empaquetador:** Vite (rápido y con soporte HMR).
* **Estilos:** Tailwind CSS (diseño responsivo y adaptativo).
* **Iconografía:** Lucide React.
* **Enrutamiento:** React Router DOM v6.

### **Mobile App (`/android`)**
* **Lenguaje:** Kotlin (nativo).
* **Arquitectura:** Modelo-Vista-Controlador (MVC) / MVVM.
* **Integración:** Firebase SDK.

### **Backend & Base de Datos (`/firebase` & Integración)**
* **Autenticación:** Firebase Authentication (Inicio de sesión para Pacientes y Administradores).
* **Base de Datos:** Cloud Firestore (almacenamiento no relacional en tiempo real).
* **Almacenamiento:** Firebase Cloud Storage (para guías en video y recursos multimedia).

---

## 🚀 Instalación y Uso Local

### 1. Requisitos Previos
Asegúrate de tener instalados:
* [Node.js](https://nodejs.org/) (Versión 18 o superior).
* [Git](https://git-scm.com/).
* Android Studio (para compilar y ejecutar la app móvil).

---

### 2. Configurar y Ejecutar la Web Client (`/web`)

1. Navega a la carpeta de la web:
   ```bash
   cd web
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz de la carpeta `web` con tus credenciales de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *La aplicación estará disponible por defecto en `http://localhost:3000/` o `http://localhost:3001/`.*

5. Para compilar la web para producción:
   ```bash
   npm run build
   ```

---

### 3. Configurar Firebase (`/firebase`)
Si necesitas desplegar o modificar las reglas de seguridad:

1. Asegúrate de tener instalado el CLI de Firebase:
   ```bash
   npm install -g firebase-tools
   ```
2. Inicia sesión en tu cuenta de Firebase:
   ```bash
   firebase login
   ```
3. Para desplegar las reglas de base de datos e índices:
   ```bash
   cd firebase
   firebase deploy --only firestore
   ```

---

## ✨ Características Principales

1. **Buscador Anatómico Interactivo:**
   * Mapa muscular interactivo con dos vistas (Frontal y Posterior).
   * Puntos de interés interactivos (hotspots) con diseño moderno e interactivo (botones con microanimaciones "+").
   * Listado descendente anatómico para seleccionar zonas con facilidad (Cabeza, Cuello, Hombros, Codos, Manos, etc.).

2. **Gestión de Lesiones y Ejercicios:**
   * Filtro automático de condiciones médicas por zona anatómica.
   * Carga de videos kinesiológicos guiados y fichas técnicas de rehabilitación directamente desde Firestore.

3. **Panel de Control Administrativo:**
   * Interfaz privada para kinesiólogos y administradores para registrar nuevos ejercicios, modificar artículos de divulgación de la revista de salud y gestionar usuarios.

4. **Dashboard de Paciente:**
   * Módulo privado donde los pacientes visualizan su rutina de ejercicios asignada por el especialista y registran su progreso diario.

---

## 📄 Licencia
Este proyecto es desarrollado con fines académicos y de investigación para la obtención del título profesional. Todos los derechos reservados.
