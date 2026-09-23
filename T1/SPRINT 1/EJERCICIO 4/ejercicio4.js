document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los elementos div con la clase "caja"
    const contenedores = document.querySelectorAll('.caja');

    contenedores.forEach((div) => {
        // Guardar el color de fondo y de texto originales
        const colorFondoOriginal = div.style.backgroundColor || '#f0f0f0';
        const colorTextoOriginal = div.style.color || '#333333';

        // Evento al pasar el ratón sobre el div
        div.addEventListener('mouseover', () => {
            div.style.backgroundColor = 'blue';
            div.style.color = 'white';
        });

        // Evento al mover el ratón fuera del div
        div.addEventListener('mouseout', () => {
            div.style.backgroundColor = colorFondoOriginal;
            div.style.color = colorTextoOriginal;
        });
    });
});