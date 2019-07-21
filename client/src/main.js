
console.log(`hi in ${MODE} mode`)
console.log('i have THREE.js', THREE)

class Player extends THREE.Group {

    constructor() {
        super()

        this.add(new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000))
        this.add(new THREE.PointLight(0xffffff, 1.5))
        
    }

    get camera() {
        return this.children[0]
    }

}

let scene, renderer, controls, cube, player

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = true;
let velocity = 0;
let jumpPower = 0;
let direction = new THREE.Vector3();

function init() {

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x232b2b)

    player = new Player
    player.position.set(0, 2, 0)
    scene.add(player)

    controls = new THREE.PointerLockControls( player )

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.gammaOutput = true

    window.player = player
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
    
    const onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                if ( canJump === true ) jumpPower = 1;
                canJump = false;
                break;
        }
    };

    const onKeyUp = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    setInterval(e => {
        
        if ( controls.isLocked === true ) {

            // TODO: move code to movement controller

            direction.z = Number( moveForward ) - Number( moveBackward );
            direction.x = Number( moveLeft ) - Number( moveRight );
            direction.normalize(); 

            if(direction.x || direction.z) {
                if(velocity < 0.3) {
                    velocity += 0.01
                    velocity = +velocity.toFixed(3)
                }
            } else {
                velocity = 0
            }

            if(velocity) {
                controls.getObject().position.x += -direction.x*(velocity * controls.getObject().matrix.elements[0]) + direction.z*(velocity * controls.getObject().matrix.elements[2])
                controls.getObject().position.z -= direction.x*(velocity * controls.getObject().matrix.elements[2]) + direction.z*(velocity * controls.getObject().matrix.elements[0])
            }

            if(controls.getObject().position.y > 2) {
                controls.getObject().position.y -= 0.2;
            }

            if(jumpPower > 0) {
                controls.getObject().position.y += 0.6
                jumpPower -= 0.1
            }

            // TODO: search raycast with palyer
            if(controls.getObject().position.y < 2) {
                controls.getObject().position.y = 2;
                canJump = true
            }

        }

        renderer.render( scene, player.camera );

    }, 16.666666) // 60 fps

}

init()

cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color: 'red'}))
cube.position.set(0, 0.5, -2)
scene.add(cube)

var plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshLambertMaterial({color: 'green'}))
plane.rotation.x = -Math.PI/2
scene.add(plane)


// websocket
const ws = new WebSocket("ws://localhost:80")

ws.onopen = req => {
    console.log('open')
    ws.send('hi')
}
ws.onclose = req => console.log('close')
ws.onmessage = req => console.log(req.data)
