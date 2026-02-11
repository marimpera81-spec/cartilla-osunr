import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO_ID",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function buscar() {
    const esp = document.getElementById('busqEspecialidad').value.toLowerCase().trim();
    const loc = document.getElementById('busqLocalidad').value.toLowerCase().trim();
    const med = document.getElementById('busqMedico').value.toLowerCase().trim();
    const contenedor = document.getElementById('contenedor-resultados');

    contenedor.innerHTML = "Buscando...";

    try {
        const querySnapshot = await getDocs(collection(db, "medicos"));
        contenedor.innerHTML = "";
        
        querySnapshot.forEach((doc) => {
            const d = doc.data();
            const dEsp = (d.Especialidad || d.especialidad || "").toLowerCase();
            const dLoc = (d.Localidad || d.localidad || "").toLowerCase();
            const dNom = (d.Profesional || d.nombre || "").toLowerCase();

            if ((!esp || dEsp.includes(esp)) && (!loc || dLoc.includes(loc)) && (!med || dNom.includes(med))) {
                const dir = d.Dirección || d.direccion || "";
                const localidad = d.Localidad || d.localidad || "";
                const queryMapa = encodeURIComponent(`${dir}, ${localidad}, Santa Fe, Argentina`);
                const linkMaps = `https://www.google.com/maps/search/?api=1&query=${queryMapa}`;

                contenedor.innerHTML += `
                    <div class="tarjeta">
                        <div class="nombre">${d.Profesional || d.nombre}</div>
                        <div class="info"><strong>🩺</strong> ${d.Especialidad || d.especialidad}</div>
                        <div class="info"><strong>📍</strong> <a href="${linkMaps}" target="_blank">${dir} (${localidad})</a></div>
                        <div class="info"><strong>📞</strong> <a href="tel:${d.Teléfono || d.telefono}">${d.Teléfono || d.telefono}</a></div>
                    </div>`;
            }
        });
    } catch (e) {
        contenedor.innerHTML = "Error de conexión. Revisá las reglas de Firebase.";
    }
}

document.getElementById('btnBuscar').addEventListener('click', buscar);