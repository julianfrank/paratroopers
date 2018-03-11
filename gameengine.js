

function startStuff() {

    var container, stats;
    var camera, scene, raycaster, renderer, intersects
    var mouse = new THREE.Vector2(), INTERSECTED;
    var radius = 888, theta = 0;
    var frustumSize = 1000;
    init();
    animate();
    function init() {
        //Base container div
        container = document.createElement('div');
        document.body.appendChild(container);
        //Camera Setup
        var aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.OrthographicCamera(
            frustumSize * aspect / - 2, frustumSize * aspect / 2,
            frustumSize / 2, frustumSize / - 2,
            1, frustumSize * 2)
        //Scene Setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        //Light Setup
        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(100, 100, 100).normalize();
        scene.add(light);
        //Add Boxes
        var geometry = new THREE.BoxBufferGeometry(44, 44, 44);
        for (var i = 0; i < 44; i++) {
            var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
            object.position.x = Math.random() * radius - radius / 2
            object.position.y = Math.random() * radius - radius / 2
            object.position.z = Math.random() * radius - radius / 2
            object.rotation.x = Math.random() * 2 * Math.PI
            object.rotation.y = Math.random() * 2 * Math.PI
            object.rotation.z = Math.random() * 2 * Math.PI
            object.scale.x = 1
            object.scale.y = 1
            object.scale.z = 1
            scene.add(object);
        }
        //Setup Raycaster to monitor mouse movement and events
        raycaster = new THREE.Raycaster();
        //Setup renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        //Setup Stats box
        stats = new Stats();
        container.appendChild(stats.dom);
        //Mouse move event Manager binding
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        //Window resize event binding
        window.addEventListener('resize', onWindowResize, false);
    }
    function onWindowResize() {
        var aspect = window.innerWidth / window.innerHeight;
        camera.left = - frustumSize * aspect / 2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = - frustumSize / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }
    //
    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }
    function render() {
        theta += 0.1;
        camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
        camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
        camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
        camera.lookAt(scene.position);
        camera.updateMatrixWorld();
        // find intersections
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            if (INTERSECTED != intersects[0].object) {
                if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex(0xff0000);
            }
        } else {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = null;
        }
        renderer.render(scene, camera);
    }
}
