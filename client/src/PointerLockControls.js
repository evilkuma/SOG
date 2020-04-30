/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 * 
 * modify to player movement controller:
 * @author evilkuma / https://github.com/evilkuma
 */

import { Euler } from 'three'
import { Vector3 } from 'three'
import { EventDispatcher } from 'three'

var PointerLockControls = function ( object, domElement ) {

	this.cameraVerticalTurn = true

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

	if(domElement) {

		domElement.addEventListener('click', e => {
    
			this.lock()
		
		}, false)

	}

	const buttons = {
		MOVEFORW: [38, 87],	// up|w
		MOVEBACK: [40, 83], // down|s
		MOVEL: [37, 65], // left|a
		MOVER: [39, 68], // right|d
		JUMP: [32] // space
	}

	function onMouseMove( event ) {

		if ( scope.isLocked === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		if(this.cameraVerticalTurn) {
			euler.copy( object.camera_group.rotation )
			euler.y = object.rotation.y
		} else {
			euler.copy( object.rotation )
		}

		euler.y -= movementX * 0.002;
		euler.x -= movementY * 0.002;

		euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );

		if (this.cameraVerticalTurn) {
			object.camera_group.rotation.x = euler.x
			object.rotation.y = euler.y
			object.camera_group.rotation.z = euler.z
		} else {
			object.rotation.copy(euler)
		}

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
		
		if(buttons.MOVEFORW.includes(+event.keyCode)) {
			moveForward = true
		} else if(buttons.MOVEL.includes(+event.keyCode)) {
			moveLeft = true
		} else if(buttons.MOVEBACK.includes(+event.keyCode)) {
			moveBackward = true
		} else if(buttons.MOVER.includes(+event.keyCode)) {
			moveRight = true
		} else if(buttons.JUMP.includes(+event.keyCode)) {
			if(canJump === true) jumpPower = this.jumpPower;
			canJump = false;
		}

	}

	function onKeyUp(event) {
		
		if(buttons.MOVEFORW.includes(+event.keyCode)) {
			moveForward = false
		} else if(buttons.MOVEL.includes(+event.keyCode)) {
			moveLeft = false
		} else if(buttons.MOVEBACK.includes(+event.keyCode)) {
			moveBackward = false
		} else if(buttons.MOVER.includes(+event.keyCode)) {
			moveRight = false
		}

	}

	this.connect = function () {

		document.addEventListener( 'mousemove', onMouseMove.bind(this), false );
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

		return object;

	};

	this.getDirection = function () {

		var direction = new Vector3( 0, 0, - 1 );

		return function ( v ) {

			return v.copy( direction ).applyQuaternion( object.quaternion );

		};

	}();

	this.lock = function () {

		this.domElement.requestPointerLock();

	};

	this.unlock = function () {

		document.exitPointerLock();

	};

	this.addMoveLBtn = function() {

		buttons.MOVEL.push(...arguments)

	};

	this.addMoveRBtn = function() {

		buttons.MOVER.push(...arguments)

	};

	this.addMoveForwBtn = function() {

		buttons.MOVEFORW.push(...arguments)

	};

	this.addMoveBackBtn = function() {

		buttons.MOVEBACK.push(...arguments)

	};

	this.addJumpBtn = function() {

		buttons.JUMP.push(...arguments)

	};

	this.update = function () {

		if(!this.isLocked) return
		
		direction.z = Number( moveBackward ) - Number( moveForward );
		direction.x = Number( moveRight ) - Number( moveLeft );
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

			const real_dir = new Vector3(
				direction.x * object.matrix.elements[0] - direction.z * object.matrix.elements[2],
				0,
				direction.x * object.matrix.elements[2] + direction.z * object.matrix.elements[0]
			)

     		const mv = real_dir.clone().multiplyScalar(velocity)

			object.position.add(mv)
		}

		if(object.position.y > 2) {

			object.position.y -= 0.2;

		}

		if(jumpPower > 0) {

			object.position.y += this.jumpStep
			jumpPower -= this.jumpAttenuation

		}

		if(object.position.y < 2) {

			object.position.y = 2;
			canJump = true

		}

	}

	this.connect();

};

PointerLockControls.prototype = Object.create( EventDispatcher.prototype );
PointerLockControls.prototype.constructor = PointerLockControls;

export { PointerLockControls };
