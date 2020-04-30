
import * as THREE from 'three'

import { PointerLockControls } from './PointerLockControls'
import { Player } from './Player'
import { Scene } from './Scene'

const scene = new Scene, player = new Player

player.position.set(0, 2, 2)

scene.camera = player.camera
scene.add(player)
scene.controls = new PointerLockControls( player, scene.renderer.domElement )
document.body.appendChild( scene.renderer.domElement )
scene.updateRendererSize()

var cube = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), new THREE.MeshLambertMaterial({color: 'red'}))
cube.position.set(0, 0, 0)
scene.add(cube)

var plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshLambertMaterial({color: 'green'}))
plane.rotation.x = -Math.PI/2
scene.add(plane)

// TODO:: add cannon.js
