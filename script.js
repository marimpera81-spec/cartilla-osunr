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
    const esp = document.getElementById('busqEspecialidad').value.toLowerCase().trim();
    const loc = document.getElementById('busqLocalidad').value.toLowerCase().trim();
    const med = document.getElementById('busqMedico').value.toLowerCase().trim();
    const contenedor = document.getElementById('contenedor-resultados');

    contenedor.innerHTML = "<p style='text-align:center;'>Cargando prestadores...</p>";

    try {
        // 1. Probamos traer la colección. ASEGURATE que en Firebase diga "medicos" exactamente.
        const querySnapshot = await getDocs(collection(db, "medicos"));
        
        if (querySnapshot.empty) {
            contenedor.innerHTML = "<p>No hay datos en la colección 'medicos'. Verifica el nombre en Firebase.</p>";
            return;
        }

        contenedor.innerHTML = "";
        let encontrados = 0;

        querySnapshot.forEach((doc) => {
            const d = doc.data();
            
            // BUSCADOR DETECTIVE: intenta leer el campo aunque tenga mayúsculas o minúsculas
            const nombreDoc = (d.Profesional || d.nombre || d.Nombre || "Sin Nombre").toString().toLowerCase();
            const especialidadDoc = (d.Especialidad || d.especialidad || d.Especialidad || "").toString().toLowerCase();
            const localidadDoc = (d.Localidad || d.localidad || d.Ciudad || "").toString().toLowerCase();

            if ((!esp || especialidadDoc.includes(esp)) && 
                (!loc || localidadDoc.includes(loc)) && 
                (!med || nombreDoc.includes(med))) {
                
                encontrados++;
                
                const direccion = d.Dirección || d.direccion || d.Domicilio || "Dirección no disponible";
                const tel = d.Teléfono || d.telefono || d.Telefono || "S/D";
                const queryMapa = encodeURIComponent(`${direccion}, ${localidadDoc}, Santa Fe, Argentina`);
                const linkMaps = `https://www.google.com/maps/search/?api=1&query=${queryMapa}`;

                contenedor.innerHTML += `
                    <div class="tarjeta">
                        <div class="especialidad">${especialidadDoc}</div>
                        <div class="nombre">${nombreDoc.toUpperCase()}</div>
                        <div class="info">📍 <a href="${linkMaps}" target="_blank">${direccion} (${localidadDoc})</a></div>
                        <div class="info">📞 <a href="tel:${tel}">Tel: ${tel}</a></div>
                    </div>`;
            }
        });

        if (encontrados === 0) {
            contenedor.innerHTML = "<p style='text-align:center;'>No se encontraron resultados para los filtros aplicados.</p>";
        }

    } catch (error) {
        console.error("Error completo:", error);
        contenedor.innerHTML = `<p style='color:red;'>Error de conexión: ${error.message}</p>`;
    }
}

document.getElementById('btnBuscar').addEventListener('click', buscar);

