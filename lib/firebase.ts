import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// =================================================================================
// ¡ACCIÓN REQUERIDA! Reemplaza este objeto con la configuración de TU proyecto de Firebase.
// 1. Ve a la Consola de Firebase: https://console.firebase.google.com/
// 2. Selecciona tu proyecto.
// 3. Haz clic en el ícono de engranaje ⚙️ (Configuración del proyecto) en la esquina superior izquierda.
// 4. En la pestaña "General", desplázate hacia abajo hasta la sección "Tus apps".
// 5. Verás "Configuración de SDK". Selecciona la opción "Configuración".
// 6. Copia el objeto `firebaseConfig` completo y pégalo aquí.
// =================================================================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // <-- REEMPLAZAR
  authDomain: "YOUR_AUTH_DOMAIN", // <-- REEMPLAZAR
  projectId: "YOUR_PROJECT_ID", // <-- REEMPLAZAR
  storageBucket: "YOUR_STORAGE_BUCKET", // <-- REEMPLAZAR
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // <-- REEMPLAZAR
  appId: "YOUR_APP_ID" // <-- REEMPLAZAR
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };