// renderers
export { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
export { Scene } from 'three/src/scenes/Scene'
// cameras
export { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
// lights
export { PointLight } from 'three/src/lights/PointLight'
// objects
export { Mesh } from 'three/src/objects/Mesh'
export { Group } from 'three/src/objects/Group'
// geometries
export { BoxGeometry } from 'three/src/geometries/BoxGeometry'
export { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
// materials
export { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial'
export { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial'
// math
export { Color } from 'three/src/math/Color'
export { Vector3 } from 'three/src/math/Vector3'
import { Box3 } from 'three/src/math/Box3'; export { Box3 } // for modify
// examples
export { PointerLockControls } from './PointerLockControls'

export * from 'three/src/constants'


// modify Box3
Box3.prototype.distanceToBox = function(box) {
  console.log('hi')
}
