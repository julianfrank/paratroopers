window.onload=function(){
    var scr=document.getElementById("gamescreen")
    var ctx = scr.getContext("2d")
    
    
    ctx.strokeStyle="#00FF00"
    ctx.lineWidth="1"

    ctx.beginPath()
    //ctx.fillStyle="#00FF00"
    ctx.rect(0,0,635,475)
    ctx.stroke()

    ctx.beginPath()
    ctx.fillStyle="#000000"
    ctx.fillRect(4,4,630,470)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineCap="round"//context.lineCap="butt|round|square";
    ctx.lineJoin="round"//context.lineJoin="bevel|round|miter";
    ctx.moveTo(320,240)
    ctx.lineTo(200,100)
    ctx.lineTo(600,48)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(100,100)
    ctx.quadraticCurveTo(100,250,200,250)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(100,100)
    ctx.arcTo(100,250,200,250,10)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(100,100)
    ctx.bezierCurveTo(100,250,200,200,200,250)
    ctx.stroke()
}