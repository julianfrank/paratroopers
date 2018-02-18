window.onload=function(){
    
    var game = new Game({name:"Paratroopers"})
    game.setWidth(1)
    game.drawBox({X:600,Y:400},{X:20,Y:40},"green")
    game.drawRect({X:0,Y:0},{X:100,Y:100},"blue")
    game.drawQCurve({X:100,Y:100},{X:200,Y:-100},{X:300,Y:100},"brown")
    game.drawBCurve({X:100,Y:100},{X:200,Y:300},{X:250,Y:0},{X:300,Y:100},"green")
    game.drawArc({X:300,Y:300},{X:350,Y:101},{X:300,Y:0},100,"lightblue")
    game.drawLines({X:300,Y:200},"pink",false,false,{X:400,Y:200},{X:300,Y:300},{X:400,Y:300})

}