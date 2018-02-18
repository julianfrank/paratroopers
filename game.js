
var Game=function(){}
Game.prototype={
    scr:null,
    init:function(opts){
        console.log(opts)
        this.scr=document.getElementById(opts.scrEl||"screen")
        this.scr.innerText="SCR Working"
    }
}