//Try https://davidwalsh.name/destructuring-function-arguments

class GameEngine {

    constructor(opts) {
        // Initialize Param Vars
        if (!opts) opts = {}
        this.xMin = opts.xMin || 0
        this.xMax = opts.xMax || 640
        this.yMin = opts.yMin || 0
        this.yMax = opts.yMax || 480
        this.depth = opts.depth || 3333
        this.fov = opts.fov || 35
        this.background = opts.background || 0x888888
        this.anchorDiv = opts.anchorDiv || null
        //Init magic stuff
        //this.mouse = new THREE.Vector2()
        //Setup Raycaster to monitor mouse movement and events
        //this.raycaster = new THREE.Raycaster()
        //this.INTERSECTED
        //Setup Stats box
        this.stats = new Stats()

        // Start Init Subsystems
        this.scene = this.initScene()
        this.renderer = new THREE.WebGLRenderer({ antialias: false })
        //PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
        this.camera = new THREE.PerspectiveCamera(this.fov, 1, 1, this.depth)
        this.lights = this.initLights()
        this.container = this.initContainer()
        this.updateRenderer()
        this.updateCameraByFOV()

        //Default Listeners
        window.addEventListener('resize', () => {
            this.updateRenderer()
            this.updateCameraByFOV()
        }, false)
        //Mouse move event Manager binding
        //document.addEventListener('mousemove', (ev) => { this.onDocumentMouseMove(ev) }, false)
        //Add Environs
        this.addFloor()
        this.sky
        this.addSky()
        //Start the music
        this.renderer.animate(() => this.render())

        this.actors = []
    }

    addActor(actor) { return this.actors.push(actor) }

    onDocumentMouseMove(event) {
        event.preventDefault()
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
    }

    render() {

        this.renderer.render(this.scene, this.camera)
        this.stats.update()

        this.actors.map((val) => {
            val.update()
        })
    }

    initScene() {
        let scene = new THREE.Scene({ castShadow: true })
        scene.background = new THREE.Color(this.background)
        //scene.fog=new THREE.Fog(0x888888,this.depth-25,this.depth)
        //scene.fog = new THREE.FogExp2(0xffffff, 0.0007)
        return scene
    }

    initLights() {
        //Ambient Light Setup
        //var alight = new THREE.AmbientLight(0x404040, 0.4)
        //this.scene.add(alight)
        //Hemisphere Light
        //HemisphereLight( skyColor : Integer, groundColor : Integer, intensity : Float )
        var hemiLight = new THREE.HemisphereLight(0xffeeee, 0xffeeee, 2)
        //hemiLight.position.set(0, -1, 0)
        this.scene.add(hemiLight)
        //PointLights
        /*var pLight = new THREE.PointLight(0xffffff, 10, 1000)
        pLight.position.set((this.xMax - this.xMin) / 2, (this.yMax - this.yMin) / 2, 50)
        pLight.castShadow = true
        //Set up shadow properties for the light
        pLight.shadow.mapSize.width = 128
        pLight.shadow.mapSize.height = 128
        pLight.shadow.camera.near = 1
        pLight.shadow.camera.far = this.depth
        //this.scene.add(pLight)
        //var sphereSize = 111
        //var pointLightHelper = new THREE.PointLightHelper(pLight, sphereSize)
        //this.scene.add(pointLightHelper)
        */
    }

    newFOV() {
        let diag = Math.sqrt(((this.xMax - this.xMin) * (this.xMax - this.xMin)) + ((this.yMax - this.yMin) * (this.yMax - this.yMin)))
        return Math.round(((2 * Math.atan(diag / (2 * this.depth))) * 180) / Math.PI)
    }
    updateCameraFOV() {
        //console.log("camera position",(this.xMax + this.xMin) / 2, (this.yMax + this.yMin) / 2, this.depth)
        this.camera.position.set((this.xMax + this.xMin) / 2, //(this.yMax + this.yMin) / 2,
            100, this.depth)
        this.camera.lookAt((this.xMax + this.xMin) / 2, (this.yMax + this.yMin) / 2, 0)
        this.camera.up = new THREE.Vector3(0, 1, 0)
        //this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.fov = this.newFOV()
        this.camera.updateProjectionMatrix()
    }

