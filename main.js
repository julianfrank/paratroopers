window.onload = function () {
    var g = new Game()
    g.init({ test: "working", xMax: 80, yMax: 60 })
    g.fullInit()
    g.render()
}