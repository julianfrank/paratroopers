function startStuff() {
    var scene = new THREE.Scene();

    var camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 100);
    camera.zoom = 3
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix()

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var ambientlight = new THREE.AmbientLight("white", 1)
    scene.add(ambientlight);
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 0, 50);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add(spotLight);

    var geometry = new THREE.PlaneGeometry(198, 198);
    //var material = new THREE.MeshBasicMaterial({ color: "grey" })
    var planeMaterial = new THREE.ShadowMaterial();
    var plane = new THREE.Mesh(geometry, planeMaterial)
    plane.receiveShadow=true
    plane.position.set(0, 0, 0)
    spotLight.target=plane
    scene.add(plane);

    var geometry = new THREE.BoxBufferGeometry(100, 100, 100);
    var wireframe = new THREE.WireframeGeometry(geometry)
    var material = new THREE.MeshBasicMaterial({ color: "white" })
    var cube = new THREE.LineSegments(wireframe, material)
    cube.material.depthTest = false;
    cube.rotation.x = Math.PI / 4;
    //cube.position.set(0,0,100)
    scene.add(cube);

    //create a blue LineBasicMaterial
    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-100, -100, 0));
    geometry.vertices.push(new THREE.Vector3(-100, 100, 0));
    geometry.vertices.push(new THREE.Vector3(100, 100, 0));
    geometry.vertices.push(new THREE.Vector3(100, -100, 0));
    geometry.vertices.push(new THREE.Vector3(-100, -100, 0));
    var line = new THREE.Line(geometry, material);
    scene.add(line);
    renderer.render(scene, camera);


    function animate() {

        cube.rotation.y += 0.01;


        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}
