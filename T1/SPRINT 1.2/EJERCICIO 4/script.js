// 1. Selección de elementos del DOM
const timeDisplay = document.getElementById('timeDisplay');
const btnIniciar = document.getElementById('btnIniciar');
const btnPausar = document.getElementById('btnPausar');
const btnReiniciar = document.getElementById('btnReiniciar');

// Variables para el control del tiempo e intervalo
let totalSegundos = 0;
let cronometroInterval = null;

// 2. Función auxiliar para formatear los números (añadir 0 si es menor de 10)
function formatearTiempo(segundosTotales) {
  const minutos = Math.floor(segundosTotales / 60);
  const segundos = segundosTotales % 60;

  const minFormatted = minutos < 10 ? `0${minutos}` : minutos;
  const segFormatted = segundos < 10 ? `0${segundos}` : segundos;

  return `${minFormatted}:${segFormatted}`;
}

// 3. Función para actualizar la pantalla
function actualizarPantalla() {
  timeDisplay.innerText = formatearTiempo(totalSegundos);
}

// 4. Lógica de los eventos (Click)

// INICIAR
btnIniciar.addEventListener('click', () => {
  // Evitar múltiples intervalos si se pulsa varias veces el botón "Iniciar"
  if (cronometroInterval !== null) return;

  cronometroInterval = setInterval(() => {
    totalSegundos++;
    actualizarPantalla();
  }, 1000);
});

// PAUSAR
btnPausar.addEventListener('click', () => {
  clearInterval(cronometroInterval);
  cronometroInterval = null; // Liberar la variable del intervalo
});

// REINICIAR
btnReiniciar.addEventListener('click', () => {
  // Detener el intervalo si está en ejecución
  clearInterval(cronometroInterval);
  cronometroInterval = null;

  // Resetear contador a 0 y actualizar el DOM
  totalSegundos = 0;
  actualizarPantalla();
});