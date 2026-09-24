document.addEventListener('DOMContentLoaded', function () {
    const xpathConsole = document.getElementById('xpathConsole');
    const iframe = document.getElementById('myIframe');

    // Función pura de XPath estructural (sin usar IDs)
    function obtenerXPathEstructural(elemento) {
        if (!elemento || elemento.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        // Caso base: llegamos al inicio (etiqueta HTML)
        if (elemento.tagName.toLowerCase() === 'html') {
            return '/html';
        }

        let posicion = 1;
        let hermano = elemento.previousElementSibling;

        // Calcular posición del elemento entre sus hermanos iguales
        while (hermano) {
            if (hermano.tagName === elemento.tagName) {
                posicion++;
            }
            hermano = hermano.previousElementSibling;
        }

        const rutaPadre = obtenerXPathEstructural(elemento.parentElement);
        return `${rutaPadre}/${elemento.tagName.toLowerCase()}[${posicion}]`;
    }

    function mostrarXPath(evento) {
        const elementoClickeado = evento.target;

        // RESTRICCIÓN: Solo actuamos si el clic fue sobre un <button>
        if (elementoClickeado.tagName.toLowerCase() !== 'button') {
            return; // Si no es un botón, ignoramos el clic
        }

        // Generamos el XPath usando la versión estructural sin IDs
        const xpath = obtenerXPathEstructural(elementoClickeado);

        if (xpathConsole) {
            xpathConsole.textContent = `El xpath es -> ${xpath}`;
        }

        alert(`XPath: ${xpath}`);
    }

    function activarClicksEnIframe() {
        if (!iframe) return false;

        try {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

            if (!iframeDocument || !iframeDocument.body) return false;

            iframeDocument.removeEventListener('click', mostrarXPath);
            iframeDocument.addEventListener('click', mostrarXPath);
            return true;
        } catch (error) {
            return false;
        }
    }

    function convertirDataIframeASrcdoc() {
        if (!iframe || iframe.dataset.srcdocPreparado === 'true') return;

        const src = iframe.getAttribute('src') || '';
        if (!src.startsWith('data:text/html')) return;

        iframe.dataset.srcdocPreparado = 'true';

        const contenidoHtml = src.substring(src.indexOf(',') + 1);
        iframe.removeAttribute('src');
        iframe.setAttribute('srcdoc', contenidoHtml);
    }

    // Event listener en el documento principal
    document.addEventListener('click', mostrarXPath);

    // Preparación del Iframe
    if (iframe) {
        iframe.addEventListener('load', activarClicksEnIframe);

        if (!activarClicksEnIframe()) {
            convertirDataIframeASrcdoc();
        }
    }
});