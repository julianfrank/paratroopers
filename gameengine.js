var Game = function (opts) {
    this.initWithOpts(opts)
}

Game.prototype = {
    Defaults: {
        xMax: 640,
        yMax: 480,
        scrEl: "gamescreen",
        borderColor: "#FFFFFF",
        borderWidth: "4",
        backgroundColor: "#000000"
    },
    initWithOpts(opts) {
        this.xMax = opts.xMax ? opts.xMax : this.Defaults.xMax
        this.yMax = opts.yMax ? opts.yMax : this.Defaults.yMax
        this.scrEl = opts.scrEl ? opts.scrEl : this.Defaults.scrEl
        this.borderColor = opts.borderColor ? opts.borderColor : this.Defaults.borderColor
        this.borderWidth = opts.borderWidth ? opts.borderWidth : this.Defaults.borderWidth
        this.backgroundColor = opts.backgroundColor ? opts.backgroundColor : this.Defaults.backgroundColor
        this.setupScreen()
    },
    scr: null,
    scn: null,
    setupScreen: function () {
        this.scr = document.getElementById("gamescreen")
        this.scn = this.scr.getContext("2d")
        this.setColor(this.borderColor)
        this.setWidth(this.borderWidth)
        this.drawBox({ X: 0, Y: 0 }, { X: this.xMax, Y: this.yMax }, { fillColor: this.backgroundColor })
        this.drawRect({ X: 0, Y: 0 }, { X: this.xMax, Y: this.yMax })
    },
    setColor: function (lineColor) { this.scn.strokeStyle = lineColor },
    setAlpha: function (alpha) { this.scn.globalAlpha = alpha },
    setWidth: function (width) { this.scn.lineWidth = width },
    /**
     * @name drawRect
     * 
     * @param {JSON} startPos {X:start XPos,Y:start YPos}
     * @param {JSON} endPos {X:xlen relative to startPos,Y:ylen}
     * @param {String} strokeColor Canvas color
     */
    drawRect: function (startPos, endPos, strokeColor) {
        var buff = this.scn.strokeStyle
        this.scn.beginPath()
        this.scn.strokeStyle = strokeColor || this.scn.strokeStyle
        this.scn.rect(startPos.X, startPos.Y, endPos.X, endPos.Y)
        this.scn.stroke()
        this.scn.strokeStyle = buff
        delete buff
    },
    drawBox: function (startPos, endPos, fillColor) {
        var buff = this.scn.fillStyle
        this.scn.beginPath()
        this.scn.fillStyle = fillColor
        this.scn.fillRect(startPos.X, startPos.Y, endPos.X, endPos.Y)
        this.scn.stroke()
        this.scn.fillStyle = buff
        delete buff
    },
    drawQCurve: function (startPos, pivot, endPos, strokeColor) {
        var buff = this.scn.strokeStyle
        this.scn.beginPath()
        this.scn.strokeStyle = strokeColor || this.scn.strokeStyle
        this.scn.moveTo(startPos.X, startPos.Y)
        this.scn.quadraticCurveTo(pivot.X, pivot.Y, endPos.X, endPos.Y)
        this.scn.stroke()
        this.scn.strokeStyle = buff
        delete buff
    },
    drawBCurve: function (startPos, pivot1, pivot2, endPos, strokeColor) {
        var buff = this.scn.strokeStyle
        this.scn.beginPath()
        this.scn.strokeStyle = strokeColor || this.scn.strokeStyle
        this.scn.moveTo(startPos.X, startPos.Y)
        this.scn.bezierCurveTo(pivot1.X, pivot1.Y, pivot2.X, pivot2.Y, endPos.X, endPos.Y)
        this.scn.stroke()
        this.scn.strokeStyle = buff
        delete buff
    },
    drawArc: function (startPos, tan1, tan2, radius, strokeColor) {
        var buff = this.scn.strokeStyle
        this.scn.beginPath()
        this.scn.strokeStyle = strokeColor || this.scn.strokeStyle
        this.scn.moveTo(startPos.X, startPos.Y)
        this.scn.arcTo(tan1.X, tan1.Y, tan2.X, tan2.Y, radius)
        this.scn.stroke()
        this.scn.strokeStyle = buff
        delete buff
    },
    drawLines: function (startPos, strokeColor, lineCap, lineJoin, ...points) {
        var buff = this.scn.strokeStyle
        this.scn.beginPath()
        this.scn.strokeStyle = strokeColor || this.scn.strokeStyle
        this.scn.lineCap = lineCap || "round"//"butt|round|square"
        this.scn.lineJoin = lineJoin || "round"//"bevel|round|miter";
        this.scn.moveTo(startPos.X, startPos.Y)
        for (const nextPoint of points) { this.scn.lineTo(nextPoint.X, nextPoint.Y) }
        this.scn.stroke()
        this.scn.strokeStyle = buff
        delete buff
    }
}