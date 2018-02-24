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

  // draw line
  //var line = draw.line(width / 2, 0, width / 2, height)
  //line.stroke({ width: 5, color: 'green', dasharray: '5,5' })
  // define paddle width and height
  //var paddleWidth = 15, paddleHeight = 80
  // create and position left paddle
  //var paddleLeft = draw.rect(paddleWidth, paddleHeight)
  //paddleLeft.x(0).cy(height / 2).fill('#00ff99')
  // define ball size
  //var ballSize = 10
  // create ball
  //var ball = draw.circle(ballSize)
  //ball.center(width / 2, height / 2).fill('#7f7f7f')
  // define inital player score
  //var playerLeft = playerRight = 0
  // create text for the score, set font properties
  /*var scoreLeft = draw.text(playerLeft + '').font({
    size: 32,
    family: 'Menlo, sans-serif',
    anchor: 'end',
    fill: '#fff'
  }).move(width / 2 - 10, 10)*/

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
    paddleDirection = e.keyCode == 40 ? 1 : e.keyCode == 38 ? -1 : 0
    e.preventDefault()
  })

  SVG.on(document, 'keyup', function (e) {
    paddleDirection = 0
    e.preventDefault()
  })

  draw.on('click', function () {
    if (vx === 0 && vy === 0) {
      vx = Math.random() * 500 - 150
      vy = Math.random() * 500 - 150
    }
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
  var debugBoard = draw.text("")
    .font({ size: 32, family: 'Menlo, sans-serif', anchor: 'start', fill: '#888' })
  function debugMsg(msg) {
    return debugBoard
      .text(msg)
      .animate(111)
      .move((width - debugBoard.length()) / 2, 4)
  }
  debugMsg("testing")
  debugMsg("Again testing ")
  debugMsg("This is what I want to show")

}