window.onload = function () {
    if (!SVG.supported) { alert('SVG not supported') }
}
SVG.on(document, 'DOMContentLoaded', function () { startStuff() })