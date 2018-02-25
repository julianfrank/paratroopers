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
  }
}

function startStuff() {
  // define document width and height
  var width = 640, height = 480
  // create SVG document and set its size
  var draw = SVG('gamescreen').size(width, height)
  draw.viewbox(0, 0, 640, 480)
  // draw background
  var background = draw.rect(width, height).fill('black')
  //debugBoard
  var debugBoard = draw.text("")
    .font({ size: 16, family: 'Menlo, sans-serif', anchor: 'middle', fill: '#888' })
    .move(width / 2, height / 3)
  function debugMsg(msg) { return debugBoard.text(msg + "\n" + debugBoard.text()) }
  debugMsg("Testing 1 2 3")

  var turret = {
    me: null,
    angle: 0,
    init: function () {
      draw.path('M320 480 h -10 s 10 -20 20 0 z').stroke({ width: 9, color: "green", linecap: 'round' }).fill("green")
      this.me = draw.line(320, 480, 320, 450).stroke({ width: 9, color: "green", linecap: 'round' })
      this.update()
    },
    left: function () {
      this.angle = Math.max(-45, this.angle - 1)
      this.update()
    },
    right: function () {
      this.angle = Math.min(45, this.angle + 1)
      this.update()
    },
    update: function () {
      this.me.rotate(this.angle, 320, 480)
    }
  }
  turret.init()

  let rConv = Math.PI / 180
  var bombs = {
    bombArray: [],
    init: function () {
      this.bombArray = []
    },
    newBomb: function (angle) {
      this.bombArray.push({
        x: 320, y: 480,
        vx: Math.sin(angle * rConv), vy: 1,
        sprite: draw.circle(5).fill("green")
      })
    },
    update: function () {
      this.bombArray.forEach((bomb, i) => {
        bomb.x += bomb.vx
        bomb.y = Math.max(-10, bomb.y - bomb.vy)
        bomb.sprite.center(bomb.x, bomb.y)
        planes.checkPlane(bomb.x,bomb.y)
        if (bomb.y == -10) delete this.bombArray[i]
      })
    }
  }
  bombs.init()

  var planes = {
    planesArray: [],
    init: function () { for (let i = 0; i < 4; i++) { this.newPlane() } },
    newPlane: function () {
      this.planesArray.push({
        x: -Math.round(Math.random() * 1000), y: Math.round(Math.random() * 200), vx: Math.round(Math.random() * 7) + 1,
        sprite: draw.path("M -100 -100 h 40 l 5 5 l -15 5 h -33 l -10 -20 h 5 0 z").fill("green")
      })
    },
    update: function () {
      this.planesArray.forEach((plane, i) => {
        this.planesArray[i].x += this.planesArray[i].vx
        if (this.planesArray[i].x > 650) {
          this.planesArray[i].x = -Math.round(Math.random() * 1000)
          this.planesArray[i].y = Math.round(Math.random() * 200)
          this.planesArray[i].vx = Math.round(Math.random() * 7) + 1
        }
        this.planesArray[i].sprite.center(this.planesArray[i].x, this.planesArray[i].y)
      })
    },
    checkPlane:function(x,y){
      this.planesArray.forEach((plane,i)=>{
        if (plane.sprite.inside(x,y)){
          debugMsg("hit "+plane.sprite.id())
          plane.sprite.remove()
          delete this.planesArray[i]
        }
      })
    }
  }
  planes.init()

  // update is called on every animation step
  function update(dt) {
    planes.update()
    bombs.update()
  }
  var lastTime, animFrame
  function callback(ms) {    // we get passed a timestamp in milliseconds we use it to determine how much time has passed since the last call
    if (lastTime) {
      update((ms - lastTime) / 1000) // call update and pass delta time in seconds
    }
    lastTime = ms
    animFrame = requestAnimationFrame(callback)
  }
  callback()

  SVG.on(document, 'keydown', function (e) {
    switch (e.keyCode) {
      case 37://Left Key or 'A'
      case 65:
      case 100:
        turret.left()
        break;
      case 39://Right Key or 'D'
      case 68:
      case 102:
        turret.right()
        break;
      case 38://Up Key or 'W'
      case 87:
      case 104:
        bombs.newBomb(turret.angle)
        break;
      case 40://Down Key or 'S'
      case 83:
      case 98:
        debugMsg("Down")
        break;
      case 32:
        debugMsg("Fire")
        break;
      default:
        debugMsg("e.keyCode=" + e.keyCode)
        break;
    }
    e.preventDefault()
  })
  SVG.on(document, 'keyup', function (e) { e.preventDefault() })
  draw.on('click', (e) => debugMsg(e.clientX + "," + e.clientY + ":" + e.target.id))

  function reset() {
    // visualize boom
    boom()

    // reset speed values
    vx = 0
    vy = 0

    // position the ball back in the middle
    ball.animate(100).center(width / 2, height / 2)

    // reset the position of the paddles
    paddleLeft.animate(100).cy(height / 2)
    paddleRight.animate(100).cy(height / 2)
  }


  // show visual explosion 
  function boom() {
    // detect winning player
    var paddle = ball.cx() > width / 2 ? paddleLeft : paddleRight
    // create the gradient
    var gradient = draw.gradient('radial', function (stop) {
      stop.at(0, paddle.attr('fill'), 1)
      stop.at(1, paddle.attr('fill'), 0)
    })
    // create circle to carry the gradient
    var blast = draw.circle(300)
    blast.center(ball.cx(), ball.cy()).fill(gradient)
    // animate to invisibility
    blast.animate(1000, '>').opacity(0).after(function () { blast.remove() })
  }


}