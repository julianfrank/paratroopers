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
        this.drawBox({X:0,Y:0},{X:this.xMax,Y:this.yMax},{fillColor:this.backgroundColor})
        this.drawRect({X:0,Y:0},{X:this.xMax,Y:this.yMax})
    },
    setColor: function (lineColor) { this.scn.strokeStyle = lineColor },
    setWidth: function (width) { this.scn.lineWidth = width },
    setFillColor: function (fillColor) { this.scn.fillStyle = fillColor },
    drawRect: function (startPos, endPos,fillColor) { 
        var buff=this.scn.fillStyle
        this.scn.beginPath()
        this.scn.fillStyle=fillColor||this.scn.fillStyle
        this.scn.rect(startPos.X, startPos.Y, endPos.X, endPos.Y) 
        this.scn.stroke()
        this.scn.fillStyle=buff
        delete buff
    },
    drawBox: function (startPos, endPos,fillColor) { 
        var buff=this.scn.fillStyle
        this.scn.beginPath()
        this.scn.fillStyle=fillColor
        this.scn.fillRect(startPos.X, startPos.Y, endPos.X, endPos.Y) 
        this.scn.stroke()
        this.scn.fillStyle=buff
        delete buff
    }
}