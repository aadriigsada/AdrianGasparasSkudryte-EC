
    const API_BASE = 'http://localhost:3000';
    let currentParty = null;
    let currentPartySize = null;

    // --- 1. VISUALIZACIÓN DE PARTIES ---
    async function cargarParty(idSeleccionado, sizeSeleccionado) {
        const id = idSeleccionado ?? document.getElementById('search_party_id').value.trim();
        const size = sizeSeleccionado ?? document.getElementById('search_party_size').value;
        const errorDiv = document.getElementById('busqueda-error');
        errorDiv.textContent = '';

        if (!id) return;

        try {
            const res = await fetch(`${API_BASE}/partyfinder/${size}/${id}`, { cache: 'no-store' });
            if (!res.ok) {
                if (res.status === 404) throw new Error("Party no encontrada. Verifica el ID y el tamaño.");
                throw new Error("Error interno del servidor.");
            }
            
            currentParty = await res.json();
            // Algunas respuestas incluyen filas vacías (user_id null) para los
            // huecos de la party. Solo los usuarios asignados ocupan una plaza.
            currentParty.party_members = (currentParty.party_members || []).filter(
                member => member && member.user_id !== null && member.user_id !== undefined && String(member.user_id).trim() !== ''
            );
            currentPartySize = parseInt(size, 10);
            renderizarParty();
        } catch (err) {
            document.getElementById('party-details-panel').style.display = 'none';
            errorDiv.textContent = err.message;
        }
    }

    function renderizarParty() {
        document.getElementById('party-details-panel').style.display = 'block';
        document.getElementById('lbl_party_id').textContent = currentParty.party_id;
        document.getElementById('lbl_party_size').textContent = currentPartySize;
        document.getElementById('lbl_creator').textContent = currentParty.creator_id;
        document.getElementById('lbl_date').textContent = currentParty.planned_start;
        document.getElementById('lbl_lvl').textContent = currentParty.level_cap;
        document.getElementById('lbl_ilvl').textContent = currentParty.ilvl_cap;
        
        const members = currentParty.party_members || [];
        document.getElementById('lbl_count').textContent = members.length;
        document.getElementById('lbl_max').textContent = currentPartySize;

        const tbody = document.getElementById('tabla-party-members');
        tbody.innerHTML = '';

        if (members.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No hay miembros registrados.</td></tr>';
            return;
        }

        tbody.innerHTML = members.map(m => `
            <tr>
                <td><strong>${m.user_id}</strong> ${m.user_id === currentParty.creator_id ? '(Creador)' : ''}</td>
                <td><span class="badge-role">${m.role}</span></td>
                <td>
                    <button class="btn-danger" onclick="removerMiembro('${m.user_id}')">Remove Member</button>
                </td>
            </tr>
        `).join('');
    }

    // --- 2. AÑADIR MIEMBRO (CON VALIDACIONES Y QUERY BD) ---
    function abrirModalAdd() {
        document.getElementById('add-error-banner').style.display = 'none';
        document.getElementById('form-add').reset();
        document.getElementById('modalAddMember').style.display = 'flex';
    }

    function cerrarModalAdd() {
        document.getElementById('modalAddMember').style.display = 'none';
    }

    async function validarYAñadir(e) {
        e.preventDefault();
        const userId = document.getElementById('new_user_id').value.trim();
        const role = document.getElementById('new_role').value;
        const errBanner = document.getElementById('add-error-banner');
        errBanner.style.display = 'none';

        const members = currentParty.party_members || [];

        // Validación Prueba 5: Límite de la party
        if (members.length >= currentPartySize) {
            mostrarErrorAdd("La party ya está llena. No se pueden añadir más miembros.");
            return;
        }

        // Validación Prueba 3: Roles únicos
        if (members.some(m => m.role === role)) {
            mostrarErrorAdd(`El rol ${role} ya está ocupado en esta party.`);
            return;
        }

        // Validación Prueba 2: El miembro ya está en la party
        if (members.some(m => String(m.user_id) === userId)) {
            mostrarErrorAdd(`El usuario ${userId} ya está en la party.`);
            return;
        }

        try {
            // Verificar que el usuario existe en guildmembers (Prueba 2)
            const resGuild = await fetch(`${API_BASE}/guildmembers`);
            const guildMembers = await resGuild.json();
            if (!guildMembers.some(m => String(m.user_id) === userId)) {
                mostrarErrorAdd(`El miembro ${userId} no existe en la base de datos de la guild.`);
                return;
            }

            // La API asigna al miembro un slot disponible según el tamaño de party.
            const res = await fetch(`${API_BASE}/partyfinder/${currentPartySize}/${currentParty.party_id}/addMember`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // La especificación del endpoint usa "role", pero el esquema
                // compartido de la API documenta "party_role". Enviar ambos
                // mantiene compatibilidad con las dos variantes del backend.
                body: JSON.stringify({ user_id: userId, role, party_role: role })
            });

            if (!res.ok) {
                const dataErr = await res.json().catch(() => ({}));
                throw new Error(dataErr.message || 'No se pudo añadir el miembro a la party.');
            }

            cerrarModalAdd();
            await cargarParty(currentParty.party_id, currentPartySize);

        } catch (error) {
            mostrarErrorAdd(error.message || 'Error al validar el miembro en el servidor.');
        }
    }

    function mostrarErrorAdd(msg) {
        const banner = document.getElementById('add-error-banner');
        banner.textContent = `❌ ${msg}`;
        banner.style.display = 'block';
    }

    // --- 3. REMOVER MIEMBRO ---
    async function removerMiembro(userId) {
        // Validación Prueba 4: No borrar al creador
        if (userId === currentParty.creator_id) {
            alert("❌ No se permite remover al creador de la party.");
            return;
        }

        if (!confirm(`¿Estás seguro de que deseas remover al usuario ${userId} de la party?`)) return;

        try {
            const res = await fetch(`${API_BASE}/partyfinder/${currentPartySize}/${currentParty.party_id}/removeMember`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });

            if (!res.ok) {
                const dataErr = await res.json().catch(()=>({}));
                throw new Error(dataErr.message || "Error al remover miembro.");
            }

            alert("Miembro removido exitosamente.");
            cargarParty(); // Recargar datos

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
