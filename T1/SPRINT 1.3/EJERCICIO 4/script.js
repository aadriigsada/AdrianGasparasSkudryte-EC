
    const API_BASE = 'http://localhost:3000';
    let partiesLocales = []; // Almacena las parties creadas para mostrarlas en la tabla

    function abrirModal() {
        ocultarError();
        document.getElementById('form-party').reset();
        document.getElementById('modalParty').style.display = "flex";
    }

    function cerrarModal() {
        document.getElementById('modalParty').style.display = "none";
        document.getElementById('form-party').reset(); // Cumple la Prueba 5
        ocultarError();
    }

    function mostrarError(msg) {
        const banner = document.getElementById('error-banner');
        banner.textContent = `❌ ${msg}`;
        banner.style.display = 'block';
    }

    function ocultarError() {
        document.getElementById('error-banner').style.display = 'none';
    }

    function mostrarExito(msg) {
        const banner = document.getElementById('main-success-banner');
        banner.textContent = `✅ ${msg}`;
        banner.style.display = 'block';
        setTimeout(() => banner.style.display = 'none', 4000);
    }

    // Validación estricta del formato de fecha y si es futura (Prueba 3)
    function parseDateString(str) {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})_(\d{2}):(\d{2})$/;
        const match = str.match(regex);
        if (!match) return null;

        const [, day, month, year, hour, min] = match;
        const dateObj = new Date(`${year}-${month}-${day}T${hour}:${min}:00`);
        
        // Comprobar si la fecha es inválida lógicamente (ej. 32/13/2024)
        if (isNaN(dateObj.getTime())) return null;
        
        return dateObj;
    }

    async function crearParty(e) {
        e.preventDefault();
        ocultarError();

        const partySize = document.getElementById('party_size').value;
        const creatorId = document.getElementById('creator_id').value.trim();
        const levelCap = parseInt(document.getElementById('level_cap').value, 10);
        const ilvlCap = parseInt(document.getElementById('ilvl_cap').value, 10);
        const partyRole = document.getElementById('party_role').value;
        const plannedStart = document.getElementById('planned_start').value.trim();

        // 1. Validar Números Negativos/Cero (Prueba 4)
        if (levelCap <= 0 || ilvlCap <= 0) {
            mostrarError("Los campos Level Cap e Item Level Cap deben ser números enteros positivos.");
            return;
        }

        // 2. Validar Formato y Fecha Futura (Prueba 3)
        const dateObj = parseDateString(plannedStart);
        if (!dateObj) {
            mostrarError("El formato de fecha es incorrecto. Debe ser DD/MM/YYYY_HH:mm");
            return;
        }
        if (dateObj <= new Date()) {
            mostrarError("La fecha 'Planned Start' debe ser una fecha y hora futura.");
            return;
        }

        try {
            // 3. Verificar que el Creator ID existe en la Guild (Prueba 1)
            const resMiembros = await fetch(`${API_BASE}/guildmembers`);
            if (!resMiembros.ok) throw new Error('No se pudo consultar la lista de miembros de la guild.');
            const miembros = await resMiembros.json();
            const existe = miembros.some(m => String(m.user_id) === creatorId);
            
            if (!existe) {
                mostrarError(`El Creator ID "${creatorId}" no existe en la base de datos de miembros.`);
                return;
            }

            // 4. Enviar a la API
            const payload = {
                creator_id: creatorId,
                level_cap: levelCap,
                ilvl_cap: ilvlCap,
                party_role_creator: partyRole,
                planned_start: plannedStart
            };

            const resParty = await fetch(`${API_BASE}/partyfinder/${partySize}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!resParty.ok) {
                const errData = await resParty.json().catch(() => ({}));
                throw new Error(errData.message || "Error interno al crear la party en el backend.");
            }

            const data = await resParty.json();

            // Agregar a la tabla de la interfaz (Prueba 1)
            partiesLocales.push({
                party_id: data.party_id,
                size: partySize,
                creator: creatorId,
                plannedStart: plannedStart,
                lvlCap: levelCap,
                ilvlCap: ilvlCap,
                role: partyRole
            });
            renderizarTabla();
            
            cerrarModal();
            mostrarExito(`Party #${data.party_id} creada exitosamente.`);

        } catch (error) {
            mostrarError(error.message);
        }
    }

    function renderizarTabla() {
        const tbody = document.getElementById('tabla-parties');
        if (partiesLocales.length === 0) {
            tbody.innerHTML = '';
            return;
        }

        tbody.innerHTML = partiesLocales.map(p => `
            <tr>
                <td><strong>#${p.party_id}</strong></td>
                <td>${p.size}</td>
                <td>${p.creator}</td>
                <td>${p.plannedStart}</td>
                <td>${p.lvlCap}</td>
                <td>${p.ilvlCap}</td>
                <td><span style="background:#e67e22; color:white; padding:3px 8px; border-radius:4px; font-size:0.85em;">${p.role}</span></td>
            </tr>
        `).join('');
    }
