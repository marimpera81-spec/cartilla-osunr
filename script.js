import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBvHq_Wb2ZDKBVCoSSFGftkfN8n2f9u1Bo",
  authDomain: "cartilla-de-medicos-osunr.firebaseapp.com",
  projectId: "cartilla-de-medicos-osunr",
  storageBucket: "cartilla-de-medicos-osunr.firebasestorage.app",
  messagingSenderId: "189142960922",
  appId: "1:189142960922:web:48b8f9427d350385cbfaa3",
  measurementId: "G-SJ2ZVR49B9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function buscar() {
    const esp = document.getElementById('busqEspecialidad').value.toLowerCase();
    const loc = document.getElementById('busqLocalidad').value.toLowerCase();
    const med = document.getElementById('busqMedico').value.toLowerCase();
    const contenedor = document.getElementById('contenedor-resultados');

    contenedor.innerHTML = "<p style='text-align:center;'>Buscando entre las nubes...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "medicos"));
        contenedor.innerHTML = "";
        
        querySnapshot.forEach((doc) => {
            const d = doc.data();
            const nombre = (d.Profesional || d.nombre || "").toLowerCase();
            const especialidad = (d.Especialidad || d.especialidad || "").toLowerCase();
            const localidad = (d.Localidad || d.localidad || "").toLowerCase();

            if ((!esp || especialidad.includes(esp)) && (!loc || localidad.includes(loc)) && (!med || nombre.includes(med))) {
                const dir = d.Dirección || d.direccion || "";
                const linkMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dir + " " + localidad)}`;

                contenedor.innerHTML += `
                    <div class="tarjeta">
                        <div class="nombre">${nombre.toUpperCase()}</div>
                        <div class="info">🌸 <b>${especialidad}</b></div>
                        <div class="info">📍 <a href="${linkMaps}" target="_blank">${dir} (${localidad})</a></div>
                        <div class="info">📞 <a href="tel:${d.Teléfono || d.telefono}">${d.Teléfono || d.telefono}</a></div>
                    </div>`;
            }
        });
    } catch (e) {
        contenedor.innerHTML = "Error de conexión. Revisa las Reglas en Firebase.";
    }
}

document.getElementById('btnBuscar').addEventListener('click', buscar);
