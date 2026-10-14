// 1. Objeto para almacenar el conteo de votos por opción
const votos = {
  Rojo: 0,
  Azul: 0,
  Verde: 0,
  Amarillo: 0
};

let totalVotos = 0;

// 2. Selección de elementos del DOM
const btnEnviar = document.getElementById('btnEnviar');
const mensajeError = document.getElementById('mensajeError');
const chartContainer = document.getElementById('chartContainer');
const spanTotalVotos = document.getElementById('totalVotos');

// 3. Función para renderizar / actualizar el gráfico de barras dinámicamente
function actualizarGrafico() {
  chartContainer.innerHTML = ''; // Limpiar contenedor

  // Recorrer cada opción para dibujar su barra
  for (const [opcion, cantidad] of Object.entries(votos)) {
    // Calcular el porcentaje relativo al total de votos
    const porcentaje = totalVotos > 0 ? ((cantidad / totalVotos) * 100).toFixed(1) : 0;

    // Crear elementos de la barra
    const container = document.createElement('div');
    container.className = 'bar-container';

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.innerText = `${opcion}: ${cantidad} voto(s) (${porcentaje}%)`;

    const wrapper = document.createElement('div');
    wrapper.className = 'bar-wrapper';

    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = `${porcentaje}%`;

    // Ensamblar la estructura en el DOM
    wrapper.appendChild(fill);
    container.appendChild(label);
    container.appendChild(wrapper);

    chartContainer.appendChild(container);
  }

  // Actualizar el total de votos en pantalla
  spanTotalVotos.innerText = totalVotos;
}

// 4. Manejo del evento Click en el botón "Enviar"
btnEnviar.addEventListener('click', () => {
  // Obtener la opción seleccionada entre los radio buttons
  const opcionSeleccionada = document.querySelector('input[name="color"]:checked');

  // Validación: verificar que el usuario haya seleccionado una opción
  if (!opcionSeleccionada) {
    mensajeError.innerText = "Por favor, selecciona un color antes de votar.";
    return;
  }

  mensajeError.innerText = ""; // Limpiar mensaje de error si existía

  const valor = opcionSeleccionada.value;

  // Incrementar votos
  votos[valor]++;
  totalVotos++;

  // Desmarcar la opción seleccionada
  opcionSeleccionada.checked = false;

  // Actualizar la representación visual en la página
  actualizarGrafico();
});

// Inicializar el gráfico con valores en 0
actualizarGrafico();