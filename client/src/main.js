
console.log(`hi in ${MODE} mode`)
console.log('i have THREE.js', THREE)


let scene, renderer, camera, cube

function init() {

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x232b2b)

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )
    camera.add(new THREE.PointLight(0xffffff, 1.5))
    camera.position.z = 2
    scene.add(camera)

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.gammaOutput = true

    document.body.appendChild( renderer.domElement )

    const animate = function () {
        requestAnimationFrame( animate );

        if(cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }

        renderer.render( scene, camera );
    };

    animate();
}

init()

cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color: 'green'}))
scene.add(cube)
