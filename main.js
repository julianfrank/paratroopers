window.onload = () => {
    var g = new GameEngine({ dsds: "dsdfs" })
    addRefObjects(g)

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which
        let myBall = g.scene.getObjectByName("center")
        switch (keyCode) {
            case 37://Left key
                myBall.position.x--
                break;
            case 39://Right Key
                myBall.position.x++
                break;
            default:
                console.log(keyCode,myBall.position)
                break;
        }
    }
}
function addRefObjects(ge) {
    // Edge Objects
    var edgeConfig = [
        { x: ge.xMin, y: ge.yMin, z: 0, color: 0x000000, name: "000" },
        { x: ge.xMin, y: ge.yMin, z: 100, color: 0x0000ff, name: "001" },
        { x: ge.xMin, y: ge.yMax, z: 0, color: 0x00ff00, name: "010" },
        { x: ge.xMin, y: ge.yMax, z: 100, color: 0x00ffff, name: "011" },
        { x: ge.xMax, y: ge.yMin, z: 0, color: 0xff0000, name: "100" },
        { x: ge.xMax, y: ge.yMin, z: 100, color: 0xff00ff, name: "101" },
        { x: ge.xMax, y: ge.yMax, z: 0, color: 0xffff00, name: "110" },
        { x: ge.xMax, y: ge.yMax, z: 100, color: 0xffffff, name: "111" },

        { x: 0, y: 0, z: 0, color: "black", name: "origin" },
        { x: (ge.xMax + ge.xMin) / 2, y: (ge.yMax + ge.yMin) / 10, z: 50, color: "yellow", name: "center" }
    ]
    //Add spheres
    //SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
    var geometry = new THREE.SphereGeometry(25, 16, 16)
    //Add edge boxes
    edgeConfig.map((x) => {
        var zzz = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: x.color }))
        zzz.position.set(x.x, x.y, x.z)
        zzz.castShadow = true
        zzz.name = x.name
        //zzz.receiveShadow = true
        ge.scene.add(zzz)
    })

    /*var bomber = null;
    var loader = new THREE.JSONLoader();
    loader.load('./marmelab.json', function(geometry, materials) {
        bomber = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        bomber.scale.x = bomber.scale.y = bomber.scale.z = 33
        bomber.translation = geometry.center()
        bomber.position.x=320
        bomber.position.y=240
        bomber.position.z=50
        self.scene.add(bomber);
    })*/
}
