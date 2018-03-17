

function startStuff() {

    var g = new GameEngine({ autoWindow: true, dsds: "dsdfs" })



    console.log(g)
}

class GameEngine {

    constructor(opts) {
        this.frustumSize = 999
        this.scene = new THREE.Scene()
        this.camera = this.initOrthoCamera()
        this.renderer
        this.container = document.createElement('div')
        document.body.appendChild(this.container)
        this.oldAnime()
    }

    initOrthoCamera() {
        //OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )
        return new THREE.OrthographicCamera(
            0, 500,
            500, 0,
            1, 2000)
    }

    oldAnime() {
        let self = this
        var container, stats
        var raycaster, intersects
        var mouse = new THREE.Vector2(), INTERSECTED
        var radius = 888, theta = 0

        init()
        animate()
        function init() {
            //Camera Setup
            var aspect = window.innerWidth / window.innerHeight
            /*self.camera = new THREE.OrthographicCamera(
                self.frustumSize * aspect / - 2, self.frustumSize * aspect / 2,
                self.frustumSize / 2, self.frustumSize / - 2,
                1, self.frustumSize * 2)*/
            /*self.camera = new THREE.OrthographicCamera(
                -500, 500,
                500, -500,
                1, 2000)*/
            self.scene.background = new THREE.Color(0xf0f0f0)
            //Light Setup
            var light = new THREE.DirectionalLight(0xffffff, 1)
            light.position.set(100, 100, 100).normalize()
            self.scene.add(light)
            //Add Boxes
            var geometry = new THREE.BoxBufferGeometry(44, 44, 44)
            for (var i = 0; i < 44; i++) {
                var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))
                object.position.x = Math.random() * radius - radius / 2
                object.position.y = Math.random() * radius - radius / 2
                object.position.z = Math.random() * radius - radius / 2
                object.rotation.x = Math.random() * 2 * Math.PI
                object.rotation.y = Math.random() * 2 * Math.PI
                object.rotation.z = Math.random() * 2 * Math.PI
                object.scale.x = 1
                object.scale.y = 1
                object.scale.z = 1
                self.scene.add(object)
            }
            //Setup Raycaster to monitor mouse movement and events
            raycaster = new THREE.Raycaster()
            //Setupself.renderer
            self.renderer = new THREE.WebGLRenderer()
            self.renderer.setPixelRatio(window.devicePixelRatio)
            self.renderer.setSize(window.innerWidth, window.innerHeight)
            self.container.appendChild(self.renderer.domElement)
            //Setup Stats box
            stats = new Stats()
            self.container.appendChild(stats.dom)
            //Mouse move event Manager binding
            document.addEventListener('mousemove', onDocumentMouseMove, false)
            //Window resize event binding
            window.addEventListener('resize', onWindowResize, false)
        }
        function onWindowResize() {
            var aspect = window.innerWidth / window.innerHeight
            self.camera.left = -self.frustumSize * aspect / 2
            self.camera.right = self.frustumSize * aspect / 2
            self.camera.top = self.frustumSize / 2
            self.camera.bottom = -self.frustumSize / 2
            self.camera.updateProjectionMatrix()
            self.renderer.setSize(window.innerWidth, window.innerHeight)
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
            theta += 0.1
            self.camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta))
            self.camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta))
            self.camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta))
            self.camera.lookAt(self.scene.position)
            self.camera.updateMatrixWorld()
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

