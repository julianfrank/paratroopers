

function startStuff() {

    var g = new GameEngine({ anchorDiv: "gamescreen", dsds: "dsdfs" })



    console.log(g)
}

class GameEngine {

    constructor(opts) {
        // Initialize Param Vars
        if (!opts) opts = {}
        this.xMin = opts.xMin || 0
        this.xMax = opts.xMax || 640
        this.yMin = opts.yMin || 0
        this.yMax = opts.yMax || 480
        this.depth = opts.depth || 2000
        this.background = opts.background || 0x888888
        this.anchorDiv = opts.anchorDiv || null
        // Start Init Subsystems
        this.scene = this.initScene()
        this.camera = this.initOrthoCamera()
        this.renderer = this.initRenderer()
        this.container = this.initContainer()
        //Start the music
        this.oldAnime()
    }

    initScene() {
        let scene = new THREE.Scene()
        scene.background = new THREE.Color(this.background)
        //Light Setup
        var light = new THREE.AmbientLight(0xffffff, 1)
        scene.add(light)
        return scene
    }

    initOrthoCamera() {
        let aspect = window.innerWidth / window.innerHeight
        let diag = Math.sqrt((window.innerWidth*window.innerWidth) + (window.innerHeight*window.innerHeight))
        let fovRad = 2*Math.atan(diag/(2*this.depth ))
        let fovDeg = (fovRad * 180) / Math.PI /aspect
        console.log("fovDeg:",fovDeg)
        console.log("aspect:",aspect)
        let camera = new THREE.PerspectiveCamera(fovDeg, aspect, 1, 2*this.depth)
        camera.position.set((this.xMax - this.xMin) / 2, (this.yMax - this.yMin) / 2, this.depth)
        camera.lookAt((this.xMax - this.xMin) / 2, (this.yMax - this.yMin) / 2, 0)
        camera.up = new THREE.Vector3(0, 1, 0)
        camera.updateMatrixWorld()
        return camera
    }

    initRenderer() {
        var renderer = new THREE.WebGLRenderer()
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        return renderer
    }

    initContainer() {
        if (this.anchorDiv === null) {
            let container = document.createElement('div')
            container.appendChild(this.renderer.domElement)
            document.body.appendChild(container)
            return container
        } else {
            let container = document.getElementById(this.anchorDiv)
            container.appendChild(this.renderer.domElement)
            document.body.appendChild(container)
            return container
        }
    }



    oldAnime() {
        let self = this
        var stats
        var raycaster, intersects
        var mouse = new THREE.Vector2(), INTERSECTED

        init()
        animate()
        function init() {
            // Edge Objects
            var edgeConfig = [
                { x: 0, y: 0, z: 0, color: 0x111111 },
                { x: 0, y: 0, z: 100, color: 0x0000ff },
                { x: 0, y: 480, z: 0, color: 0x00ff00 },
                { x: 0, y: 480, z: 100, color: 0x00ffff },
                { x: 640, y: 0, z: 0, color: 0xff0000 },
                { x: 640, y: 0, z: 100, color: 0xff00ff },
                { x: 640, y: 480, z: 0, color: 0xffff00 },
                { x: 640, y: 480, z: 100, color: 0xffffff },
                { x: 320, y: 240, z: 50, color: 0xf0f0f0 }
            ]
            //Add Boxes
            var geometry = new THREE.BoxBufferGeometry(44, 44, 44)
            //Add edge boxes
            edgeConfig.map((x) => {
                var zzz = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: x.color }))
                zzz.position.x = x.x
                zzz.position.y = x.y
                zzz.position.z = x.z
                zzz.scale.x = 1
                zzz.scale.y = 1
                zzz.scale.z = 1
                self.scene.add(zzz)
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


            //Setup Raycaster to monitor mouse movement and events
            raycaster = new THREE.Raycaster()
            //Setupself.renderer

            //Setup Stats box
            stats = new Stats()
            self.container.appendChild(stats.dom)
            //Mouse move event Manager binding
            document.addEventListener('mousemove', onDocumentMouseMove, false)

        }

        function onDocumentMouseMove(event) {
            event.preventDefault()
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
        }
        //
        function animate() {
            requestAnimationFrame(animate)
            render()
            stats.update()
        }
        function render() {
            // find intersections
            raycaster.setFromCamera(mouse, self.camera)
            intersects = raycaster.intersectObjects(self.scene.children)
            if (intersects.length > 0) {
                if (INTERSECTED != intersects[0].object) {
                    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
                    INTERSECTED = intersects[0].object
                    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
                    INTERSECTED.material.emissive.setHex(0xff0000)
                }
            } else {
                if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
                INTERSECTED = null
            }
            self.renderer.render(self.scene, self.camera)
        }
    }
}

