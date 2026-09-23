// 1. Seleccionamos el botón del HTML usando su id
const boton = document.getElementById('miBoton');

// 2. Función para generar un color hexadecimal aleatorio
function generarColorAleatorio() {
    // Los colores HEX usan 16 caracteres: del 0 al 9 y de la A a la F
    const caracteres = '0123456789ABCDEF';
    let color = '#';

    // Bucle que se repite 6 veces para generar los 6 dígitos del color
    for (let i = 0; i < 6; i++) {
        // Math.random() genera un decimal entre 0 y 1 (ej: 0.832)
        // Multiplicamos por 16 para abarcar las 16 posiciones (0 a 15.99)
        // Math.floor() redondea hacia abajo a un número entero (0 a 15)
        const indiceAleatorio = Math.floor(Math.random() * 16);
        
        // Añadimos el carácter correspondiente según la posición obtenida
        color += caracteres[indiceAleatorio];
    }

    return color; // Ejemplo de retorno: "#4A90E2"
}

// 3. Escuchamos el evento de clic en el botón
boton.addEventListener('click', function() {
    // Llamamos a la función para obtener un nuevo color
    const nuevoColor = generarColorAleatorio();
    
    // Aplicamos el nuevo color al fondo de la página (document.body)
    document.body.style.backgroundColor = nuevoColor;
});