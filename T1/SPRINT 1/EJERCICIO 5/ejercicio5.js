document.addEventListener('DOMContentLoaded', () => {
    const consoleP = document.getElementById('xpathConsole');
    const iframe = document.querySelector('iframe'); // no depende del id

    const manejarClic = (e) => {
        // Solo reaccionar a botones
        if (e.target.tagName !== 'BUTTON') return;

        // XPath relativo: posición del botón dentro de SU documento
        const index = Array.from(e.target.ownerDocument.querySelectorAll('button')).indexOf(e.target) + 1;
        const xpath = `//button[${index}]`;

        // frameElement es el iframe si el clic viene de dentro de uno; null en la página principal
        const marco = e.target.ownerDocument.defaultView.frameElement;
        const infoId = marco
            ? ` (iframe id: ${marco.id || 'sin id'})`         // botón del iframe -> id del iframe
            : ` (button id: ${e.target.id || 'sin id'})`;     // botón principal -> id del propio botón

        consoleP.textContent = `El xpath es -> ${xpath}${infoId}`;
        alert(`XPath: ${xpath}${infoId}`);
    };

    // Clics en la página principal
    document.addEventListener('click', manejarClic);

    // Clics dentro del iframe
    if (iframe) {
        // Primero el listener de load, luego srcdoc, para no perder el evento
        iframe.addEventListener('load', () => {
            iframe.contentDocument.addEventListener('click', manejarClic);
        });

        // Convertir data: a srcdoc para evitar el bloqueo de origen
        const src = iframe.getAttribute('src');
        if (src && src.startsWith('data:')) {
            iframe.srcdoc = decodeURIComponent(src.substring(src.indexOf(',') + 1));
        }
    }
});