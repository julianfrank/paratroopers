window.onload = function () {
    var g = new Game()
    g.init({ test: "working", xMax: 80, yMax: 60 })
    g.fullInit()
    g.render()

    var start = null;
    var element = document.getElementById('screen');
    element.style.position = 'absolute';

    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        element.style.left = Math.min(progress /10, 400) + 'px';
        if (progress < 4000) {
            window.requestAnimationFrame(step);
        }else{
            start=true
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}