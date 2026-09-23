document.addEventListener('DOMContentLoaded', function () {
    const xpathConsole = document.getElementById('xpathConsole');
    const iframe = document.getElementById('myIframe');

    function obtenerXPath(elemento) {
        if (!elemento || elemento.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        if (elemento.id) {
            return `//*[@id="${elemento.id}"]`;
        }

        if (elemento === elemento.ownerDocument.documentElement) {
            return `/${elemento.tagName.toLowerCase()}`;
        }

        let posicion = 1;
        let hermano = elemento.previousElementSibling;

        while (hermano) {
            if (hermano.tagName === elemento.tagName) {
                posicion++;
            }
            hermano = hermano.previousElementSibling;
        }

        return `${obtenerXPath(elemento.parentElement)}/${elemento.tagName.toLowerCase()}[${posicion}]`;
    }

    function mostrarXPath(evento) {
        const xpath = obtenerXPath(evento.target);

        if (xpathConsole) {
            xpathConsole.textContent = `El xpath es -> ${xpath}`;
        }

        alert(`XPath: ${xpath}`);
    }

    function activarClicksEnIframe() {
        if (!iframe) {
            return false;
        }

        try {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

            if (!iframeDocument || !iframeDocument.body) {
                return false;
            }

            iframeDocument.removeEventListener('click', mostrarXPath);
            iframeDocument.addEventListener('click', mostrarXPath);
            return true;
        } catch (error) {
            return false;
        }
    }

    function convertirDataIframeASrcdoc() {
        if (!iframe || iframe.dataset.srcdocPreparado === 'true') {
            return;
        }

        const src = iframe.getAttribute('src') || '';

        if (!src.startsWith('data:text/html')) {
            return;
        }

        iframe.dataset.srcdocPreparado = 'true';

        const contenidoHtml = src.substring(src.indexOf(',') + 1);
        iframe.removeAttribute('src');
        iframe.setAttribute('srcdoc', contenidoHtml);
    }

    document.addEventListener('click', mostrarXPath);

    if (iframe) {
        iframe.addEventListener('load', activarClicksEnIframe);

        if (!activarClicksEnIframe()) {
            convertirDataIframeASrcdoc();
        }
    }
});
