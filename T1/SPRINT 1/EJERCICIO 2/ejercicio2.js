// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Selección de elementos del DOM
    const inputAncho = document.getElementById('ancho');
    const inputAlto = document.getElementById('alto');
    const btnCalcular = document.getElementById('btnCalcular');
    const pResultado = document.getElementById('resultado');

    // Listener para el evento click del botón
    btnCalcular.addEventListener('click', () => {
        // Obtener valores y convertirlos a números flotantes
        const ancho = parseFloat(inputAncho.value);
        const alto = parseFloat(inputAlto.value);

        // Validar que ambos campos contengan valores numéricos válidos
        if (isNaN(ancho) || isNaN(alto)) {
            pResultado.textContent = 'Por favor, introduce valores numéricos válidos en ambos campos.';
            return;
        }

        // Calcular el área (ancho x alto)
        const area = ancho * alto;

        // Mostrar el resultado en el párrafo <p>
        pResultado.textContent = `El área del rectángulo es: ${area}`;
    });
});