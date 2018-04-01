window.onload = () => {
    var g = new GameEngine({ xMin: 0, xMax: 1920, yMin: 0, yMax: 1080 })
    addRefObjects(g)
    addBunker(g)

    var p = new TryBones()
    g.scene.add(p.mesh)

    p.mesh.position.set(1000, 550, 2800)
    g.scene.add(p.helper)

    g.addActor(p)

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which
        let myBall = g.scene.getObjectByName("center"),
            bomber = g.scene.getObjectByName("bomber"),
            siloLid = g.scene.getObjectByName("silolid")

        switch (keyCode) {
            case 37://Left key
                p.bones[2].rotation.x -= 11 * (Math.PI / 180)
                break;
            case 38://Up Key
                p.bones[1].position.y += 10//(Math.PI / 180)
                break;
            case 39://Right Key
                p.bones[2].rotation.x += 11 * (Math.PI / 180)
                break;
            case 40://Down Key
                p.bones[1].position.y -= 10//(Math.PI / 180)
                break;
            default:
                console.log(keyCode, p)
                break;
        }
    }
}

function addBunker(ge) {

    new THREE.TextureLoader().load('assets/rustyiron.jpg',
        (texture) => {
            var siloLid = new THREE.Mesh(
                //CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
                new THREE.CylinderGeometry(100, 100, 10, 100),
                new THREE.MeshPhongMaterial({ map: texture })
            )
            siloLid.position.set(1920 / 2, 5, 100)
            siloLid.up = new THREE.Vector3(0, 1, 0)
            siloLid.name = "silolid"
            ge.scene.add(siloLid)
        })
    new THREE.TextureLoader().load('assets/blacksteel.jpg',
        (texture) => {
            var turretBase = new THREE.Mesh(
                new THREE.CylinderGeometry(50, 75, 100, 30, 2, false),
                new THREE.MeshPhongMaterial({ map: texture })
            )
            turretBase.position.set(1920 / 2, 55, 100)
            turretBase.up = new THREE.Vector3(0, 1, 0)
            turretBase.name = "turretbase"
            ge.scene.add(turretBase)
        })
    new THREE.TextureLoader().load('assets/turretsteel.jpg',
        (texture) => {
            var turret = new THREE.Mesh(
                //SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
                new THREE.SphereGeometry(40, 20, 20),
                new THREE.MeshPhongMaterial({ map: texture })
            )
            turret.position.set(1920 / 2, 100, 100)
            turret.up = new THREE.Vector3(0, 1, 0)
            turret.name = "turret"
            ge.scene.add(turret)
        })
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

    /*var loader = new THREE.JSONLoader();
    loader.load('assets/bomber.json', function (geometry) {
        bomber = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: "red" }));
        bomber.scale.x = bomber.scale.y = bomber.scale.z = 33
        bomber.translation = geometry.center()
        bomber.position.set(320, 240, 50)
        bomber.name = "bomber"
        ge.scene.add(bomber);
    })*/
}
