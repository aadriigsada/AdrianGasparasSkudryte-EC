// 1. Selección de elementos del DOM
const secondsInput = document.getElementById('secondsInput');
const startBtn = document.getElementById('startBtn');
const timeDisplay = document.getElementById('timeDisplay');
const messageDisplay = document.getElementById('messageDisplay');
const scareOverlay = document.getElementById('scareOverlay');
const floatingAlert = document.getElementById('floatingAlert');

// Variables para el control del temporizador y audio
let timerInterval = null;
let audioGrito = null;

// Cargar/Configurar audio del grito
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

  // Pre-cargar audio al hacer clic
  if (!audioGrito) {
    initAudio();
  }

  // Limpiar cualquier intervalo e interfaz previa
  clearInterval(timerInterval);
  floatingAlert.style.display = 'none';

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

      // Mostrar mensaje en texto y en la alerta flotante
      messageDisplay.innerText = "¡Tiempo finalizado!";
      floatingAlert.style.display = 'block';

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
  scareOverlay.style.display = 'block';
}

// 5. Asignación de eventos (Click)
startBtn.addEventListener('click', startTimer);

// Evento para cerrar la imagen de susto y la alerta al hacer clic
scareOverlay.addEventListener('click', () => {
  scareOverlay.style.display = 'none';
  floatingAlert.style.display = 'none';
  if (audioGrito) {
    audioGrito.pause();
  }
});