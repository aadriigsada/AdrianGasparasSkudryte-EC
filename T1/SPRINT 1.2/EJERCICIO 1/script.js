// 1. Selección de elementos del DOM
const secondsInput = document.getElementById('secondsInput');
const startBtn = document.getElementById('startBtn');
const timeDisplay = document.getElementById('timeDisplay');
const messageDisplay = document.getElementById('messageDisplay');
const scareOverlay = document.getElementById('scareOverlay');

// Variables para el control del temporizador y audio
let timerInterval = null;
let audioGrito = null;

// Cargar/Configurar audio del grito (puedes cambiar la URL si tienes un archivo .mp3 local)
function initAudio() {
  audioGrito = new Audio('https://assets.mixkit.co/active_storage/sfx/2173/2173-preview.mp3');
}

// 2. Función para iniciar la cuenta regresiva
function startTimer() {
  const inputSeconds = parseInt(secondsInput.value);

  // Validación básica
  if (isNaN(inputSeconds) || inputSeconds <= 0) {
    alert("Por favor, introduce un número válido de segundos mayor a cero.");
    return;
  }

  // Pre-cargar audio al hacer clic (necesario por políticas de reproducción en navegadores)
  if (!audioGrito) {
    initAudio();
  }

  // Limpiar cualquier intervalo anterior si existiera
  clearInterval(timerInterval);

  let remainingTime = inputSeconds;

  // Modificar interfaz al iniciar
  messageDisplay.innerText = "";
  timeDisplay.innerText = remainingTime + "s";
  startBtn.disabled = true;
  secondsInput.disabled = true;

  // 3. Método de temporización (setInterval)
  timerInterval = setInterval(() => {
    remainingTime--;

    // Actualizar pantalla en cada segundo
    timeDisplay.innerText = remainingTime + "s";

    // Cuando el tiempo llega a cero
    if (remainingTime <= 0) {
      // Detener el intervalo
      clearInterval(timerInterval);

      // Mostrar mensaje final
      messageDisplay.innerText = "¡Tiempo finalizado!";

      // Habilitar controles
      startBtn.disabled = false;
      secondsInput.disabled = false;

      // Disparar la broma (susto + grito)
      triggerScare();
    }
  }, 1000);
}

// 4. Función de la broma (Grito + Imagen de susto)
function triggerScare() {
  // Reproducir el audio del grito
  if (audioGrito) {
    audioGrito.currentTime = 0;
    audioGrito.play().catch(error => {
      console.log("El navegador bloqueó la reproducción automática del audio: ", error);
    });
  }

  // Mostrar la imagen a pantalla completa
  scareOverlay.style.display = 'flex';
}

// 5. Asignación de eventos (Click)
startBtn.addEventListener('click', startTimer);

// Evento para cerrar la imagen de susto haciendo clic sobre ella
scareOverlay.addEventListener('click', () => {
  scareOverlay.style.display = 'none';
  if (audioGrito) {
    audioGrito.pause();
  }
});