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
  uuidv4: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  initWithOpts: function (opts) {
    this.xMax = opts.xMax ? opts.xMax : this.Defaults.xMax
    this.yMax = opts.yMax ? opts.yMax : this.Defaults.yMax
    this.scrEl = opts.scrEl ? opts.scrEl : this.Defaults.scrEl
    this.borderColor = opts.borderColor ? opts.borderColor : this.Defaults.borderColor
    this.borderWidth = opts.borderWidth ? opts.borderWidth : this.Defaults.borderWidth
    this.backgroundColor = opts.backgroundColor ? opts.backgroundColor : this.Defaults.backgroundColor
    this.setupScreen()
  },
  baseEl: null,
  svg: null,
  ns: 'http://www.w3.org/2000/svg',
  setupScreen: function () {
    this.baseEl = document.getElementById(this.scrEl)
    this.svg = document.createElementNS(this.ns, 'svg')
    this.svg.setAttributeNS(null, 'width', this.xMax)
    this.svg.setAttributeNS(null, 'height', this.yMax)
    this.baseEl.appendChild(this.svg)
  },
  /**
   * @name drawRect
   * 
   * @param {JSON} startPos {X:start XPos,Y:start YPos}
   * @param {JSON} endPos {X:xlen relative to startPos,Y:ylen}
   * @param {String} strokeColor Canvas color
   */
  drawRect: function (startPos, size, borderRadius, color) {
    let rect = document.createElementNS(this.ns, 'rect')
    rect.setAttributeNS(this.ns, 'width', size.width)
    rect.setAttributeNS(this.ns, 'height', size.height)
    rect.setAttributeNS(null, 'fill', color)
    this.svg.appendChild(rect)
  },
  drawBox: function (startPos, size, fillColor) {
  },
  drawQCurve: function (startPos, pivot, endPos, strokeColor) {

  },
  drawBCurve: function (startPos, pivot1, pivot2, endPos, strokeColor) {

  },
  drawArc: function (startPos, tan1, tan2, radius, strokeColor) {

  },
  drawLines: function (startPos, strokeColor, lineCap, lineJoin, ...points) {

  }
}