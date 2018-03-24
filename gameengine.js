class GameEngine {

    constructor(opts) {
        // Initialize Param Vars
        if (!opts) opts = {}
        this.xMin = opts.xMin || 0
        this.xMax = opts.xMax || 640
        this.yMin = opts.yMin || 0
        this.yMax = opts.yMax || 480
        this.depth = opts.depth || 500
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
        this.renderer = new THREE.WebGLRenderer({ antialias: false })
        this.camera = new THREE.PerspectiveCamera(this.newFOV(), 1, 1, this.depth)
        this.lights = this.initLights()
        this.container = this.initContainer()
        this.updateRenderer()
        this.updateCamera()

        //Default Listeners
        window.addEventListener('resize', () => {
            this.updateRenderer()
            this.updateCamera()
        }, false)
        //Mouse move event Manager binding
        document.addEventListener('mousemove', (ev) => {
            this.onDocumentMouseMove(ev)
        }, false)
        //Add Environs
        this.addFloor()
        this.addSky()
        //Start the music
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
                INTERSECTED.material.color.setHex(0xffffff)
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
        let scene = new THREE.Scene({castShadow:true})
        scene.background = new THREE.Color(this.background)
        //scene.fog=new THREE.Fog(0x888888,this.depth-25,this.depth)
        scene.fog = new THREE.FogExp2(0xffffff, 0.001)
        return scene
    }

    initLights() {
        //Ambient Light Setup
        var alight = new THREE.AmbientLight(0x404040,0.4)
        this.scene.add(alight)
        //Hemisphere Light
        var hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1)
        //hemiLight.position.set(0, 0, 1)
        this.scene.add(hemiLight)
        //PointLights
        var pLight = new THREE.PointLight(0xffffff, 10, 1000)
        pLight.position.set((this.xMax - this.xMin) / 2, (this.yMax - this.yMin) /2, 50)
        pLight.castShadow = true
        //Set up shadow properties for the light
        pLight.shadow.mapSize.width = 128
        pLight.shadow.mapSize.height = 128
        pLight.shadow.camera.near = 1
        pLight.shadow.camera.far = this.depth
        //this.scene.add(pLight)
        var sphereSize = 111
        var pointLightHelper = new THREE.PointLightHelper(pLight, sphereSize)
        this.scene.add(pointLightHelper)
    }

    newFOV() {
        let diag = Math.sqrt(((this.xMax - this.xMin) * (this.xMax - this.xMin)) + ((this.yMax - this.yMin) * (this.yMax - this.yMin)))
        return Math.round(((2 * Math.atan(diag / (2 * this.depth))) * 180) / Math.PI)
    }

    updateCamera() {
        //console.log("camera position",(this.xMax + this.xMin) / 2, (this.yMax + this.yMin) / 2, this.depth)
        this.camera.position.set((this.xMax + this.xMin) / 2, (this.yMax + this.yMin) / 2, this.depth)
        this.camera.lookAt((this.xMax + this.xMin) / 2, (this.yMax + this.yMin) / 2, 0)
        this.camera.up = new THREE.Vector3(0, 1, 0)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.fov = this.newFOV()
        this.camera.updateProjectionMatrix()
    }

    updateRenderer() {
        let aspect = window.innerWidth / window.innerHeight
        this.renderer.setPixelRatio(aspect)
        //this.renderer.setSize(Math.min(this.xMax - this.xMin, window.innerWidth), Math.min(this.yMax - this.yMin, window.innerHeight), false)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        //this.renderer.setViewport(0, 0,  (this.xMax - this.xMin), (this.yMax - this.yMin)/aspect)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.autoUpdate = true
        this.renderer.physicallyCorrectLights = true
        this.renderer.shadowMap.type = THREE.BasicShadowMap
        this.renderer.autoClear = true
        //this.renderer.compile(this.scene, this.camera)
    }

    initContainer() {
        let container = (this.anchorDiv === null) ? document.createElement('div') : document.getElementById(this.anchorDiv)
        container.appendChild(this.renderer.domElement)
        container.appendChild(this.stats.dom)
        document.body.appendChild(container)
        return container
    }

    

    addFloor() {
        var loader = new THREE.TextureLoader();
        loader.load('floor.jpg',
            (floorTexture) => {
                floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture.repeat.set(1, 3)
                var floorMaterial = new THREE.MeshPhongMaterial({ map: floorTexture, bumpMap: floorTexture, side: THREE.DoubleSide });
                var floorGeometry = new THREE.BoxGeometry((this.xMax - this.xMin) * 3, 1, this.depth)
                var floor = new THREE.Mesh(floorGeometry, floorMaterial);
                floor.position.set((this.xMax + this.xMin) / 2, this.yMin, 0)
                floor.receiveShadow = true
                this.scene.add(floor)
            }, undefined,
            (err) => console.error(err)
        )
    }

    addSky() {
        var loader = new THREE.TextureLoader();
        loader.load('skydome.jpg',
            (texture) => {
                let backPlane = new THREE.Mesh(
                    new THREE.BoxGeometry(window.innerWidth * 2, (this.yMax - this.yMin) * 2, 1),
                    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
                )
                backPlane.position.set((this.xMax + this.xMin) / 2, (this.yMax + this.yMin), 0)
                backPlane.receiveShadow = false
                this.scene.add(backPlane)
            }, undefined,
            (err) => console.error(err)
        )
    }
}

