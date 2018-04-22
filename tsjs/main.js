"use strict";
(function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop); }); }; script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js'; document.head.appendChild(script); })();
console.log("main");
const scene = new THREE.Scene();
console.log(scene, "cool");
//# sourceMappingURL=main.js.map