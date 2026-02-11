async function buscar() {
    const esp = document.getElementById('busqEspecialidad').value.toLowerCase().trim();
    const loc = document.getElementById('busqLocalidad').value.toLowerCase().trim();
    const med = document.getElementById('busqMedico').value.toLowerCase().trim();
    const contenedor = document.getElementById('contenedor-resultados');

    contenedor.innerHTML = "Buscando...";

    try {
        const respuesta = await fetch('datos.json');
        const datos = await respuesta.json();
        
        contenedor.innerHTML = "";
        let encontrados = 0;

        datos.forEach((d) => {
            const n = d.nombre.toLowerCase();
            const e = d.especialidad.toLowerCase();
            const l = d.localidad.toLowerCase();

            if ((!esp || e.includes(esp)) && (!loc || l.includes(loc)) && (!med || n.includes(med))) {
                encontrados++;
                const icono = d.tipo === "medico" ? "🩺" : "💊";
                const queryMapa = encodeURIComponent(`${d.direccion}, ${d.localidad}, Santa Fe, Argentina`);
                const linkMaps = `https://www.google.com/maps/search/?api=1&query=${queryMapa}`;

                contenedor.innerHTML += `
                    <div class="tarjeta">
                        <div style="font-size: 0.8em; color: gray;">${icono} ${d.especialidad.toUpperCase()}</div>
                        <div class="nombre">${d.nombre}</div>
                        <div class="info">📍 <a href="${linkMaps}" target="_blank">${d.direccion} (${d.localidad})</a></div>
                        <div class="info">📞 <a href="tel:${d.telefono}">${d.telefono}</a></div>
                    </div>`;
            }
        });

        if (encontrados === 0) contenedor.innerHTML = "<p>No hay resultados.</p>";

    } catch (error) {
        contenedor.innerHTML = "<p>Error al cargar datos.</p>";
    }
}

document.getElementById('btnBuscar').addEventListener('click', buscar);


