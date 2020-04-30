
import * as THREE from 'three'

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
        this.test_collision = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshBasicMaterial({side: THREE.DoubleSide}))
        
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

        return this._collision
    }

    get collision () {
        return this.test_collision
    }

}

export { Player }