    updateCameraByFOV() {
        let diag = Math.sqrt(((this.xMax - this.xMin) * (this.xMax - this.xMin)) + ((this.yMax - this.yMin) * (this.yMax - this.yMin)))
        this.camera.position.set((this.xMax + this.xMin) / 2,
            (this.yMax + this.yMin) / 2,
            diag / Math.tan(this.fov * Math.PI / 180)
        )
        this.camera.lookAt((this.xMax + this.xMin) / 2, (this.yMax + this.yMin) / 2, 0)
        this.camera.up = new THREE.Vector3(0, 1, 0)
        this.camera.fov = this.fov
        //console.log(diag, this.fov, diag / Math.tan(this.fov * Math.PI / 180))
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
        loader.load('assets/floor.jpg',
            (floorTexture) => {
                //floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture.repeat.set(1, 1)
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
        /*var loader = new THREE.TextureLoader();
        loader.load('assets/skydome.jpg',
            (texture) => {
                let backPlane = new THREE.Mesh(
                    new THREE.BoxGeometry((this.xMax - this.xMin) * 2, (this.yMax - this.yMin) * 2, 1),
                    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
                )
                backPlane.position.set((this.xMax + this.xMin) / 2, (this.yMax + this.yMin), 0)
                backPlane.receiveShadow = false
                this.scene.add(backPlane)
            }, undefined,
            (err) => console.error(err)
        )*/

        // Add Sky
        var sky = new THREE.Sky();
        sky.scale.setScalar(45000);
        this.scene.add(sky);
        // Add Sun Helper
        var sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(20000, 16, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        //sunSphere.position.y = - 700000
        sunSphere.visible = true
        this.scene.add(sunSphere)
        var effectController = {
            turbidity: 10,
            rayleigh: 2,
            mieCoefficient: 0.05,
            mieDirectionalG: 0.7,//0.8,
            luminance: 0.5,
            inclination: 0.512, // elevation / inclination
            azimuth: 0.23, // Facing front,
            sun: !true
        }
        var distance = 400000

        var uniforms = sky.material.uniforms;
        uniforms.turbidity.value = effectController.turbidity;
        uniforms.rayleigh.value = effectController.rayleigh;
        uniforms.luminance.value = effectController.luminance;
        uniforms.mieCoefficient.value = effectController.mieCoefficient;
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
        var theta = Math.PI * (effectController.inclination - 0.5);
        var phi = 2 * Math.PI * (effectController.azimuth - 0.5);
        sunSphere.position.x = distance * Math.cos(phi);
        sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
        sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
        sunSphere.visible = effectController.sun;
        uniforms.sunPosition.value.copy(sunSphere.position)
    }
}

class Stickman {
    constructor() {
        // Create a simple "arm"

        var bones = [];

        var shoulder = new THREE.Bone();
        var elbow = new THREE.Bone();
        var hand = new THREE.Bone();

        shoulder.add(elbow);
        elbow.add(hand);

        bones.push(shoulder);
        bones.push(elbow);
        bones.push(hand);

        shoulder.position.y = -5;
        elbow.position.y = 0;
        hand.position.y = 5;

        this.skeleton = new THREE.Skeleton(bones)
        this.skeleton.calculateInverses()

        var material = new THREE.MeshPhongMaterial({
            skinning: true,
            wireframe: true,
            color: "green",
            emissive: 0x111111,
            side: THREE.DoubleSide,
            flatShading: false
        })

        var geometry = new THREE.CylinderGeometry(
            5,                       // radiusTop
            5,                       // radiusBottom
            100,           // height
            7,                       // radiusSegments
            10, // heightSegments
            false                     // openEnded
        );

        this.mesh = new THREE.SkinnedMesh(geometry, material)
        this.mesh.add(this.skeleton.bones[0])
        this.mesh.bind(this.skeleton)

        this.helper = new THREE.SkeletonHelper(this.mesh)
        this.helper.material.linewidth = 3
    }
}

class TryBones {
    constructor() {
        this.mesh = undefined
        this.helper = undefined
        this.bones = undefined
        this.initBones()

        this.x = new TinyTween({
            duration: 2,
            value: { start: -0.25 * Math.PI, end: 0.25 * Math.PI },
            rewind: true
        })
    }

    createGeometry(sizing) {
        //BoxBufferGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)
        //var geometry = new THREE.BoxBufferGeometry(10, 100, 10, 3, 3, 3)
        var geometry = new THREE.CylinderGeometry(
            5,                       // radiusTop
            5,                       // radiusBottom
            sizing.height,           // height
            7,                       // radiusSegments
            sizing.segmentCount * 2, // heightSegments
            false                     // openEnded
        );

        for (var i = 0; i < geometry.vertices.length; i++) {

            var vertex = geometry.vertices[i];
            var y = (vertex.y + sizing.halfHeight);

            var skinIndex = Math.floor(y / sizing.segmentHeight)
            var skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;

            geometry.skinIndices.push(new THREE.Vector4(skinIndex, skinIndex + 1, 0, 0));
            geometry.skinWeights.push(new THREE.Vector4(1 - skinWeight, skinWeight, 0, 0));

        }

        return geometry;
    }

    initBones() {

        var segmentHeight = 10
        var segmentCount = 10
        var height = segmentHeight * segmentCount
        var halfHeight = height * 0.5

        var sizing = {
            segmentHeight: segmentHeight,
            segmentCount: segmentCount,
            height: height,
            halfHeight: halfHeight
        }

        var geometry = this.createGeometry(sizing)
        this.bones = this.createBones(sizing)
        this.mesh = this.createMesh(geometry, this.bones)
        this.mesh.scale.multiplyScalar(1)

    }
    createBones(sizing) {

        var bones = [];

        var prevBone = new THREE.Bone()
        bones.push(prevBone)
        prevBone.position.y = - sizing.halfHeight

        for (var i = 0; i < sizing.segmentCount; i++) {
            var bone = new THREE.Bone()
            bone.position.y = sizing.segmentHeight
            bones.push(bone)
            prevBone.add(bone)
            prevBone = bone
        }
        return bones;
    }

    createMesh(geometry, bones) {

        var material = new THREE.MeshPhongMaterial({
            skinning: true,
            wireframe: true,
            color: "white",
            emissive: 0x111111,
            side: THREE.DoubleSide,
            flatShading: false
        })

        var mesh = new THREE.SkinnedMesh(geometry, material);
        var skeleton = new THREE.Skeleton(bones)

        mesh.add(bones[0])
        mesh.bind(skeleton)
        let skeletonHelper = new THREE.SkeletonHelper(mesh)
        skeletonHelper.material.linewidth = 4
        //scene.add(skeletonHelper)
        this.helper = skeletonHelper
        return mesh
    }

    update() {
        this.bones[3].rotation.z = this.x.tick()
    }
}


/**
 * @name TinyTween
 * @version 31/Mar/2018
 */
class TinyTween {
    /**
     * @param   {JSON}      opts {duration} in seconds. Default {duration:10} ,\n{value} Default {start:0,end:100},\n{rewind} default is {rewind:false}
     */
    constructor(opts) {
        opts = opts || {}
        this.init(opts)
    }
    init(opts) {
        this.rewind = opts.rewind || false
        this.duration = opts.duration || 10//Duration of tween in SECONDS
        this.value = opts.value || { start: 0, end: 100 }

        this.time = {
            start: performance.now(),//performance.now() from object creator.. Initiate from creator if trying to chain with other tweeners
            end: performance.now() + (this.duration * 1000)
        }

        this.valuegap = this.value.end - this.value.start
        this.finished = false
        this.position = this.value.start
    }
    tick() {
        //console.log(this.position,this.finished, this.value)
        if (!this.finished) {
            this.position = this.value.start + (this.valuegap * (performance.now() - this.time.start) / (this.duration * 1000))
            if (Math.abs(this.position - this.value.start) > Math.abs(this.valuegap)) {
                if (this.rewind) {
                    this.init({
                        duration: this.duration,
                        value: {
                            start: this.value.end,
                            end: this.value.start
                        },
                        rewind: this.rewind
                    })
                } else {
                    this.finished = true
                    this.position = this.value.end
                }
            }
            return this.position
        }
        return this.position
    }
    reset() {
        this.time.start = performance.now()
        this.finished = false
    }
    stop() {
        this.finished = true
    }
}
