import {AmbientLight, DirectionalLight, PerspectiveCamera, Scene, WebGL1Renderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

export const generateModel = (scene, setScene, container, camera, setCamera, group) => {
    setScene(new Scene())

    //camera
    setCamera(new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000))
    camera.position.set( 30, 30, 30 )

    //light
    const light = new AmbientLight( 0x404040 )
    scene.add( light )
    const directionalLight1 = new DirectionalLight( 0xffffff, 0.9 )
    directionalLight1.position.set(-5, 2, 8)
    scene.add( directionalLight1 )
    const directionalLight2 = new DirectionalLight( 0xffffff, 0.5 )
    directionalLight2.position.set(10, 2, -8)
    scene.add( directionalLight2 )

    //renderer
    const renderer = new WebGL1Renderer({alpha: true})
    renderer.setSize( window.innerWidth, window.innerHeight )
    container.current.innerHTML = ""
    container.current.appendChild( renderer.domElement )

    //controls
    let stop = false;
    const controls = new OrbitControls( camera, renderer.domElement)
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
    }
    controls.minDistance = 25
    controls.maxDistance = 200
    controls.update()
    controls.addEventListener( 'change', () => {
        stop = true
        renderer.render(scene, camera)
    })

    const animate = () => {
        if (!stop){
            requestAnimationFrame(animate)
            group.rotateY(0.004)
            renderer.render( scene, camera )
        }
    }
    animate()
    let image = renderer.domElement.toDataURL()

    return {image: image}
}
