/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 * 
 * modify:
 * @author evilkuma / https://github.com/evilkuma
 */

import { Euler } from 'three/src/math/Euler'
import { Vector3 } from 'three/src/math/Vector3'
import { EventDispatcher } from 'three/src/core/EventDispatcher'

var PointerLockControls = function ( camera, domElement ) {

	// speed settings
	// max movement speed
	this.maxSpeed = 0.3
	// min movement speed
	this.minSpeed = 0
	// speed increase rate
	this.acceleration = 0.01

	// jump settings
	// how many conditional time units jump 
	this.jumpPower = 1
	// level of rise per conditional unit of time
	this.jumpStep = 0.6
	// jump price per conditional unit time
	this.jumpAttenuation = 0.1

	// failing settings
	// TODO: use that when add raycast
	this.maxAtitude = -3
	this.spawnPosition = new Vector3

	this.domElement = domElement || document.body;
	this.isLocked = false;

	//
	// internals
	//

	var scope = this;

	var changeEvent = { type: 'change' };
	var lockEvent = { type: 'lock' };
	var unlockEvent = { type: 'unlock' };

	var euler = new Euler( 0, 0, 0, 'YXZ' );

	var PI_2 = Math.PI / 2;

	let moveForward = false;
	let moveBackward = false;
	let moveLeft = false;
	let moveRight = false;
	let canJump = true;
	let velocity = 0;
	let jumpPower = 0;
	let direction = new Vector3();

	function onMouseMove( event ) {

		if ( scope.isLocked === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		euler.setFromQuaternion( camera.quaternion );

		euler.y -= movementX * 0.002;
		euler.x -= movementY * 0.002;

		euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );

		camera.quaternion.setFromEuler( euler );

		scope.dispatchEvent( changeEvent );

	}

	function onPointerlockChange() {

		if ( document.pointerLockElement === scope.domElement ) {

			scope.dispatchEvent( lockEvent );

			scope.isLocked = true;

		} else {

			scope.dispatchEvent( unlockEvent );

			scope.isLocked = false;

		}

	}

	function onPointerlockError() {

		console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

	}

	function onKeyDown(event) {
		
		if([38, 87].includes(+event.keyCode)) {	// up|w
			moveForward = true
		} else if([37, 65].includes(+event.keyCode)) { // left|a
			moveLeft = true
		} else if([40, 83].includes(+event.keyCode)) { // down|s
			moveBackward = true
		} else if([39, 68].includes(+event.keyCode)) { // right|d
			moveRight = true
		} else if([32].includes(+event.keyCode)) { // space
			if(canJump === true) jumpPower = this.jumpPower;
			canJump = false;
		}

	}

	function onKeyUp(event) {
		
		if([38, 87].includes(+event.keyCode)) {	// up|w
			moveForward = false
		} else if([37, 65].includes(+event.keyCode)) { // left|a
			moveLeft = false
		} else if([40, 83].includes(+event.keyCode)) { // down|s
			moveBackward = false
		} else if([39, 68].includes(+event.keyCode)) { // right|d
			moveRight = false
		}

	}

	this.connect = function () {

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'pointerlockchange', onPointerlockChange, false );
		document.addEventListener( 'pointerlockerror', onPointerlockError, false );
		document.addEventListener( 'keydown', onKeyDown.bind(this), false )
		document.addEventListener( 'keyup', onKeyUp, false )

	};

	this.disconnect = function () {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
		document.removeEventListener( 'pointerlockerror', onPointerlockError, false );
		document.addEventListener( 'keydown', onKeyDown, false )
		document.addEventListener( 'keyup', onKeyUp, false )

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.getObject = function () { // retaining this method for backward compatibility

		return camera;

	};

	this.getDirection = function () {

		var direction = new Vector3( 0, 0, - 1 );

		return function ( v ) {

			return v.copy( direction ).applyQuaternion( camera.quaternion );

		};

	}();

	this.lock = function () {

		this.domElement.requestPointerLock();

	};

	this.unlock = function () {

		document.exitPointerLock();

	};

	this.update = function () {

		if(!this.isLocked) return
		
		direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveLeft ) - Number( moveRight );
		direction.normalize(); 

		if(direction.x || direction.z) {
			if(velocity < this.maxSpeed) {
				velocity += this.acceleration
				velocity = +velocity.toFixed(3)

				if(velocity < this.minSpeed) {
					velocity = this.minSpeed	
				}
			}
		} else {
			velocity = 0
		}

		if(velocity) {
			this.getObject().position.x += -direction.x*(velocity * this.getObject().matrix.elements[0]) + 
											direction.z*(velocity * this.getObject().matrix.elements[2])
			this.getObject().position.z -= direction.x*(velocity * this.getObject().matrix.elements[2]) + 
											direction.z*(velocity * this.getObject().matrix.elements[0])
		}

		if(this.getObject().position.y > 2) {
			this.getObject().position.y -= 0.2;
		}

		if(jumpPower > 0) {
			this.getObject().position.y += this.jumpStep
			jumpPower -= this.jumpAttenuation
		}

		// TODO: search raycast with palyer
		if(this.getObject().position.y < 2) {
			this.getObject().position.y = 2;
			canJump = true
		}

	}

	this.connect();

};

PointerLockControls.prototype = Object.create( EventDispatcher.prototype );
PointerLockControls.prototype.constructor = PointerLockControls;

export { PointerLockControls };
