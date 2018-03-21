

function startStuff() {

    var g = new GameEngine({ dsds: "dsdfs" })

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
        this.renderer = this.initRenderer()
        this.camera = this.initCamera()
        this.lights = this.initLights()
        this.container = this.initContainer()
        this.addRefObjects()

        //Default Listeners
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.fov = this.newFOV()
            this.camera.updateProjectionMatrix()
        })
        //Start the music
        this.oldAnime()
    }
    newFOV() {
        let aspect = window.innerWidth / window.innerHeight
        let diag = Math.sqrt((window.innerWidth * window.innerWidth) + (window.innerHeight * window.innerHeight))
        let fovRad = 2 * Math.atan(diag / (2 * this.depth))
        let fovDeg = (fovRad * 180) / Math.PI / aspect
        console.log("fovDeg:", fovDeg)
        console.log("aspect:", aspect)
        return fovDeg
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
        //var light = new THREE.AmbientLight(0xffffff, 0.1)
        //this.scene.add(light)
        //Hemisphere Light
        var hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.4)
        //hemiLight.position.set(0, 0, 1)
        this.scene.add(hemiLight)
        //PointLights
        var pLight = new THREE.PointLight(0xffffff, 1, 600, 2)
        pLight.position.set(160, 120, 100)
        pLight.castShadow = true
        //Set up shadow properties for the light
        pLight.shadow.mapSize.width = 128
        pLight.shadow.mapSize.height = 128
        pLight.shadow.camera.near = 1       
        pLight.shadow.camera.far = this.depth/4      

        this.scene.add(pLight)
    }

    initCamera() {
        let camera = new THREE.PerspectiveCamera(35, 1, 1, this.depth)
        camera.position.set((this.xMax - this.xMin) / 2, (this.yMax - this.yMin) / 2, this.depth)
        camera.lookAt((this.xMax - this.xMin) / 2, (this.yMax - this.yMin) / 2, 0)
        camera.up = new THREE.Vector3(0, 1, 0)
        this.renderer.setSize(this.xMax, this.yMax, false)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.fov = this.newFOV()
        camera.updateProjectionMatrix()
        return camera
    }

    initRenderer() {
        let aspect = window.innerWidth / window.innerHeight
        var renderer = new THREE.WebGLRenderer({ antialias: true })
        //renderer.setPixelRatio(aspect)
        renderer.setSize(this.xMax, this.yMax, false)
        renderer.shadowMap.enabled = true
        //renderer.shadowMap.type= THREE.PCFSoftShadowMap
        return renderer
    }

    initContainer() {
        let container = (this.anchorDiv === null) ? document.createElement('div') : document.getElementById(this.anchorDiv)
        container.appendChild(this.renderer.domElement)
        document.body.appendChild(container)
        return container
    }

    addRefObjects() {
        let backPlane = new THREE.Mesh(
            new THREE.BoxGeometry(640, 480, 1),
            new THREE.MeshPhongMaterial({ color: 0x444444 })
        )
        backPlane.position.set(320, 240, 0)
        backPlane.receiveShadow=true
        this.scene.add(backPlane)

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
            { x: 320, y: 240, z: 50, color: 0xf88888 }
        ]
        //Add spheres
        //SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
        var geometry = new THREE.SphereGeometry(25, 16, 16)
        //Add edge boxes
        edgeConfig.map((x) => {
            var zzz = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: new THREE.Color(x.color), wireframe: false }))
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

    oldAnime() {
        let self = this
        var stats
        var raycaster, intersects
        var mouse = new THREE.Vector2(), INTERSECTED

        init()
        animate()
        function init() {
            //Setup Raycaster to monitor mouse movement and events
            raycaster = new THREE.Raycaster()
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
                    if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
                    //console.log(INTERSECTED)
                    INTERSECTED = intersects[0].object
                    INTERSECTED.currentHex = INTERSECTED.material.color.getHex()
                    INTERSECTED.material.color.setHex(0xff0000)
                }
            } else {
                if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
                INTERSECTED = null
            }
            self.renderer.render(self.scene, self.camera)
        }
    }
}

