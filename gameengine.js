function startStuff() {
    var scene = new THREE.Scene();

    var camera = new THREE.OrthographicCamera(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2, 1, 100);
    camera.zoom=3
    camera.position.set(0, 0, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix()
    scene.add(camera)

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: "pink" });
    var cube = new THREE.Mesh(geometry, material);
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

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.1;

        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}
