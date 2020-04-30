
import * as THREE from 'three'

class Scene extends THREE.Scene {

    constructor() {
        
        super()

        this.background = new THREE.Color(0x222222)
        this.camera = null
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.outputEncoding = THREE.GammaEncoding

        this.controls = null

        const animate = (function() {

            requestAnimationFrame( animate )
        
            if(this.controls) {

                this.controls.update()

            }

            if(this.camera) {

                this.renderer.render( this, this.camera )

            }
    
        }).bind(this)
      
        animate()

    }

    updateRendererSize() {

        if(!this.renderer.domElement.parentElement) {

            console.error('cant calc size without parent dom element')
            return
    
        }

        if(this.camera) {

            const parentElement = this.renderer.domElement.parentElement
            const width = parentElement.clientWidth
            const height = parentElement.clientHeight
            const aspect = width/height

            this.renderer.setSize(width, height)

            this.camera.aspect = aspect
            this.camera.updateProjectionMatrix()

        }      

    }

}

export { Scene }
