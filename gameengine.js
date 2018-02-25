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
  console.log(background.id())
  //debugBoard
  var debugBoard = draw.text("")
    .font({ size: 16, family: 'Menlo, sans-serif', anchor: 'middle', fill: '#888' })
    .move(width / 2, height / 3)
  function debugMsg(msg) { return debugBoard.text(msg + "\n" + debugBoard.text()) }
  debugMsg("testing")

  var turret = {
    me:null,
    angle:0,
    init:function(){
      this.me=draw.line(320, 480, 320, 450)
      this.me.stroke({ width: 5, color: "green" })
      console.log(this.angle)
      this.update()
    }    ,
    left:function(){
      this.angle=Math.max(-45,this.angle-1)
      this.update()
    },
    right:function(){
      this.angle=Math.min(45,this.angle+1)
      this.update()
    },
    update:function(){
      this.me.rotate(this.angle, 320, 480)
    }
  }
  turret.init()
  
  

  // define ball size
  //var ballSize = 10
  // create ball
  //var ball = draw.circle(ballSize)
  //ball.center(width / 2, height / 2).fill('#7f7f7f')


  // random velocity for the ball at start
  var vx = 0, vy = 0
  // AI difficulty
  var difficulty = 2
  // update is called on every animation step
  function update(dt) {
    // move the ball by its velocity
    //ball.dmove(vx * dt, vy * dt)
    // get position of ball
    //var cx = ball.cx()
    //, cy = ball.cy()
    //Check Collition
    //scoreLeft.text(playerLeft + '')
    //scoreRight.text(playerRight + '')
  }


  var lastTime, animFrame

  function callback(ms) {
    // we get passed a timestamp in milliseconds
    // we use it to determine how much time has passed since the last call
    if (lastTime) {
      update((ms - lastTime) / 1000) // call update and pass delta time in seconds
    }

    lastTime = ms
    animFrame = requestAnimationFrame(callback)
  }
  callback()

  var paddleDirection = 0
    , paddleSpeed = 5

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
        debugMsg("Up")
        break;
      case 40://Down Key or 'S'
      case 83:
      case 98:
        debugMsg("Down")
        break;
      default:
        debugMsg("e.keyCode=" + e.keyCode)
        break;
    }

    e.preventDefault()
  })
  SVG.on(document, 'keyup', function (e) { e.preventDefault() })

  draw.on('click', function (e) {
    console.log(e)
    debugMsg(e.clientX + "," + e.clientY + ":" + e.target.id)
  })

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


  // ball color update
  var ballColor = new SVG.Color('#ff0066')
  ballColor.morph('#00ff99')


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
    blast.animate(1000, '>').opacity(0).after(function () {
      blast.remove()
    })
  }


}