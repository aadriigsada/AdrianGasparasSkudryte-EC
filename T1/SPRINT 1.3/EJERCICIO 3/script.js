
    const API_URL = 'http://localhost:3000/guildmembers';
    let listaMiembrosActuales = [];
    let editMode = false;

    // Cargar miembros al iniciar
    document.addEventListener('DOMContentLoaded', cargarMiembros);

    async function cargarMiembros() {
        const tbody = document.getElementById('tabla-miembros');
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Error al conectar con la API.');
            
            listaMiembrosActuales = await res.json();
            renderizarTabla(listaMiembrosActuales);
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="7" style="color: red; text-align: center;">❌ No se pudieron cargar los miembros. Comprueba que MySQL esté iniciado en localhost:3306 y que la API esté iniciada en http://localhost:3000.</td></tr>`;
        }
    }

    function renderizarTabla(miembros) {
        const tbody = document.getElementById('tabla-miembros');
        if (!miembros || miembros.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No hay miembros registrados.</td></tr>`;
            return;
        }

        tbody.innerHTML = miembros.map(m => `
            <tr>
                <td><strong>${m.user_id}</strong></td>
                <td>${m.username}</td>
                <td>${m.level}</td>
                <td>${m.ilvl}</td>
                <td>${m.character_role}</td>
                <td>${m.guild_role}</td>
                <td>
                    <button class="btn-edit" onclick="abrirModalEditar('${m.user_id}')">Edit</button>
                    <button class="btn-delete" onclick="eliminarMiembro('${m.user_id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Manejo de Modal
    function abrirModalCrear() {
        editMode = false;
        ocultarError();
        document.getElementById('modal-titulo').textContent = "Add New Member";
        document.getElementById('form-miembro').reset();
        document.getElementById('user_id').disabled = false;
        document.getElementById('modalMiembro').style.display = "flex";
    }

    function abrirModalEditar(userId) {
        // La API puede devolver user_id como número aunque el botón lo pase como texto.
        const miembro = listaMiembrosActuales.find(m => String(m.user_id) === String(userId));
        if (!miembro) return;

        editMode = true;
        ocultarError();
        document.getElementById('modal-titulo').textContent = `Edit Member (${miembro.username})`;
        
        // Precargar Formulario
        document.getElementById('user_id').value = miembro.user_id;
        document.getElementById('user_id').disabled = true; // El user_id no se modifica al editar
        document.getElementById('username').value = miembro.username || '';
        document.getElementById('level').value = miembro.level ?? '';
        document.getElementById('ilvl').value = miembro.ilvl ?? '';
        document.getElementById('character_role').value = miembro.character_role || 'TANK';
        document.getElementById('guild_role').value = miembro.guild_role || 'MEMBER';
        document.getElementById('main_archetype').value = miembro.main_archetype || 'FIGHTER';
        document.getElementById('secondary_archetype').value = miembro.secondary_archetype || 'ROGUE';
        document.getElementById('grandmaster_profession_one').value = miembro.grandmaster_profession_one || 'MINING';
        document.getElementById('grandmaster_profession_two').value = miembro.grandmaster_profession_two || 'WEAPONSMITHING';
        document.getElementById('email').value = miembro.email || 'miembro@example.com';
        document.getElementById('notify_email').checked = miembro.notify_email !== false;

        document.getElementById('modalMiembro').style.display = "flex";
    }

    function cerrarModal() {
        document.getElementById('modalMiembro').style.display = "none";
        document.getElementById('form-miembro').reset();
        ocultarError();
    }

    // Validaciones y Submit (CRUD)
    async function guardarMiembro(e) {
        e.preventDefault();
        ocultarError();

        const userId = document.getElementById('user_id').value.trim();
        const email = document.getElementById('email').value.trim();

        // Validaciones
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            mostrarError("Por favor, introduce un correo electrónico válido.");
            return;
        }

        if (!editMode) {
            const existe = listaMiembrosActuales.some(m => String(m.user_id) === userId);
            if (existe) {
                mostrarError("El user_id ya existe en la guild. Debe ser único.");
                return;
            }
        }

        const payload = {
            user_id: userId,
            username: document.getElementById('username').value.trim(),
            level: parseInt(document.getElementById('level').value, 10),
            ilvl: parseInt(document.getElementById('ilvl').value, 10),
            character_role: document.getElementById('character_role').value,
            guild_role: document.getElementById('guild_role').value,
            main_archetype: document.getElementById('main_archetype').value,
            secondary_archetype: document.getElementById('secondary_archetype').value,
            grandmaster_profession_one: document.getElementById('grandmaster_profession_one').value,
            grandmaster_profession_two: document.getElementById('grandmaster_profession_two').value,
            email: email,
            notify_email: document.getElementById('notify_email').checked
        };

        try {
            let res;
            if (editMode) {
                // PUT /guildmembers/{user_id}
                res = await fetch(`${API_URL}/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // POST /guildmembers
                res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Error al guardar los datos en la API.');
            }

            cerrarModal();
            cargarMiembros(); // Recargar tabla
        } catch (error) {
            mostrarError(error.message);
        }
    }

    // DELETE /guildmembers/{user_id}
    async function eliminarMiembro(userId) {
        if (!confirm(`¿Estás seguro de que deseas eliminar al miembro con User ID "${userId}"?`)) return;

        try {
            const res = await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar el miembro de la API.');
            
            cargarMiembros();
        } catch (error) {
            alert(`❌ Error: ${error.message}`);
        }
    }

    function mostrarError(msg) {
        const banner = document.getElementById('error-banner');
        banner.textContent = `❌ ${msg}`;
        banner.style.display = 'block';
    }

    function ocultarError() {
        const banner = document.getElementById('error-banner');
        banner.style.display = 'none';
        banner.textContent = '';
    }
