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
  var draw = new SVG('gamescreen').size(640, 480)
  var rect = draw.rect(100, 100).attr({ fill: '#f06' })

  //var link = draw.link('http://svgdotjs.github.io/')
  //link.show("Dumbledoor")
  //var rect = link.rect(200, 200).move(100, 100).radius(100, 100)
  //var circle = draw.circle(100).animate(500).move(400, 100).attr({ fill: "red" })
  //var ellipse = draw.ellipse(100, 50).move(300, 100)
  //var ellipse2 = draw.ellipse(100, 50).move(500, 100)
  //ellipse2.radius(25, 50)
  //var line = draw.line(50, 50, 100, 150).stroke({ width: 5 })
  //var polyline = draw.polyline('0,0 100,50 50,100').fill('none').stroke({ width: 5 })
  //polyline.animate(3000).plot([[0, 0], [100, 50], [50, 100], [150, 50], [200, 50], [250, 100], [300, 50], [350, 50]])

  //var polygon = draw.polygon('0,0 100,50 50,100').fill('none').stroke({ width: 1 }).animate(2000).move(300, 200)
  //polygon.animate(3000).plot([[0, 0], [100, 50], [50, 100], [150, 50], [200, 50], [250, 100], [300, 50], [350, 50]])

  //var path = draw.path('M0 0 H50 A20 20 0 1 0 100 50 v25 C50 125 0 85 0 85 z')
  //path.animate(2000).plot('M10 80 C 40 150, 65 150, 95 80 S 150 10, 180 80').loop(true, true)

  //var text = draw.text("Lorem ipsum dolor sit amet consectetur.\nCras sodales imperdiet auctor.")
  /*var text = draw.text(function (add) {
    add.tspan('Lorem ipsum dolor sit amet ').newLine()
    add.tspan('consectetur').fill('#f06')
    add.tspan('.')
    add.tspan('Cras sodales imperdiet auctor.').newLine().dx(20)
    add.tspan('Nunc ultrices lectus at erat').newLine()
    add.tspan('dictum pharetra elementum ante').newLine()
  })*/
  //var text = draw.text('I know that eggs do well to stay out of frying pans.')
  //text.move(20, 20).font({ fill: '#f06', family: 'Inconsolata' })
  /*var text = draw.text(function (add) {
    add.tspan('We go ')
    add.tspan('up').fill('#f09').dy(-40)
    add.tspan(', then we go down, then up again').dy(40)
  })
  var path = 'M 100 200 C 200 100 300 0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100'
  text.path(path).font({ size: 42.5, family: 'Verdana' })
}*/

  /*var image = draw.image('https://www.gstatic.com/webp/gallery3/1.png').loaded(function (loader) {
    this.size(loader.width, loader.height)
  })
  image.move(200, 200)*/
  /*
    var pattern = draw.pattern(20, 20, function (add) {
      add.rect(20, 20).fill('#f06')
      add.rect(10, 10).fill('#0f9')
      add.rect(10, 10).move(10, 10).fill('#fff')
    })
    pattern.update(function (add) {
      add.circle(15).center(10, 10)
    })
    draw.rect(100, 100).move(20, 20).radius(10).fill(pattern)*/

  /*var ellipse = draw.ellipse(80, 40).move(10, 10).fill({ color: '#fff' })
  var text = draw.text('SVG.JS').move(10, 10).font({ size: 36 }).fill({ color: '#fff' })
  var mask = draw.mask().add(text).add(ellipse)
  draw.rect(100, 100).maskWith(mask)*/

  /*var rect = draw.rect(100, 100).fill('#f09')
  var use = draw.use(rect).move(200, 200)
  rect.animate(2000).fill("green")*/

  /*var path = draw.path('M0 0 A50 50 0 0 1 50 50 A50 50 0 0 0 100 100')
  path.fill('none').move(20, 20).stroke({ width: 1, color: '#ccc' })
  path.marker('start', 10, 10, function (add) {
    add.circle(10).fill('#f06')
  })
  path.marker('mid', 10, 10, function (add) {
    add.rect(5, 10).cx(5).fill('#ccc')
  })
  path.marker('end', 20, 20, function (add) {
    add.circle(6).center(4, 5)
    add.circle(6).center(4, 15)
    add.circle(6).center(12, 10)
    this.fill('#0f9')
  })*/

  // draw transformed rect
  /*var rect = draw.rect(175, 175).move(75, 75).rotate(20).scale(1, 0.5)
  // draw bbox
  var b = rect.bbox()
  draw.rect(b.width, b.height).addClass('box').move(b.x, b.y)*/
  //rect.animate(1000).move(600, 100).loop(null, true)

  var ellipse = draw.ellipse(100, 100).attr('cx', '20%').fill('#333')

  rect.animate(3000).move(100, 100).during(function (pos, morph, eased, situation) {
    // numeric values
    ellipse.size(morph(100, 200), morph(100, 50))

    // unit strings
    ellipse.attr('cx', morph('20%', '80%'))

    // hex color strings
    ellipse.fill(morph('#333', '#ff0066'))
  }).loop(null, true)
}