// Función principal de búsqueda
async function buscar() {
    const esp = document.getElementById('busqEspecialidad').value.toLowerCase().trim();
    const loc = document.getElementById('busqLocalidad').value.toLowerCase().trim();
    const med = document.getElementById('busqMedico').value.toLowerCase().trim();
    const contenedor = document.getElementById('contenedor-resultados');

    contenedor.innerHTML = "<p style='text-align:center;'>Buscando...</p>";

    try {
        // Buscamos el archivo de datos que creaste en tu repo
        const respuesta = await fetch('./datos.json'); 
        const datos = await respuesta.json();
        
        contenedor.innerHTML = "";
        let encontrados = 0;

        datos.forEach((d) => {
            const n = (d.nombre || "").toLowerCase();
            const e = (d.especialidad || "").toLowerCase();
            const l = (d.localidad || "").toLowerCase();

            if ((!esp || e.includes(esp)) && (!loc || l.includes(loc)) && (!med || n.includes(med))) {
                encontrados++;
                const icono = d.tipo === "medico" ? "🩺" : "💊";
                const queryMapa = encodeURIComponent(`${d.direccion}, ${d.localidad}, Santa Fe, Argentina`);
                const linkMaps = `https://www.google.com/maps/search/?api=1&query=${queryMapa}`;

                contenedor.innerHTML += `
                    <div class="tarjeta" style="background: white; margin-top: 15px; padding: 20px; border-radius: 12px; border-left: 5px solid #7ba2c7; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="font-size: 0.8em; color: gray; font-weight: bold;">${icono} ${d.especialidad.toUpperCase()}</div>
                        <div style="color: #5d7a5c; font-weight: 600; text-transform: uppercase; margin: 5px 0;">${d.nombre}</div>
                        <div style="font-size: 0.95em; margin: 5px 0;">📍 <a href="${linkMaps}" target="_blank" style="color: #7ba2c7; text-decoration: none; font-weight: 600;">${d.direccion} (${d.localidad})</a></div>
                        <div style="font-size: 0.95em; margin: 5px 0;">📞 <a href="tel:${d.telefono}" style="color: #7ba2c7; text-decoration: none; font-weight: 600;">Tel: ${d.telefono}</a></div>
                    </div>`;
            }
        });

        if (encontrados === 0) {
            contenedor.innerHTML = "<p style='text-align:center;'>No se encontraron resultados. Intentá con otros términos.</p>";
        }

    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = "<p style='text-align:center; color:red;'>Error al cargar los datos. Asegurate de que el archivo 'datos.json' exista.</p>";
    }
}

// Esto asegura que el botón responda al hacer clic
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnBuscar');
    if(btn) {
        btn.onclick = buscar;
    }
});



