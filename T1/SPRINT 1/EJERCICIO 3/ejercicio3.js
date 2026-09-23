document.addEventListener('DOMContentLoaded', () => {
    // Selección de elementos del DOM
    const inputTexto = document.getElementById('itemInput');
    const btnAgregar = document.getElementById('btnAdd');
    const lista = document.getElementById('listaDinamica');

    // Función para añadir el elemento a la lista
    const agregarElemento = () => {
        const texto = inputTexto.value.trim();

        // Validar que el campo no esté vacío
        if (texto === '') {
            alert('Por favor, escribe algo antes de añadirlo a la lista.');
            return;
        }

        // Crear el nuevo ítem <li> usando document.createElement()
        const nuevoLi = document.createElement('li');
        nuevoLi.textContent = texto;

        // Agregar el <li> a la lista <ul> usando .appendChild()
        lista.appendChild(nuevoLi);

        // Limpiar el campo de entrada y devolver el foco
        inputTexto.value = '';
        inputTexto.focus();
    };

    // Evento al hacer clic en el botón
    btnAgregar.addEventListener('click', agregarElemento);

    // Permitir añadir presionando la tecla "Enter" en el input
    inputTexto.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            agregarElemento();
        }
    });
});