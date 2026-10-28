
    const API_BASE = "https://pokeapi.co/api/v2";

    // ==========================================
    // PARTE 1: Información Básica
    // ==========================================
    async function obtenerInfoBasicaPokemon(nombrePokemon) {
        const query = nombrePokemon.toString().toLowerCase().trim();
        const response = await fetch(`${API_BASE}/pokemon/${query}`);
        if (!response.ok) throw new Error("Pokémon no encontrado");
        
        const data = await response.json();
        return {
            nombre: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            id: data.id,
            tipos: data.types.map(t => t.type.name),
            imagen: data.sprites.other['official-artwork'].front_default || data.sprites.front_default
        };
    }

    async function ejecutarParte1() {
        const input = document.getElementById('p1-input').value;
        const resDiv = document.getElementById('p1-resultado');
        if (!input) return;

        try {
            resDiv.innerHTML = "<p>Cargando...</p>";
            const info = await obtenerInfoBasicaPokemon(input);
            resDiv.innerHTML = `
                <div class="card-pokemon">
                    <img src="${info.imagen}" alt="${info.nombre}">
                    <div>
                        <h3>${info.nombre} <small>(#${info.id})</small></h3>
                        <p><strong>Tipos:</strong> ${info.tipos.map(t => `<span class="badge">${t}</span>`).join('')}</p>
                    </div>
                </div>
            `;
        } catch (error) {
            resDiv.innerHTML = `<div class="error-msg">❌ Error: ${error.message}</div>`;
        }
    }

    function probarErrorP1() {
        document.getElementById('p1-input').value = "fakepokemon";
        ejecutarParte1();
    }

    // ==========================================
    // PARTE 2: Comparativa
    // ==========================================
    async function obtenerStatsPokemon(nombrePokemon) {
        const query = nombrePokemon.toString().toLowerCase().trim();
        const response = await fetch(`${API_BASE}/pokemon/${query}`);
        if (!response.ok) throw new Error(`Pokémon "${nombrePokemon}" no encontrado`);
        const data = await response.json();
        
        const stats = {};
        let total = 0;
        data.stats.forEach(s => {
            stats[s.stat.name] = s.base_stat;
            total += s.base_stat;
        });

        return {
            nombre: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            imagen: data.sprites.front_default,
            stats,
            total
        };
    }

    async function compararPokemon(pokemon1, pokemon2) {
        const [p1, p2] = await Promise.all([
            obtenerStatsPokemon(pokemon1),
            obtenerStatsPokemon(pokemon2)
        ]);
        return { p1, p2 };
    }

    async function ejecutarParte2() {
        const input1 = document.getElementById('p2-input1').value;
        const input2 = document.getElementById('p2-input2').value;
        const resDiv = document.getElementById('p2-resultado');

        if (!input1 || !input2) return;

        try {
            resDiv.innerHTML = "<p>Comparando...</p>";
            const { p1, p2 } = await compararPokemon(input1, input2);
            
            const statKeys = Object.keys(p1.stats);
            const p1Gana = p1.total > p2.total;
            const empate = p1.total === p2.total;

            let htmlTable = `
                <table>
                    <thead>
                        <tr>
                            <th>Estadística Base</th>
                            <th>${p1.nombre}</th>
                            <th>${p2.nombre}</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            statKeys.forEach(stat => {
                htmlTable += `
                    <tr>
                        <td style="text-transform: capitalize;">${stat.replace('-', ' ')}</td>
                        <td>${p1.stats[stat]}</td>
                        <td>${p2.stats[stat]}</td>
                    </tr>
                `;
            });

            htmlTable += `
                        <tr style="font-size: 1.1em;">
                            <td><strong>TOTAL BASE STATS</strong></td>
                            <td class="${p1Gana ? 'winner' : ''}">${p1.total}</td>
                            <td class="${!p1Gana && !empate ? 'winner' : ''}">${p2.total}</td>
                        </tr>
                    </tbody>
                </table>
                <p style="margin-top: 15px; font-weight: bold;">
                    🏆 Resultado: ${empate ? "¡Empate técnico!" : `¡${p1Gana ? p1.nombre : p2.nombre} tiene mejores estadísticas generales!`}
                </p>
            `;
            resDiv.innerHTML = htmlTable;
        } catch (error) {
            resDiv.innerHTML = `<div class="error-msg">❌ Error: ${error.message}</div>`;
        }
    }

    // ==========================================
    // PARTE 3: Evoluciones y Habilidades
    // ==========================================
    async function obtenerCadenaEvolutiva(nombrePokemon) {
        const query = nombrePokemon.toString().toLowerCase().trim();
        
        // 1. Obtener especie para sacar la URL de la cadena evolutiva
        const specRes = await fetch(`${API_BASE}/pokemon-species/${query}`);
        if (!specRes.ok) throw new Error("Pokémon no encontrado");
        const specData = await specRes.json();

        if (!specData.evolution_chain) {
            return { evoluciones: [], mensaje: "Este Pokémon no tiene cadena evolutiva registrada." };
        }

        // 2. Obtener la cadena evolutiva completa
        const evoRes = await fetch(specData.evolution_chain.url);
        const evoData = await evoRes.json();

        // 3. Recorrer árbol evolutivo recursivamente
        const nombresEvoluciones = [];
        let actual = evoData.chain;

        while (actual) {
            nombresEvoluciones.push(actual.species.name);
            actual = actual.evolves_to[0]; // Tomamos la línea principal de evolución
        }

        if (nombresEvoluciones.length <= 1 && specData.evolution_chain) {
             // Caso como Tauros (no evoluciona)
             if (nombresEvoluciones.length === 1 && !evoData.chain.evolves_to.length) {
                 return { evoluciones: [], sinEvolucion: true, nombre: specData.name };
             }
        }

        // 4. Para cada Pokémon evolutivo, obtener sus datos (imagen y habilidades)
        const detallesEvoluciones = await Promise.all(
            nombresEvoluciones.map(async (name) => {
                const pRes = await fetch(`${API_BASE}/pokemon/${name}`);
                const pData = await pRes.json();
                return {
                    nombre: pData.name.charAt(0).toUpperCase() + pData.name.slice(1),
                    imagen: pData.sprites.other['official-artwork'].front_default || pData.sprites.front_default,
                    habilidades: pData.abilities.map(a => ({
                        nombre: a.ability.name,
                        url: a.ability.url
                    }))
                };
            })
        );

        return { evoluciones: detallesEvoluciones };
    }

    async function ejecutarParte3() {
        const input = document.getElementById('p3-input').value;
        const resDiv = document.getElementById('p3-resultado');
        if (!input) return;

        try {
            resDiv.innerHTML = "<p>Buscando cadena evolutiva...</p>";
            const res = await obtenerCadenaEvolutiva(input);

            if (res.sinEvolucion) {
                resDiv.innerHTML = `<p>ℹ️ El Pokémon <strong>${res.nombre}</strong> no tiene cadena evolutiva.</p>`;
                return;
            }

            let html = '<div class="evolution-chain">';
            res.evoluciones.forEach(evo => {
                html += `
                    <div class="evo-card">
                        <img src="${evo.imagen}" alt="${evo.nombre}">
                        <h4>${evo.nombre}</h4>
                        <p><strong>Habilidades:</strong></p>
                        ${evo.habilidades.map(h => `
                            <button style="margin: 2px; padding: 4px 8px; font-size: 0.8em;" class="btn-secundario" onclick="verDetalleHabilidad('${h.url}', '${h.nombre}')">
                                ${h.nombre}
                            </button>
                        `).join('')}
                    </div>
                `;
            });
            html += '</div>';
            resDiv.innerHTML = html;
        } catch (error) {
            resDiv.innerHTML = `<div class="error-msg">❌ Error: ${error.message}</div>`;
        }
    }

    // ==========================================
    // MODAL HABILIDADES
    // ==========================================
    async function verDetalleHabilidad(url, nombre) {
        const modal = document.getElementById('modalHabilidad');
        const titulo = document.getElementById('modal-titulo');
        const desc = document.getElementById('modal-descripcion');

        titulo.textContent = nombre.replace('-', ' ');
        desc.textContent = "Cargando información técnica de la API...";
        modal.style.display = "flex";

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            // Buscar la descripción en español si existe, si no en inglés
            const efectoEs = data.effect_entries.find(e => e.language.name === 'es') ||
                             data.effect_entries.find(e => e.language.name === 'en');

            desc.textContent = efectoEs ? efectoEs.effect : "No se encontró descripción extendida para esta habilidad.";
        } catch (err) {
            desc.textContent = "Error al obtener detalles de la habilidad.";
        }
    }

    function cerrarModal() {
        document.getElementById('modalHabilidad').style.display = "none";
    }
