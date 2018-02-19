window.onload = function () {

    var game = new Game({ name: "Paratroopers" })
    game.drawBox({ X: 600, Y: 400 }, { X: 20, Y: 40 }, "green")
    game.drawRect({ x: 0, y: 0 }, { width: 100, height: 100 }, {}, "blue")
    game.drawQCurve({ X: 100, Y: 100 }, { X: 200, Y: -100 }, { X: 300, Y: 100 }, "brown")
    game.drawBCurve({ X: 100, Y: 100 }, { X: 200, Y: 300 }, { X: 250, Y: 0 }, { X: 300, Y: 100 }, "green")
    game.drawArc({ X: 300, Y: 300 }, { X: 350, Y: 101 }, { X: 300, Y: 0 }, 100, "lightblue")
    game.drawLines({ X: 300, Y: 200 }, "pink", false, false, { X: 400, Y: 200 }, { X: 300, Y: 300 }, { X: 400, Y: 300 })

    for (let i = 0; i < 10; i++) {
        let xP = 300 + Math.cos(i) * 100
        let yP = 300 + Math.sin(i) * 100
        game.drawLines({ X: 300, Y: 300 }, "green", false, false, { X: xP, Y: yP })
    }
}