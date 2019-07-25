
console.log(`hi in ${MODE} mode`)
console.log('i have THREE.js', THREE)

const MIN_PLAYER_SIZE = new THREE.Vector3(1, 1, 1)
class Player extends THREE.Group {

    constructor() {
        super()

        const camera_group = new THREE.Group
        camera_group.add(new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000))
        this.add(camera_group)
        this.add(new THREE.PointLight(0xffffff, 1.5))
        
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshBasicMaterial())
        mesh.position.y -= 1
        // mesh.rotation.y = Math.PI/4
        // mesh.visible = false
        this.add(mesh)

        this.camera.position.z = 5

        this._collision = new THREE.Box3
        
    }

    get camera_group() {
        return this.children[0]
    }

    get camera() {
        return this.camera_group.children[0]
    }

    get boundingBox() {
        this._collision.setFromObject(this)
        
        const size = new THREE.Vector3()
        this._collision.getSize(size)

        const tmp = size.sub(MIN_PLAYER_SIZE)
        if(tmp.x < 0 || tmp.y < 0 || tmp.z < 0) {
            const tmp1 = MIN_PLAYER_SIZE.clone().divideScalar(2)
            this._collision.min.sub(tmp1)
            this._collision.max.add(tmp1)
        }

        return this._collision
    }

}

let scene, renderer, controls, cube, player, missed_objects = []

function init() {

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x232b2b)

    player = new Player
    player.position.set(0, 2, 2)
    scene.add(player)

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.gammaOutput = true

    controls = new THREE.PointerLockControls( player, missed_objects, renderer.domElement )

    document.body.appendChild( renderer.domElement )

    window.addEventListener('resize', e => {

        const parentElement = renderer.domElement.parentElement
        const aspect = parentElement.clientWidth/parentElement.clientHeight
        const width = parentElement.clientWidth
        const height = parentElement.clientHeight
        
        renderer.setSize(width, height)
        player.camera.aspect = aspect
        
        player.camera.updateProjectionMatrix()

    }, false)

    renderer.domElement.addEventListener('click', e => {
        
        controls.lock()

    }, false)

    setInterval(e => {
        
        controls.update()

        renderer.render( scene, player.camera );

    }, 16.666666) // 60 fps

}

init()

cube = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), new THREE.MeshLambertMaterial({color: 'red'}))
cube.position.set(0, 0, 0)
missed_objects.push(cube)
scene.add(cube)

var plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshLambertMaterial({color: 'green'}))
plane.rotation.x = -Math.PI/2
scene.add(plane)

// websocket
// const ws = new WebSocket("ws://localhost:80")

// ws.onopen = req => {
//     console.log('open')
//     ws.send('hi')
// }
// ws.onclose = req => console.log('close')
// ws.onmessage = req => console.log(req.data)
