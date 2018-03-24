

function startStuff() {

    var g = new GameEngine({ dsds: "dsdfs" })

    console.log(g)
}

class GameEngine {

    constructor(opts) {
        // Initialize Param Vars
        if (!opts) opts = {}
        this.xMin = opts.xMin || -640
        this.xMax = opts.xMax || 640
        this.yMin = opts.yMin || -480
        this.yMax = opts.yMax || 480
        this.depth = opts.depth || 2000
        this.background = opts.background || 0x888888
        this.anchorDiv = opts.anchorDiv || null
        //Init magic stuff
        this.mouse = new THREE.Vector2()
        //Setup Raycaster to monitor mouse movement and events
        this.raycaster = new THREE.Raycaster()
        this.INTERSECTED
        //Setup Stats box
        this.stats = new Stats()

        // Start Init Subsystems
        this.scene = this.initScene()
        this.renderer = this.initRenderer()
        this.camera = this.initCamera()
        this.lights = this.initLights()
        this.container = this.initContainer()
        this.updateRenderer()
        this.updateCamera()
        this.addRefObjects()

        //Default Listeners
        window.addEventListener('resize', () => {
            this.updateRenderer()
            this.updateCamera()
        }, false)
        //Mouse move event Manager binding
        document.addEventListener('mousemove', (ev) => {
            this.onDocumentMouseMove(ev)
        }, false)
        //Start the music
        //this.oldAnime()
        this.renderer.animate(() => this.render())
    }

    onDocumentMouseMove(event) {
        event.preventDefault()
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
    }

    render() {
        let INTERSECTED = this.INTERSECTED
        // find intersections
        this.raycaster.setFromCamera(this.mouse, this.camera)
        let intersects = this.raycaster.intersectObjects(this.scene.children)
        if (intersects.length > 0) {
            if (INTERSECTED != intersects[0].object) {
                if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
                //console.log(INTERSECTED)
                INTERSECTED = intersects[0].object
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex()
                INTERSECTED.material.color.setHex(0xff0000)
                //console.log(INTERSECTED.position)
            }
        } else {
            if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
            INTERSECTED = null
        }
        this.renderer.render(this.scene, this.camera)
        this.stats.update()
        this.INTERSECTED = INTERSECTED
    }

    initScene() {
        let scene = new THREE.Scene()
        scene.background = new THREE.Color(this.background)
        //scene.fog=new THREE.Fog(0x888888,this.depth-25,this.depth)
        //scene.fog = new THREE.FogExp2(0xffffff, 0.0004)
        return scene
    }

    initLights() {
        //Ambient Light Setup
        var alight = new THREE.AmbientLight(0x404040)
        this.scene.add(alight)
        //Hemisphere Light
        //var hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.4)
        //hemiLight.position.set(0, 0, 1)
        //this.scene.add(hemiLight)
        //PointLights
        var pLight = new THREE.PointLight(0xffffff, 1, 1000)
        pLight.position.set(320, 240, 60).normalize()
        pLight.castShadow = true
        //Set up shadow properties for the light
        //pLight.shadow.mapSize.width = 128
        //pLight.shadow.mapSize.height = 128
        //pLight.shadow.camera.near = 1
        //pLight.shadow.camera.far = this.depth
        this.scene.add(pLight)
    }

    newFOV() {
        let aspect = window.innerWidth / window.innerHeight
        let diag = Math.sqrt(((this.xMax - this.xMin) * (this.xMax - this.xMin)) + ((this.yMax - this.yMin) * (this.yMax - this.yMin)))
        let fovRad = 2 * Math.atan(diag / (2 * this.depth))
        //let fovRad = 2 * Math.atan(window.innerHeight / (2 * this.depth))
        let fovDeg = Math.round((fovRad * 180) / Math.PI / aspect)
        console.log("fovDeg:", fovDeg, "aspect:", aspect)
        return fovDeg
    }
    initCamera() { return new THREE.PerspectiveCamera(this.newFOV(), 1, 1, this.depth) }
    updateCamera() {
        //console.log("camera position",(this.xMax + this.xMin) / 2, (this.yMax + this.yMin) / 2, this.depth)
        this.camera.position.set((this.xMax + this.xMin) / 2, (this.yMax + this.yMin) / 2, this.depth)
        this.camera.lookAt((this.xMax + this.xMin) / 2, (this.yMax + this.yMin) / 2, 0)
        this.camera.up = new THREE.Vector3(0, 1, 0)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.fov = this.newFOV()
        this.camera.updateProjectionMatrix()
    }

    initRenderer() { return new THREE.WebGLRenderer({ antialias: true }) }
    updateRenderer() {
        let aspect = window.innerWidth / window.innerHeight
        this.renderer.setPixelRatio(aspect)
        this.renderer.setSize(Math.min(this.xMax - this.xMin, window.innerWidth), Math.min(this.yMax - this.yMin, window.innerHeight), false)
        this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.autoUpdate = true
        this.renderer.physicallyCorrectLights = true
        this.renderer.shadowMap.type = THREE.BasicShadowMap
        this.renderer.compile(this.scene, this.camera)
    }

    initContainer() {
        let container = (this.anchorDiv === null) ? document.createElement('div') : document.getElementById(this.anchorDiv)
        container.appendChild(this.renderer.domElement)
        container.appendChild(this.stats.dom)
        document.body.appendChild(container)
        return container
    }

    addRefObjects() {
        let backPlane = new THREE.Mesh(
            new THREE.BoxGeometry(1280, 960, 1),
            new THREE.MeshPhongMaterial({ color: 0x444444 })
        )
        backPlane.position.set(0, 0, 0)
        backPlane.receiveShadow = true
        this.scene.add(backPlane)

        // Edge Objects
        var edgeConfig = [
            { x: -640, y: -480, z: 0, color: 0x000000 },
            { x: -640, y: -480, z: 100, color: 0x0000ff },
            { x: -640, y: 480, z: 0, color: 0x00ff00 },
            { x: -640, y: 480, z: 100, color: 0x00ffff },
            { x: 640, y: -480, z: 0, color: 0xff0000 },
            { x: 640, y: -480, z: 100, color: 0xff00ff },
            { x: 640, y: 480, z: 0, color: 0xffff00 },
            { x: 640, y: 480, z: 100, color: 0xffffff },

            { x: 0, y: 0, z: 0, color: "white" },
            { x: 320, y: 240, z: 50, color: "white" }
        ]
        //Add spheres
        //SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
        var geometry = new THREE.SphereGeometry(25, 16, 16)
        //Add edge boxes
        edgeConfig.map((x) => {
            var zzz = new THREE.Mesh(geometry,
                new THREE.MeshPhongMaterial({
                    color: new THREE.Color(x.color)
                }))
            zzz.position.set(x.x, x.y, x.z)
            zzz.castShadow = true
            zzz.receiveShadow = true
            this.scene.add(zzz)
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
}

