
var Game = function () { }
Game.prototype = {
    scr: null,//Screen Element
    gameWorld: { 0: { 0: { 0: {} } } },//Array to store World State
    gamesize: { xMax: 1, yMax: 1, zMax: 1 },//Size of the world
    init: function (opts) {
        //console.debug(opts)
        //init screen element binding
        this.scr = document.getElementById(opts.scrEl || "screen")
        this.scr.innerText = "SCR Working"
        //init Game World
        this.gamesize.xMax = opts.xMax ? opts.xMax : this.gamesize.xMax
        this.gamesize.yMax = opts.yMax ? opts.yMax : this.gamesize.yMax
        this.gamesize.zMax = opts.zMax ? opts.zMax : this.gamesize.zMax

    },
    fullInit: function () {
        //This can be removed in the final version.Meant to test setWorld only
        for (let xInd = 0; xInd < this.gamesize.xMax; xInd++) {
            for (let yInd = 0; yInd < this.gamesize.yMax; yInd++) {
                for (let zInd = 0; zInd < this.gamesize.zMax; zInd++) {
                    //console.debug(xInd,yInd,zInd)
                    this.setWorld(xInd, yInd, zInd, { test: "working" })
                }
            }
        }
        console.log(this.gameWorld)
    },
    setWorld: function (x, y, z, obj) {
        console.debug(x, y, z, obj)
        if (this.gameWorld[x]) {
            if (this.gameWorld[x][y]) {
                this.gameWorld[x][y][z] = obj
            } else {
                zTemp = {}
                zTemp[z] = obj
                this.gameWorld[x][y] = zTemp
                //console.debug("new yz entry made for ", x, y, z, obj)
            }
        } else {
            zTemp = {}
            zTemp[z] = obj
            yTemp = {}
            yTemp[y] = zTemp
            this.gameWorld[x] = yTemp
            //console.debug("new xyz entry made for ", x, y, z, obj)
        }
    },
    render: function () {
        for (const xVal in this.gameWorld) {
            for (const yVal in this.gameWorld[xVal]) {
                for (const zVal in this.gameWorld[xVal][yVal]) {
                    console.debug(xVal, yVal, zVal, this.gameWorld[xVal][yVal], zVal)
                }
            }
        }
    }
}

